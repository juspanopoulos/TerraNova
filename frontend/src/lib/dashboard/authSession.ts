const AUTH_SESSION_KEY = "terranova-auth-session";

type AuthSession = {
  authenticated: boolean;
  savedAt: number;
};

export function loadStoredAuthSession(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    return parsed.authenticated === true;
  } catch {
    return false;
  }
}

export function saveAuthSession() {
  const session: AuthSession = {
    authenticated: true,
    savedAt: Date.now(),
  };
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}
