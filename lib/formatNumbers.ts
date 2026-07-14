export function formatCellphone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 3) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 7)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function formatCPF(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatPlate(value: string): string {
  const clean = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  const pattern = ["L", "L", "L", "N", "L", "N", "N"];

  let result = "";
  for (let i = 0; i < clean.length && i < pattern.length; i++) {
    const char = clean[i];
    const expectsLetter = pattern[i] === "L";
    const isLetter = /[A-Z]/.test(char);
    const isDigit = /[0-9]/.test(char);

    if (expectsLetter && isLetter) result += char;
    else if (!expectsLetter && isDigit) result += char;
  }

  return result;
}
