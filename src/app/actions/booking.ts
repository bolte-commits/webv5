"use server";

// TODO: Replace with your real backend URL
const API_BASE = process.env.API_BASE_URL || "https://api.bodyinsight.in";
const AUTH_API_BASE =
  "https://vzhsj8805e.execute-api.ap-south-1.amazonaws.com/prod";

function isAuthError(status: number, message?: string): boolean {
  if (status === 401 || status === 403) return true;
  if (message && /authentication|token|unauthorized|login required/i.test(message)) return true;
  return false;
}

export interface PendingDetails {
  pendingAppointmentId: string;
  landmark: string;
  area: string;
  date: string;
  time: string;
}

export async function checkPendingAppointment(
  token: string
): Promise<{ hasPending: boolean; details?: PendingDetails; unauthorized?: boolean; error?: string }> {
  try {
    const res = await fetch(`${AUTH_API_BASE}/checkPendingAppointment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (!res.ok && isAuthError(res.status, data.message)) {
      return { hasPending: false, unauthorized: true };
    }
    if (!res.ok) {
      return { hasPending: false, error: data.message };
    }
    if (data.hasPendingAppointment) {
      return {
        hasPending: true,
        details: {
          pendingAppointmentId: data.pendingAppointmentId,
          landmark: data.landmark,
          area: data.area,
          date: data.date,
          time: data.time,
        },
      };
    }
    return { hasPending: false };
  } catch {
    return { hasPending: false, error: "Network error" };
  }
}

export interface AppointmentDetails {
  landmark: string;
  area: string;
  amount: number;
  date: string;
  time: string;
}

export async function getAppointment(
  appointmentId: string
): Promise<{ success: boolean; details?: AppointmentDetails; error?: string }> {
  try {
    const res = await fetch(`${AUTH_API_BASE}/getAppointment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Failed to load appointment" };
    }
    return {
      success: true,
      details: {
        landmark: data.landmark,
        area: data.area,
        amount: data.amount,
        date: data.date,
        time: data.time,
      },
    };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

export async function cancelUpcomingAppointment(
  token: string,
  appointmentId: string
): Promise<{ success: boolean; unauthorized?: boolean; error?: string }> {
  try {
    const res = await fetch(`${AUTH_API_BASE}/cancelUpcomingAppointment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, appointmentId }),
    });
    const data = await res.json();
    if (!res.ok && isAuthError(res.status, data.message)) {
      return { success: false, unauthorized: true };
    }
    if (!res.ok) {
      return { success: false, error: data.message };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

export interface BookingPayload {
  token: string;
  appointmentId: string;
  name: string;
  dateOfBirth: string;
  phone?: string;
  coupon?: string;
  height?: number;
  weight?: number;
  gender?: string;
}

export interface BookingPricing {
  basePrice: number;
  discount: number;
  finalPrice: number;
}

export async function applyCouponCode(
  token: string,
  appointmentId: string,
  code: string
): Promise<{ success: boolean; pricing?: BookingPricing; unauthorized?: boolean; error?: string }> {
  try {
    const res = await fetch(`${AUTH_API_BASE}/applyCouponCode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, appointmentId, code }),
    });
    const data = await res.json();
    if (!res.ok && isAuthError(res.status, data.message)) {
      return { success: false, unauthorized: true };
    }
    if (!res.ok) {
      return { success: false, error: data.message || "Invalid coupon code" };
    }
    return {
      success: true,
      pricing: {
        basePrice: data.basePrice,
        discount: data.discount,
        finalPrice: data.finalPrice,
      },
    };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

export async function confirmBooking(
  data: BookingPayload
): Promise<{ success: boolean; pricing?: BookingPricing; unauthorized?: boolean; error?: string }> {
  try {
    const res = await fetch(`${AUTH_API_BASE}/bookAppointment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok && isAuthError(res.status, result.message)) {
      return { success: false, unauthorized: true };
    }
    if (!res.ok) {
      return { success: false, error: result.message || "Booking failed" };
    }
    return { success: true, pricing: result.pricing };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}
