import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  CLASS_COOKIE,
  CLASS_COOKIE_MAX_AGE,
  codeMatches,
  isClassAccessConfigured,
  makeAccessToken,
} from "@/lib/class-access";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

/** Exchanges the class code for a cookie that unlocks phone numbers. */
export async function POST(request: Request) {
  if (!isClassAccessConfigured()) {
    return NextResponse.json({ error: "not-configured" }, { status: 503, headers: NO_STORE });
  }

  let code = "";
  try {
    const body: unknown = await request.json();
    if (body && typeof body === "object" && "code" in body && typeof body.code === "string") {
      code = body.code;
    }
  } catch {
    // Not JSON: treated as a wrong code below.
  }

  if (!codeMatches(code)) {
    // A short delay makes guessing the code slower.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return NextResponse.json({ error: "invalid" }, { status: 401, headers: NO_STORE });
  }

  const store = await cookies();
  store.set(CLASS_COOKIE, makeAccessToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: CLASS_COOKIE_MAX_AGE,
    path: "/",
  });
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
}
