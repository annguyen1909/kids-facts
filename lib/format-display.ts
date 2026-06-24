/** Title-case a label for display (e.g. "savanna" → "Savanna", "tropical forest" → "Tropical Forest"). */
export function formatDisplayLabel(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatDisplayList(values: string[], separator = ", "): string {
  return values.map(formatDisplayLabel).join(separator);
}
