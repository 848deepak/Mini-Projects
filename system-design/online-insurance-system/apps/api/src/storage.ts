import { promises as fs } from "node:fs";
import path from "node:path";
import type { DatabaseState } from "@insurance/shared";

const dbPath = path.resolve(process.cwd(), "apps/api/data/db.json");

const defaultState: DatabaseState = {
  quotes: [],
  policies: [],
  claims: [],
  invoices: [],
  payments: [],
  idempotency: [],
  auditEvents: []
};

let writeQueue: Promise<void> = Promise.resolve();

export async function readState(): Promise<DatabaseState> {
  try {
    const raw = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(raw) as DatabaseState;
  } catch {
    await writeState(defaultState);
    return structuredClone(defaultState);
  }
}

export async function writeState(state: DatabaseState): Promise<void> {
  const tmpPath = `${dbPath}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(state, null, 2), "utf-8");
  await fs.rename(tmpPath, dbPath);
}

export function mutateState<T>(mutator: (state: DatabaseState) => T | Promise<T>): Promise<T> {
  let output!: T;

  const operation = async () => {
    const state = await readState();
    output = await mutator(state);
    await writeState(state);
  };

  const next = writeQueue.then(operation, operation);
  writeQueue = next.then(
    () => undefined,
    () => undefined
  );

  return next.then(() => output);
}
