const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";
const AUTH_KEY = "laptophub_admin_auth";

export function login(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, "authenticated");
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === "authenticated";
}
