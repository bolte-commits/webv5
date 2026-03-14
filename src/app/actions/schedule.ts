"use server";

import { formatDate } from "@/lib/constants";

const API_URL = process.env.API_URL || "http://localhost:3000";

export interface ScheduleEvent {
  eventId: number;
  name: string;
  area: string;
  city: string;
  date: string;
  displayDate: string;
  time: string;
  isFull: boolean;
  isPrivate: boolean;
  label: string | null;
  mapUrl: string | null;
}

export interface Slot {
  startTime: string;
  displayTime: string;
}

export interface EventInfo {
  name: string;
  area: string;
  city: string;
  date: string;
  displayDate: string;
  time: string;
  services: string[];
  amount: string;
  isPrivate: boolean;
  label: string | null;
  mapUrl: string | null;
}

export async function fetchSchedule(): Promise<{
  success: boolean;
  events: ScheduleEvent[];
  error?: string;
}> {
  try {
    const res = await fetch(`${API_URL}/schedule`);
    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        events: [],
        error: data.error || "Failed to fetch schedule",
      };
    }
    const events: ScheduleEvent[] = (data.events || []).map(
      (e: Record<string, unknown>) => ({
        ...e,
        displayDate: formatDate(e.date as string),
      })
    );
    return { success: true, events };
  } catch {
    return {
      success: false,
      events: [],
      error: "Network error. Please try again.",
    };
  }
}

export async function fetchSlots(
  eventId: number,
  service: string
): Promise<{
  success: boolean;
  slots: Slot[];
  event: EventInfo | null;
  error?: string;
}> {
  try {
    const res = await fetch(
      `${API_URL}/schedule/${eventId}/slots?service=${encodeURIComponent(service)}`
    );
    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        slots: [],
        event: null,
        error: data.error || "Failed to fetch slots",
      };
    }
    const event: EventInfo | null = data.event
      ? { ...data.event, displayDate: formatDate(data.event.date) }
      : null;
    return { success: true, slots: data.slots || [], event };
  } catch {
    return {
      success: false,
      slots: [],
      event: null,
      error: "Network error. Please try again.",
    };
  }
}
