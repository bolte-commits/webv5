"use server";

// TODO: Replace with your real backend URL
const API_BASE = process.env.API_BASE_URL || "https://api.bodyinsight.in";

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
