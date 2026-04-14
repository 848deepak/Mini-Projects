import { describe, expect, it } from "vitest";
import type { DatabaseState } from "@insurance/shared";
import { AppError } from "../src/errors.js";
import { createQuote, issuePolicy, submitClaim, transitionClaim } from "../src/service.js";

function state(): DatabaseState {
  return {
    quotes: [],
    policies: [],
    claims: [],
    invoices: [],
    payments: [],
    idempotency: [],
    auditEvents: []
  };
}

describe("service idempotency", () => {
  it("returns the same quote for same idempotency key", () => {
    const db = state();
    const payload = {
      customerId: "cust-1",
      productId: "product-1",
      coverageSelection: {
        sumInsured: 200000,
        deductible: 5000,
        addOns: ["a"]
      },
      riskData: {
        age: 32,
        cityTier: "tier2" as const,
        priorClaimsCount: 0
      },
      idempotencyKey: "idem-quote-1"
    };

    const first = createQuote(db, payload, "trace-1");
    const second = createQuote(db, payload, "trace-2");

    expect(first.quoteId).toBe(second.quoteId);
    expect(db.quotes).toHaveLength(1);
  });
});

describe("claim transitions", () => {
  it("blocks invalid transition from submitted to settled", () => {
    const db = state();
    const quote = createQuote(
      db,
      {
        customerId: "cust-2",
        productId: "product-2",
        coverageSelection: {
          sumInsured: 300000,
          deductible: 10000,
          addOns: []
        },
        riskData: {
          age: 44,
          cityTier: "tier1",
          priorClaimsCount: 1
        },
        idempotencyKey: "idem-quote-2"
      },
      "trace-1"
    );

    const policy = issuePolicy(
      db,
      {
        quoteId: quote.quoteId,
        paymentMethod: "card",
        idempotencyKey: "idem-policy-1"
      },
      "trace-1"
    );

    const claim = submitClaim(
      db,
      {
        policyId: policy.policyId,
        incidentDate: new Date().toISOString(),
        description: "Hospitalization due to food poisoning with diagnostics.",
        documents: [],
        idempotencyKey: "idem-claim-1"
      },
      "trace-1"
    );

    expect(() => transitionClaim(db, claim.claimId, "settled", "trace-2")).toThrowError(AppError);
  });
});
