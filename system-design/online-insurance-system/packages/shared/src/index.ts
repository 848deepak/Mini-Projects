import { z } from "zod";

export const CreateQuoteRequestSchema = z.object({
  customerId: z.string().min(3),
  productId: z.string().min(3),
  coverageSelection: z.object({
    sumInsured: z.number().positive(),
    deductible: z.number().nonnegative(),
    addOns: z.array(z.string()).default([])
  }),
  riskData: z.object({
    age: z.number().int().min(18).max(100),
    cityTier: z.enum(["tier1", "tier2", "tier3"]),
    priorClaimsCount: z.number().int().min(0).max(50)
  }),
  idempotencyKey: z.string().min(8)
});

export const CreatePolicyRequestSchema = z.object({
  quoteId: z.string().min(3),
  paymentMethod: z.enum(["card", "bank_transfer", "upi"]),
  idempotencyKey: z.string().min(8)
});

export const CreateClaimRequestSchema = z.object({
  policyId: z.string().min(3),
  incidentDate: z.string().datetime(),
  description: z.string().min(10).max(4000),
  documents: z.array(
    z.object({
      name: z.string().min(3),
      uri: z.string().url(),
      docType: z.enum(["invoice", "photo", "report", "other"])
    })
  ).max(20),
  idempotencyKey: z.string().min(8)
});

export const PayInvoiceRequestSchema = z.object({
  idempotencyKey: z.string().min(8),
  providerRef: z.string().min(3)
});

export type QuoteStatus = "active" | "expired" | "bound";
export type PolicyStatus = "pending" | "active" | "cancelled" | "expired";
export type ClaimStatus = "submitted" | "triaged" | "settled" | "rejected";
export type InvoiceStatus = "pending" | "paid";

export type Quote = {
  quoteId: string;
  customerId: string;
  productId: string;
  premium: number;
  deductible: number;
  coverage: number;
  riskScore: number;
  status: QuoteStatus;
  expiresAt: string;
  createdAt: string;
};

export type Policy = {
  policyId: string;
  policyNo: string;
  customerId: string;
  productId: string;
  quoteId: string;
  status: PolicyStatus;
  startAt: string;
  endAt: string;
  premium: number;
  deductible: number;
  version: number;
};

export type ClaimDocument = {
  name: string;
  uri: string;
  docType: "invoice" | "photo" | "report" | "other";
};

export type Claim = {
  claimId: string;
  claimNo: string;
  policyId: string;
  status: ClaimStatus;
  incidentDate: string;
  reportedAt: string;
  description: string;
  documents: ClaimDocument[];
  version: number;
};

export type Invoice = {
  invoiceId: string;
  policyId: string;
  amount: number;
  dueAt: string;
  status: InvoiceStatus;
};

export type Payment = {
  paymentId: string;
  invoiceId: string;
  providerRef: string;
  status: "success";
  idempotencyKey: string;
  createdAt: string;
};

export type IdempotencyRecord = {
  operation: string;
  key: string;
  payload: unknown;
  createdAt: string;
};

export type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  entityType: "quote" | "policy" | "claim" | "invoice" | "payment";
  entityId: string;
  traceId: string;
  createdAt: string;
};

export type DatabaseState = {
  quotes: Quote[];
  policies: Policy[];
  claims: Claim[];
  invoices: Invoice[];
  payments: Payment[];
  idempotency: IdempotencyRecord[];
  auditEvents: AuditEvent[];
};
