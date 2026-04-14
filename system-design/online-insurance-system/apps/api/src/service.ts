import { v4 as uuidv4 } from "uuid";
import {
  type Claim,
  type ClaimStatus,
  CreateClaimRequestSchema,
  CreatePolicyRequestSchema,
  CreateQuoteRequestSchema,
  type DatabaseState,
  type Invoice,
  PayInvoiceRequestSchema,
  type Policy,
  type Quote
} from "@insurance/shared";
import type { z } from "zod";
import { AppError } from "./errors.js";

type CreateQuoteInput = z.infer<typeof CreateQuoteRequestSchema>;
type CreatePolicyInput = z.infer<typeof CreatePolicyRequestSchema>;
type CreateClaimInput = z.infer<typeof CreateClaimRequestSchema>;
type PayInvoiceInput = z.infer<typeof PayInvoiceRequestSchema>;

function priceQuote(input: CreateQuoteInput) {
  const baseRate = 0.018;
  const ageFactor = input.riskData.age > 55 ? 1.2 : input.riskData.age < 30 ? 0.95 : 1;
  const claimsFactor = 1 + input.riskData.priorClaimsCount * 0.08;
  const cityFactor = input.riskData.cityTier === "tier1" ? 1.1 : input.riskData.cityTier === "tier2" ? 1 : 0.92;
  const addOnFactor = 1 + input.coverageSelection.addOns.length * 0.03;
  const riskScore = Number((ageFactor * claimsFactor * cityFactor * addOnFactor).toFixed(3));
  const premium = Number((input.coverageSelection.sumInsured * baseRate * riskScore).toFixed(2));

  return {
    premium,
    riskScore
  };
}

function findIdempotentPayload<T>(state: DatabaseState, operation: string, key: string): T | undefined {
  return state.idempotency.find((entry) => entry.operation === operation && entry.key === key)?.payload as T | undefined;
}

function saveIdempotentPayload(state: DatabaseState, operation: string, key: string, payload: unknown) {
  state.idempotency.push({
    operation,
    key,
    payload,
    createdAt: new Date().toISOString()
  });
}

function writeAudit(
  state: DatabaseState,
  action: string,
  entityType: "quote" | "policy" | "claim" | "invoice" | "payment",
  entityId: string,
  traceId: string,
  actor = "system"
) {
  state.auditEvents.push({
    id: uuidv4(),
    action,
    actor,
    entityType,
    entityId,
    traceId,
    createdAt: new Date().toISOString()
  });
}

export function createQuote(state: DatabaseState, input: CreateQuoteInput, traceId: string): Quote {
  const idempotent = findIdempotentPayload<Quote>(state, "createQuote", input.idempotencyKey);
  if (idempotent) {
    return idempotent;
  }

  const { premium, riskScore } = priceQuote(input);
  const quote: Quote = {
    quoteId: uuidv4(),
    customerId: input.customerId,
    productId: input.productId,
    premium,
    deductible: input.coverageSelection.deductible,
    coverage: input.coverageSelection.sumInsured,
    riskScore,
    status: "active",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString()
  };

  state.quotes.push(quote);
  saveIdempotentPayload(state, "createQuote", input.idempotencyKey, quote);
  writeAudit(state, "quote.created", "quote", quote.quoteId, traceId, input.customerId);
  return quote;
}

export function issuePolicy(state: DatabaseState, input: CreatePolicyInput, traceId: string): Policy {
  const idempotent = findIdempotentPayload<Policy>(state, "issuePolicy", input.idempotencyKey);
  if (idempotent) {
    return idempotent;
  }

  const quote = state.quotes.find((q) => q.quoteId === input.quoteId);
  if (!quote) {
    throw new AppError("Quote not found", 404);
  }
  if (quote.status !== "active") {
    throw new AppError("Quote is not active", 409);
  }
  if (new Date(quote.expiresAt).getTime() < Date.now()) {
    throw new AppError("Quote expired", 409);
  }

  quote.status = "bound";

  const policy: Policy = {
    policyId: uuidv4(),
    policyNo: `POL-${Date.now()}`,
    customerId: quote.customerId,
    productId: quote.productId,
    quoteId: quote.quoteId,
    status: "active",
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
    premium: quote.premium,
    deductible: quote.deductible,
    version: 1
  };

  const invoice: Invoice = {
    invoiceId: uuidv4(),
    policyId: policy.policyId,
    amount: policy.premium,
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
    status: "pending"
  };

  state.policies.push(policy);
  state.invoices.push(invoice);
  saveIdempotentPayload(state, "issuePolicy", input.idempotencyKey, policy);
  writeAudit(state, "policy.issued", "policy", policy.policyId, traceId, policy.customerId);
  writeAudit(state, "invoice.created", "invoice", invoice.invoiceId, traceId, policy.customerId);

  return policy;
}

export function getPolicy(state: DatabaseState, policyId: string): Policy {
  const policy = state.policies.find((item) => item.policyId === policyId);
  if (!policy) {
    throw new AppError("Policy not found", 404);
  }

  return policy;
}

export function submitClaim(state: DatabaseState, input: CreateClaimInput, traceId: string): Claim {
  const idempotent = findIdempotentPayload<Claim>(state, "submitClaim", input.idempotencyKey);
  if (idempotent) {
    return idempotent;
  }

  const policy = state.policies.find((item) => item.policyId === input.policyId);
  if (!policy) {
    throw new AppError("Policy not found", 404);
  }
  if (policy.status !== "active") {
    throw new AppError("Claims allowed only for active policies", 409);
  }

  const claim: Claim = {
    claimId: uuidv4(),
    claimNo: `CLM-${Date.now()}`,
    policyId: input.policyId,
    status: "submitted",
    incidentDate: input.incidentDate,
    reportedAt: new Date().toISOString(),
    description: input.description,
    documents: input.documents,
    version: 1
  };

  state.claims.push(claim);
  saveIdempotentPayload(state, "submitClaim", input.idempotencyKey, claim);
  writeAudit(state, "claim.submitted", "claim", claim.claimId, traceId, policy.customerId);

  return claim;
}

const allowedTransitions: Record<ClaimStatus, ClaimStatus[]> = {
  submitted: ["triaged", "rejected"],
  triaged: ["settled", "rejected"],
  settled: [],
  rejected: []
};

export function transitionClaim(state: DatabaseState, claimId: string, toStatus: ClaimStatus, traceId: string): Claim {
  const claim = state.claims.find((item) => item.claimId === claimId);
  if (!claim) {
    throw new AppError("Claim not found", 404);
  }

  if (!allowedTransitions[claim.status].includes(toStatus)) {
    throw new AppError(`Invalid claim transition ${claim.status} -> ${toStatus}`, 409);
  }

  claim.status = toStatus;
  claim.version += 1;
  writeAudit(state, `claim.${toStatus}`, "claim", claim.claimId, traceId);
  return claim;
}

export function createRenewalQuote(state: DatabaseState, policyId: string, traceId: string): Quote {
  const policy = state.policies.find((item) => item.policyId === policyId);
  if (!policy) {
    throw new AppError("Policy not found", 404);
  }
  if (policy.status !== "active") {
    throw new AppError("Only active policy can be renewed", 409);
  }

  const quote: Quote = {
    quoteId: uuidv4(),
    customerId: policy.customerId,
    productId: policy.productId,
    premium: Number((policy.premium * 1.06).toFixed(2)),
    deductible: policy.deductible,
    coverage: policy.premium * 100,
    riskScore: 1.06,
    status: "active",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
  };

  state.quotes.push(quote);
  writeAudit(state, "renewal.quote.created", "quote", quote.quoteId, traceId, policy.customerId);

  return quote;
}

export function renewPolicy(state: DatabaseState, policyId: string, traceId: string): Policy {
  const policy = state.policies.find((item) => item.policyId === policyId);
  if (!policy) {
    throw new AppError("Policy not found", 404);
  }
  if (policy.status !== "active") {
    throw new AppError("Only active policy can be renewed", 409);
  }

  policy.endAt = new Date(new Date(policy.endAt).getTime() + 1000 * 60 * 60 * 24 * 365).toISOString();
  policy.version += 1;
  writeAudit(state, "policy.renewed", "policy", policy.policyId, traceId, policy.customerId);

  return policy;
}

export function payInvoice(state: DatabaseState, invoiceId: string, input: PayInvoiceInput, traceId: string) {
  const idempotent = findIdempotentPayload(state, "payInvoice", input.idempotencyKey);
  if (idempotent) {
    return idempotent;
  }

  const invoice = state.invoices.find((item) => item.invoiceId === invoiceId);
  if (!invoice) {
    throw new AppError("Invoice not found", 404);
  }

  if (invoice.status === "paid") {
    throw new AppError("Invoice already paid", 409);
  }

  invoice.status = "paid";
  const payment = {
    paymentId: uuidv4(),
    invoiceId,
    providerRef: input.providerRef,
    status: "success" as const,
    idempotencyKey: input.idempotencyKey,
    createdAt: new Date().toISOString()
  };
  state.payments.push(payment);

  const payload = {
    invoice,
    payment
  };

  saveIdempotentPayload(state, "payInvoice", input.idempotencyKey, payload);
  writeAudit(state, "invoice.paid", "invoice", invoiceId, traceId);
  writeAudit(state, "payment.success", "payment", payment.paymentId, traceId);

  return payload;
}
