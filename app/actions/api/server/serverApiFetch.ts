import { cookies } from "next/headers";
import { isExpiringSoon } from "@/lib/jwt";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function tryPersistToken(access: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set("access_token", access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  } catch {}
}

async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  const refreshRes = await fetch(`${API_URL}/refresh/`, {
    method: "POST",
    headers: { Cookie: `refresh_token=${refreshToken}` },
  });
  if (!refreshRes.ok) return null;
  const { access } = await refreshRes.json();
  return access ?? null;
}

export async function serverApiFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (accessToken && isExpiringSoon(accessToken) && refreshToken) {
    const fresh = await refreshAccessToken(refreshToken);
    if (fresh) {
      accessToken = fresh;
      await tryPersistToken(fresh);
    }
  }

  const doFetch = (token: string | undefined) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

  let res = await doFetch(accessToken);

  if (res.status === 401 && refreshToken) {
    const fresh = await refreshAccessToken(refreshToken);
    if (fresh) {
      await tryPersistToken(fresh);
      res = await doFetch(fresh);
    }
  }

  return res;
}
