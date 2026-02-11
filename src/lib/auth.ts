const TOKEN_KEY = "bi_token";

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

export function logout(): void {
  clearStoredToken();
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
