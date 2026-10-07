import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CLASS_COOKIE, hasClassAccess, isClassAccessConfigured } from "@/lib/class-access";
import { getPhone } from "@/lib/students";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "private, no-store" };

/** Returns one student's phone number, only to browsers that hold the class cookie. */
export async function GET(_request: Request, ctx: RouteContext<"/api/phone/[slug]">) {
  if (!isClassAccessConfigured()) {
    return NextResponse.json({ error: "not-configured" }, { status: 503, headers: NO_STORE });
  }

  const store = await cookies();
  if (!hasClassAccess(store.get(CLASS_COOKIE)?.value)) {
    return NextResponse.json({ error: "locked" }, { status: 401, headers: NO_STORE });
  }

  const { slug } = await ctx.params;
  const phone = getPhone(slug);
  if (!phone) return NextResponse.json({ error: "no-phone" }, { status: 404, headers: NO_STORE });

  return NextResponse.json(phone, { headers: NO_STORE });
}
