"use server";

const API_BASE =
  "https://vzhsj8805e.execute-api.ap-south-1.amazonaws.com/prod";

export interface ScheduleEvent {
  eventId: number;
  area: string;
  landmark: string;
  city?: string;
  dayOfWeek: string;
  date: string;
  time: string;
  isFull: boolean;
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
