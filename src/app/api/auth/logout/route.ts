import { NextResponse } from "next/server";
import { destroyUserSession } from "@/lib/auth/session";

export async function POST() {
  await destroyUserSession();
  return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_URL || "http://localhost:3000"));
}
