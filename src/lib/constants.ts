export const BASE_PRICE = 2999;

export function formatPrice(n: number): string {
  return "\u20B9" + n.toLocaleString("en-IN");
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
