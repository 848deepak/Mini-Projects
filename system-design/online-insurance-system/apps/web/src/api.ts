import type { Claim, Policy, Quote } from "@insurance/shared";

const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "x-request-id": crypto.randomUUID(),
      ...(init?.headers ?? {})
    },
    ...init
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message ?? "Request failed");
  }

  return payload as T;
}

export const api = {
  createQuote: (input: unknown) =>
    request<Quote>("/v1/quotes", {
      method: "POST",
      body: JSON.stringify(input)
    }),

  createPolicy: (input: unknown) =>
    request<Policy>("/v1/policies", {
      method: "POST",
      body: JSON.stringify(input)
    }),

  getPolicyDetails: (policyId: string) =>
    request<{ policy: Policy; claims: Claim[]; invoices: Array<{ invoiceId: string; status: string; amount: number }> }>(
      `/v1/policies/${policyId}`
    ),

  submitClaim: (input: unknown) =>
    request<Claim>("/v1/claims", {
      method: "POST",
      body: JSON.stringify(input)
    }),

  triageClaim: (claimId: string) =>
    request<Claim>(`/v1/claims/${claimId}/triage`, {
      method: "POST"
    }),

  settleClaim: (claimId: string) =>
    request<Claim>(`/v1/claims/${claimId}/settle`, {
      method: "POST"
    }),

  rejectClaim: (claimId: string) =>
    request<Claim>(`/v1/claims/${claimId}/reject`, {
      method: "POST"
    }),

  renewalQuote: (policyId: string) => request<Quote>(`/v1/policies/${policyId}/renewal-quote`),

  renewPolicy: (policyId: string) =>
    request<Policy>(`/v1/policies/${policyId}/renew`, {
      method: "POST"
    }),

  payInvoice: (invoiceId: string, input: unknown) =>
    request<{ payment: { paymentId: string }; invoice: { status: string } }>(`/v1/invoices/${invoiceId}/pay`, {
      method: "POST",
      body: JSON.stringify(input)
    })
};
