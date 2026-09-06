import { getFriendlyErrorMessage } from "./getFriendlyErrorMessage";

export async function getApiErrorMessage(
  res: Response,
  fallback: string,
): Promise<string> {
  if (res.status === 401 || res.status === 403 || res.status >= 500) {
    return getFriendlyErrorMessage(res.status);
  }

  try {
    const body = await res.json();
    if (typeof body?.detail === "string") return body.detail;
    const firstKey = Object.keys(body)[0];
    if (firstKey && Array.isArray(body[firstKey])) {
      return body[firstKey][0];
    }
    return fallback;
  } catch {
    return fallback;
  }
}
