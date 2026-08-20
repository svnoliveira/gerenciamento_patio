import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function serverApiFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const doFetch = (token: string | undefined) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

  let res = await doFetch(accessToken);

  if (res.status === 401) {
    const refreshToken = cookieStore.get("refresh_token")?.value;
    if (refreshToken) {
      const refreshRes = await fetch(`${API_URL}/refresh/`, {
        method: "POST",
        headers: { Cookie: `refresh_token=${refreshToken}` },
      });

      if (refreshRes.ok) {
        const { access } = await refreshRes.json();

        try {
          cookieStore.set("access_token", access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        } catch {
          console.warn("cookie set skipped, non-action context:", path);
        }

        res = await doFetch(access);
      }
    }
  }

  return res;
}
