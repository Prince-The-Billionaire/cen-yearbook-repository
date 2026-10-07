// Server-only: the "class code" that unlocks phone numbers.
//
// Set CLASS_CODE (and optionally CLASS_COOKIE_SECRET) in the environment. If
// CLASS_CODE is missing or too short, phone numbers stay hidden for everyone:
// the feature fails closed. Changing the code signs everyone out.
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const CLASS_COOKIE = "cen_class";
export const CLASS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const classCode = () => process.env.CLASS_CODE?.trim() ?? "";

export const isClassAccessConfigured = () => classCode().length >= 4;

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

/** What the browser's cookie holds: an HMAC derived from the code, never the code itself. */
export function makeAccessToken() {
  const key = `${classCode()}:${process.env.CLASS_COOKIE_SECRET ?? ""}`;
  return createHmac("sha256", key).update("cen-class-access-v1").digest("hex");
}

export function codeMatches(input: string) {
  return isClassAccessConfigured() && safeEqual(input.trim(), classCode());
}

export function hasClassAccess(cookieValue?: string) {
  return isClassAccessConfigured() && !!cookieValue && safeEqual(cookieValue, makeAccessToken());
}
