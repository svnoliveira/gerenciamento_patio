import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_DOMAIN =
  process.env.NODE_ENV === "production" ? ".lrnagricola.com.br" : undefined;

export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete({
    name: "access_token",
    path: "/",
    domain: COOKIE_DOMAIN,
  });
  cookieStore.delete({
    name: "refresh_token",
    path: "/",
    domain: COOKIE_DOMAIN,
  });

  const BASE_URL =
    process.env.NEXT_PUBLIC_APP_URL || `https://${request.headers.get("host")}`;
  return NextResponse.redirect(new URL("/login", BASE_URL));
}
