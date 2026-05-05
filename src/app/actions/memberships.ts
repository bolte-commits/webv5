"use server";

const API_URL = process.env.API_URL || "http://localhost:3000";

export type Plan = "3m" | "6m" | "12m";

export interface CouponPlan {
  plan: Plan;
  price: string;
}

export async function lookupMembershipCoupon(
  couponCode: string,
): Promise<{
  success: boolean;
  coupon?: { code: string; description: string | null; plans: CouponPlan[] };
  error?: string;
}> {
  try {
    const res = await fetch(`${API_URL}/memberships/lookup-coupon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ couponCode }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || "Coupon lookup failed" };
    return { success: true, coupon: data };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

export async function createMembershipOrder(
  token: string,
  body: {
    plan: Plan;
    startDate: string;
    couponCode: string;
  },
): Promise<{
  success: boolean;
  order?: {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
    plan: Plan;
    startDate: string;
    coupon: { code: string; discount: number };
  };
  error?: string;
}> {
  try {
    const res = await fetch(`${API_URL}/memberships/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || "Could not create order" };
    return { success: true, order: data };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

export async function verifyMembership(
  token: string,
  body: {
    orderId: string;
    paymentId: string;
    signature: string;
    plan: Plan;
    startDate: string;
    couponCode: string;
  },
): Promise<{
  success: boolean;
  membership?: { id: number; plan: Plan; startDate: string; expiresAt: string };
  error?: string;
}> {
  try {
    const res = await fetch(`${API_URL}/memberships/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || "Verification failed" };
    return { success: true, membership: data.membership };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}
