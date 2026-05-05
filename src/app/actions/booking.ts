"use server";

const API_URL = process.env.API_URL || "http://localhost:3000";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  height: string;
  weight: string;
}

export interface PendingAppointment {
  id: number;
  token: string;
  date: string;
  time: string;
  services: string[];
  amountDue: string;
  locationName: string;
  locationArea: string;
  locationCity: string;
}

export interface ActiveMembership {
  id: number;
  plan: string;
  startDate: string;
  expiresAt: string;
  nextFreeScanDate: string | null;
}

export async function checkPendingAppointment(
  authToken: string
): Promise<{
  profile?: UserProfile;
  pendingAppointment?: PendingAppointment | null;
  activeMembership?: ActiveMembership | null;
  unauthorized?: boolean;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_URL}/bookings/pending`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status === 401) {
      return { unauthorized: true };
    }
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || "Failed to check pending appointment" };
    }
    return {
      profile: data.profile || undefined,
      pendingAppointment: data.pendingAppointment || null,
      activeMembership: data.activeMembership || null,
    };
  } catch {
    return { error: "Network error" };
  }
}

export interface ConfirmBookingPayload {
  eventId: number;
  service: string;
  startTime: string;
  name: string;
  gender: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  couponCode?: string;
}

export interface BookingResult {
  id: number;
  date: string;
  time: string;
  services: string[];
  amountDue: string;
  locationName: string;
  locationArea: string;
  locationCity: string;
}

export async function confirmBooking(
  authToken: string,
  payload: ConfirmBookingPayload
): Promise<{
  success: boolean;
  appointment?: BookingResult;
  unauthorized?: boolean;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_URL}/bookings/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });
    if (res.status === 401) {
      return { success: false, unauthorized: true };
    }
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Booking failed" };
    }
    return { success: true, appointment: data.appointment };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

export interface CouponValidationResult {
  valid: boolean;
  discount?: number;
  finalAmount?: number;
  coupon?: {
    id: number;
    code: string;
    discountType: string;
    discountValue: number;
    description: string | null;
  };
  error?: string;
}

export async function validateCoupon(
  authToken: string,
  payload: { code: string; eventId: number; service: string; amount: number }
): Promise<CouponValidationResult> {
  try {
    const res = await fetch(`${API_URL}/coupons/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return { valid: false, error: data.error || "Invalid coupon" };
    }
    return {
      valid: true,
      discount: data.discount,
      finalAmount: data.finalAmount,
      coupon: data.coupon,
    };
  } catch {
    return { valid: false, error: "Network error. Please try again." };
  }
}

export async function cancelAppointment(
  appointmentId: number,
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/bookings/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId, token }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Failed to cancel" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}
