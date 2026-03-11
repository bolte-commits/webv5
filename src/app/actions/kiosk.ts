"use server";

const API_BASE =
  "https://pbkivbwxx9.execute-api.ap-south-1.amazonaws.com/prod";

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
    const res = await fetch(`${API_BASE}/kioskSignup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.message || "Signup failed" };
    }
    return { success: true, _id: json._id };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}
