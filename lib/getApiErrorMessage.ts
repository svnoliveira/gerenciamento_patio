export async function getApiErrorMessage(
  res: Response,
  fallback: string,
): Promise<string> {
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

export async function parseError(
  res: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.detail === "string") return body.detail;
    const firstKey = Object.keys(body)[0];
    if (firstKey && Array.isArray(body[firstKey])) return body[firstKey][0];
    return fallback;
  } catch {
    return fallback;
  }
}
