/**
 * Format number with appropriate decimal places
 */
export function formatNumber(value: number, decimals: number = 6): string {
  if (value === 0) return "0";

  // For very small numbers, use more decimals
  if (Math.abs(value) < 0.01) {
    return value.toFixed(8);
  }

  // For large numbers, still use the decimals parameter for precision
  if (Math.abs(value) >= 1000) {
    // Remove trailing zeros by converting to number then back to string with locale
    const formatted = value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });
    return formatted;
  }

  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format currency with symbol
 */
export function formatCurrency(
  value: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "USD" ? "USD" : "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Validate number input
 */
export function isValidNumber(value: string): boolean {
  if (!value) return false;
  const num = parseFloat(value);
  return !isNaN(num) && num > 0 && isFinite(num);
}

/**
 * Parse input to number safely
 */
export function parseNumberInput(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Truncate long text
 */
export function truncateText(text: string, maxLength: number = 20): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
