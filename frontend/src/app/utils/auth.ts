// Admin login is checked by the content API. The server sets an HttpOnly
// session cookie; nothing secret is stored in the browser or in this code.
const API_BASE = (import.meta.env.VITE_CONTENT_API_BASE || "/api/content").replace(/\/$/, "");

export type LoginResult = "ok" | "invalid" | "locked" | "not-configured" | "error";

export async function login(username: string, password: string): Promise<LoginResult> {
  try {
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) return "ok";
    if (response.status === 401) return "invalid";
    if (response.status === 429) return "locked";
    if (response.status === 503) return "not-configured";
    return "error";
  } catch {
    return "error";
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/logout`, { method: "POST", credentials: "same-origin" });
  } catch {
    // The session expires on its own; nothing else to do.
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/admin/session`, { credentials: "same-origin" });
    if (!response.ok) return false;
    const data = await response.json();
    return data.authenticated === true;
  } catch {
    return false;
  }
}
