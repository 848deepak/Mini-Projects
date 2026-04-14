import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import { randomUUID } from "node:crypto";
import {
  CreateClaimRequestSchema,
  CreatePolicyRequestSchema,
  CreateQuoteRequestSchema,
  PayInvoiceRequestSchema
} from "@insurance/shared";
import { config } from "./config.js";
import { AppError } from "./errors.js";
import { logger } from "./logger.js";
import {
  createQuote,
  createRenewalQuote,
  getPolicy,
  issuePolicy,
  payInvoice,
  renewPolicy,
  submitClaim,
  transitionClaim
} from "./service.js";
import { mutateState, readState } from "./storage.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers["x-request-id"]?.toString() ?? randomUUID()
  })
);
app.use(
  "/v1",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

function getTraceId(req: express.Request): string {
  return req.headers["x-request-id"]?.toString() ?? randomUUID();
}

app.post("/v1/quotes", async (req, res, next) => {
  try {
    const input = CreateQuoteRequestSchema.parse(req.body);
    const quote = await mutateState((state) => createQuote(state, input, getTraceId(req)));
    res.status(201).json(quote);
  } catch (error) {
    next(error);
  }
});

app.post("/v1/policies", async (req, res, next) => {
  try {
    const input = CreatePolicyRequestSchema.parse(req.body);
    const policy = await mutateState((state) => issuePolicy(state, input, getTraceId(req)));
    res.status(201).json(policy);
  } catch (error) {
    next(error);
  }
});

app.get("/v1/policies/:policyId", async (req, res, next) => {
  try {
    const state = await readState();
    const policy = getPolicy(state, req.params.policyId);
    const invoices = state.invoices.filter((item) => item.policyId === policy.policyId);
    const claims = state.claims.filter((item) => item.policyId === policy.policyId);
    res.status(200).json({ policy, invoices, claims });
  } catch (error) {
    next(error);
  }
});

app.post("/v1/claims", async (req, res, next) => {
  try {
    const input = CreateClaimRequestSchema.parse(req.body);
    const claim = await mutateState((state) => submitClaim(state, input, getTraceId(req)));
    res.status(201).json(claim);
  } catch (error) {
    next(error);
  }
});

app.post("/v1/claims/:claimId/triage", async (req, res, next) => {
  try {
    const claim = await mutateState((state) => transitionClaim(state, req.params.claimId, "triaged", getTraceId(req)));
    res.status(200).json(claim);
  } catch (error) {
    next(error);
  }
});

app.post("/v1/claims/:claimId/settle", async (req, res, next) => {
  try {
    const claim = await mutateState((state) => transitionClaim(state, req.params.claimId, "settled", getTraceId(req)));
    res.status(200).json(claim);
  } catch (error) {
    next(error);
  }
});

app.post("/v1/claims/:claimId/reject", async (req, res, next) => {
  try {
    const claim = await mutateState((state) => transitionClaim(state, req.params.claimId, "rejected", getTraceId(req)));
    res.status(200).json(claim);
  } catch (error) {
    next(error);
  }
});

app.get("/v1/policies/:policyId/renewal-quote", async (req, res, next) => {
  try {
    const quote = await mutateState((state) => createRenewalQuote(state, req.params.policyId, getTraceId(req)));
    res.status(200).json(quote);
  } catch (error) {
    next(error);
  }
});

app.post("/v1/policies/:policyId/renew", async (req, res, next) => {
  try {
    const policy = await mutateState((state) => renewPolicy(state, req.params.policyId, getTraceId(req)));
    res.status(200).json(policy);
  } catch (error) {
    next(error);
  }
});

app.post("/v1/invoices/:invoiceId/pay", async (req, res, next) => {
  try {
    const input = PayInvoiceRequestSchema.parse(req.body);
    const result = await mutateState((state) => payInvoice(state, req.params.invoiceId, input, getTraceId(req)));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof Error && "issues" in error) {
    res.status(400).json({ message: "Validation failed", details: (error as { issues: unknown }).issues });
    return;
  }

  logger.error({ err: error }, "Unhandled error");
  res.status(500).json({ message: "Internal server error" });
});
