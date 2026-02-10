interface StoredProfile {
  email?: string;
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  gender?: string;
}

const TOKEN_KEY = "bi_token";
const PROFILE_KEY = "bi_profile";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredProfile(): StoredProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredProfile;
  } catch {
    return null;
  }
}

export function setStoredProfile(profile: StoredProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearStoredProfile(): void {
  localStorage.removeItem(PROFILE_KEY);
}

export function logout(): void {
  clearStoredToken();
  clearStoredProfile();
}

interface FetchWithAuthOptions extends Omit<RequestInit, "body" | "method"> {
  token?: string;
  body?: Record<string, unknown>;
}

export async function fetchWithAuth(
  endpoint: string,
  { token, body, ...options }: FetchWithAuthOptions = {}
): Promise<Response> {
  const authToken = token || getStoredToken();
  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify({ token: authToken, ...body }),
    ...options,
  });
}
