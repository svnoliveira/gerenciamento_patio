"use server";

import { cookies } from "next/headers";

const COOKIE_DOMAIN =
  process.env.NODE_ENV === "production" ? ".lrnagricola.com.br" : undefined;

export async function clearAuthCookies() {
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
}
