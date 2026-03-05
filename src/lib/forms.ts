export function formString(formData: FormData, key: string): string {
  return String(formData.get(key) || "").trim();
}

export function formOptionalString(
  formData: FormData,
  key: string
): string | undefined {
  const value = String(formData.get(key) || "").trim();
  return value || undefined;
}

export function formBoolean(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

export function formInteger(
  formData: FormData,
  key: string,
  fallback = 0
): number {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? Math.floor(value) : fallback;
}
