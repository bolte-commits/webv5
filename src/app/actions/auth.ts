"use server";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function sendOtp(
  phone: string
): Promise<{
  success: boolean;
  newUser?: boolean;
  token?: string;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Failed to send OTP" };
    }
    if (data.newUser) {
      return { success: true, newUser: true, token: data.token };
    }
    return { success: true, newUser: false };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

export async function verifyOtp(
  phone: string,
  otp: string
): Promise<{
  success: boolean;
  token?: string;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Invalid OTP" };
    }
    return { success: true, token: data.token };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}
