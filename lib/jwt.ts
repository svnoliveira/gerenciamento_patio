export function getTokenExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    return decoded.exp ?? null;
  } catch {
    return null;
  }
}

export function isExpiringSoon(token: string, bufferSeconds = 30): boolean {
  const exp = getTokenExpiry(token);
  if (!exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return exp - now < bufferSeconds;
}
