"use server";

const API_BASE =
  "https://vzhsj8805e.execute-api.ap-south-1.amazonaws.com/prod";

export async function sendOtp(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Failed to send OTP" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

export async function verifyOtp(
  email: string,
  otp: string
): Promise<{
  success: boolean;
  token?: string;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/verifyLoginOtp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Invalid OTP" };
    }
    return {
      success: true,
      token: data.token,
    };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}
