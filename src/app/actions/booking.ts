"use server";

// TODO: Replace with your real backend URL
const API_BASE = process.env.API_BASE_URL || "https://api.bodyinsight.in";
const AUTH_API_BASE =
  "https://vzhsj8805e.execute-api.ap-south-1.amazonaws.com/prod";

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
    if (res.status === 401) {
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
    if (res.status === 401) {
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

interface BookingData {
  landmark: string;
  day: string;
  date: string;
  slot: string;
  email: string;
  name: string;
  phone: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  couponCode: string;
  finalPrice: number;
  token?: string;
  appointmentId?: string;
}

export async function confirmBooking(
  data: BookingData
): Promise<{ success: boolean; refNumber: string }> {
  // When your backend is ready, uncomment:
  // const res = await fetch(`${API_BASE}/book`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "X-API-Key": process.env.API_SECRET!,
  //   },
  //   body: JSON.stringify(data),
  // });
  // const result = await res.json();
  // return { success: result.success, refNumber: result.refNumber };

  // Simulated
  console.log(`[server] Confirming booking for ${data.name} at ${data.landmark}`);
  const ref = "BI-" + Date.now().toString(36).toUpperCase().slice(-6);
  return { success: true, refNumber: ref };
}
