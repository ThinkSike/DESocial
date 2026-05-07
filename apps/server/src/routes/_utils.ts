import crypto from "node:crypto";

export function uuidv4(): string {
  return crypto.randomUUID();
}
