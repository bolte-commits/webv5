"use server";

const API_BASE =
  "https://pbkivbwxx9.execute-api.ap-south-1.amazonaws.com/prod";

export interface ScheduleEvent {
  eventId: number;
  area: string;
  landmark: string;
  city?: string;
  displayDate: string;
  time: string;
  isFull: boolean;
  isPrivate?: boolean;
  locationUrl?: string;
}

export interface Appointment {
  _id: string;
  displayTime: string;
  amount: number;
  basePrice: number;
  finalPrice: number;
}

export interface EventInfo {
  area: string;
  landmark: string;
  locationUrl: string;
  date: string;
  fullDate: string;
  amount: number;
  isPrivate: boolean;
  accessText: string;
}

export async function fetchAppointments(eventId: number): Promise<{
  success: boolean;
  appointments: Appointment[];
  event: EventInfo | null;
  promo: string;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/findAvailableAppointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        appointments: [],
        event: null,
        promo: "",
        error: data.message || "Failed to fetch appointments",
      };
    }
    return {
      success: true,
      appointments: data.appointments || [],
      event: data.event || null,
      promo: data.promo || "",
    };
  } catch {
    return {
      success: false,
      appointments: [],
      event: null,
      promo: "",
      error: "Network error. Please try again.",
    };
  }
}

export async function fetchSchedule(): Promise<{
  success: boolean;
  events: ScheduleEvent[];
  error?: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, events: [], error: data.message || "Failed to fetch schedule" };
    }
    return { success: true, events: data.events || [] };
  } catch {
    return { success: false, events: [], error: "Network error. Please try again." };
  }
}
