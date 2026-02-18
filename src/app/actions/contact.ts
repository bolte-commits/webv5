"use server";

const API_BASE =
  "https://pbkivbwxx9.execute-api.ap-south-1.amazonaws.com/prod";

export async function contactUs(
  email: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/contactUs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, subject, message }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Failed to send message" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}
