export const BASE_PRICE = 2999;

export const VALID_COUPONS: Record<
  string,
  { discount: number; label: string }
> = {
  FIRST50: { discount: 50, label: "50% off your first scan" },
  BODYINSIGHT: { discount: 20, label: "20% off" },
  WELCOME: { discount: 10, label: "10% off" },
};

export function formatPrice(n: number): string {
  return "\u20B9" + n.toLocaleString("en-IN");
}
