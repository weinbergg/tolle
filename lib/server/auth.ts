/**
 * Minimal MVP auth for the admin panel: a shared passcode sent in the
 * `x-admin-key` header. Configure via the ADMIN_PASSWORD env var; falls back to
 * a default for local development. Replace with real auth before production.
 */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "toli-admin";

export function isAuthorized(request: Request): boolean {
  const key = request.headers.get("x-admin-key");
  return !!key && key === ADMIN_PASSWORD;
}

export function checkPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}
