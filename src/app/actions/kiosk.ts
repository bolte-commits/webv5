"use server";

const API_URL = process.env.API_URL || "http://localhost:3000";

interface KioskSignupData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  height: number;
  weight: number;
}

export async function kioskSignup(
  data: KioskSignupData
): Promise<{ success: boolean; _id?: number; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, email: data.email.toLowerCase() }),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || "Signup failed" };
    }
    return { success: true, _id: json.user?.id };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}
