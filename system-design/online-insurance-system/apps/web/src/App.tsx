import { useMemo, useState } from "react";
import type { Claim, Policy, Quote } from "@insurance/shared";
import { api } from "./api";
import { SectionCard } from "./components/SectionCard";

type PolicyDetails = {
  policy: Policy;
  claims: Claim[];
  invoices: Array<{ invoiceId: string; status: string; amount: number }>;
};

function randomKey(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export default function App() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [claim, setClaim] = useState<Claim | null>(null);
  const [details, setDetails] = useState<PolicyDetails | null>(null);
  const [renewalQuote, setRenewalQuote] = useState<Quote | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const policyId = useMemo(() => policy?.policyId ?? details?.policy.policyId ?? "", [policy, details]);

  async function withAction(action: string, task: () => Promise<void>) {
    try {
      setBusy(action);
      setError(null);
      await task();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected failure");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="page">
      <aside className="hero">
        <p className="eyebrow">NimbusCover</p>
        <h1>Insurance Operations Control Plane</h1>
        <p>
          Handle policy issuance, claims lifecycle, renewals, and invoice payment with consistent APIs and idempotent
          workflows.
        </p>
        <div className="chips">
          <span>State Guards</span>
          <span>Audit Trail</span>
          <span>Idempotency</span>
        </div>
      </aside>

      <main className="content">
        {error ? <div className="alert">{error}</div> : null}

        <SectionCard title="1. Create Quote" subtitle="Risk-based pricing with deterministic calculation">
          <button
            disabled={busy === "quote"}
            onClick={() =>
              withAction("quote", async () => {
                const next = await api.createQuote({
                  customerId: "cust-001",
                  productId: "health-premium",
                  coverageSelection: {
                    sumInsured: 750000,
                    deductible: 15000,
                    addOns: ["critical-illness", "cashless-plus"]
                  },
                  riskData: {
                    age: 34,
                    cityTier: "tier1",
                    priorClaimsCount: 1
                  },
                  idempotencyKey: randomKey("quote")
                });
                setQuote(next);
              })
            }
          >
            {busy === "quote" ? "Generating..." : "Generate Quote"}
          </button>
          {quote ? (
            <div className="result">
              <p>Quote: {quote.quoteId}</p>
              <p>Premium: INR {quote.premium.toLocaleString()}</p>
              <p>Expires: {new Date(quote.expiresAt).toLocaleString()}</p>
            </div>
          ) : null}
        </SectionCard>

        <SectionCard title="2. Issue Policy" subtitle="Quote binding and invoice generation">
          <button
            disabled={!quote || busy === "policy"}
            onClick={() =>
              withAction("policy", async () => {
                if (!quote) {
                  return;
                }

                const next = await api.createPolicy({
                  quoteId: quote.quoteId,
                  paymentMethod: "card",
                  idempotencyKey: randomKey("policy")
                });
                setPolicy(next);
              })
            }
          >
            {busy === "policy" ? "Issuing..." : "Issue Policy"}
          </button>
          {policy ? (
            <div className="result">
              <p>Policy: {policy.policyNo}</p>
              <p>Status: {policy.status}</p>
              <p>
                Coverage Window: {new Date(policy.startAt).toLocaleDateString()} {" -> "}
                {new Date(policy.endAt).toLocaleDateString()}
              </p>
            </div>
          ) : null}
        </SectionCard>

        <SectionCard title="3. View Policy" subtitle="Fetch policy with claim and invoice state">
          <button
            disabled={!policyId || busy === "fetch"}
            onClick={() =>
              withAction("fetch", async () => {
                const payload = await api.getPolicyDetails(policyId);
                setDetails(payload);
              })
            }
          >
            {busy === "fetch" ? "Loading..." : "Refresh Details"}
          </button>
          {details ? (
            <div className="result">
              <p>Invoices: {details.invoices.length}</p>
              <p>Claims: {details.claims.length}</p>
            </div>
          ) : null}
        </SectionCard>

        <SectionCard title="4. Submit Claim" subtitle="Claim intake with evidence metadata">
          <button
            disabled={!policyId || busy === "claim"}
            onClick={() =>
              withAction("claim", async () => {
                const next = await api.submitClaim({
                  policyId,
                  incidentDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                  description: "Minor hospitalization and diagnostics charges.",
                  documents: [
                    {
                      name: "discharge-summary.pdf",
                      uri: "https://example.com/discharge-summary.pdf",
                      docType: "report"
                    }
                  ],
                  idempotencyKey: randomKey("claim")
                });
                setClaim(next);
              })
            }
          >
            {busy === "claim" ? "Submitting..." : "Submit Claim"}
          </button>
          {claim ? (
            <div className="result">
              <p>Claim: {claim.claimNo}</p>
              <p>Status: {claim.status}</p>
            </div>
          ) : null}
        </SectionCard>

        <SectionCard title="5. Claim Decisions" subtitle="Guarded transitions only">
          <div className="actions">
            <button
              disabled={!claim || busy === "triage"}
              onClick={() =>
                withAction("triage", async () => {
                  if (!claim) {
                    return;
                  }
                  const next = await api.triageClaim(claim.claimId);
                  setClaim(next);
                })
              }
            >
              Triage
            </button>
            <button
              disabled={!claim || busy === "settle"}
              onClick={() =>
                withAction("settle", async () => {
                  if (!claim) {
                    return;
                  }
                  const next = await api.settleClaim(claim.claimId);
                  setClaim(next);
                })
              }
            >
              Settle
            </button>
            <button
              disabled={!claim || busy === "reject"}
              onClick={() =>
                withAction("reject", async () => {
                  if (!claim) {
                    return;
                  }
                  const next = await api.rejectClaim(claim.claimId);
                  setClaim(next);
                })
              }
            >
              Reject
            </button>
          </div>
        </SectionCard>

        <SectionCard title="6. Renewal" subtitle="Generate renewal quote and extend policy period">
          <div className="actions">
            <button
              disabled={!policyId || busy === "renewalQuote"}
              onClick={() =>
                withAction("renewalQuote", async () => {
                  const next = await api.renewalQuote(policyId);
                  setRenewalQuote(next);
                })
              }
            >
              Create Renewal Quote
            </button>
            <button
              disabled={!policyId || busy === "renew"}
              onClick={() =>
                withAction("renew", async () => {
                  const next = await api.renewPolicy(policyId);
                  setPolicy(next);
                })
              }
            >
              Renew Policy
            </button>
          </div>
          {renewalQuote ? <div className="result">Renewal premium: INR {renewalQuote.premium.toLocaleString()}</div> : null}
        </SectionCard>

        <SectionCard title="7. Pay Invoice" subtitle="Idempotent payment posting">
          <button
            disabled={!details?.invoices?.[0] || busy === "pay"}
            onClick={() =>
              withAction("pay", async () => {
                const invoice = details?.invoices?.[0];
                if (!invoice) {
                  return;
                }

                await api.payInvoice(invoice.invoiceId, {
                  providerRef: `gateway-${Math.floor(Math.random() * 100000)}`,
                  idempotencyKey: randomKey("pay")
                });

                if (policyId) {
                  const payload = await api.getPolicyDetails(policyId);
                  setDetails(payload);
                }
              })
            }
          >
            {busy === "pay" ? "Paying..." : "Pay First Invoice"}
          </button>
        </SectionCard>
      </main>
    </div>
  );
}
