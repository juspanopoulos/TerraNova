import type { UsuarioResponse } from "@/lib/api/types";

const AUTH_SESSION_KEY = "terranova-auth-session";

export type AuthSession = {
  authenticated: boolean;
  usuario: UsuarioResponse;
  savedAt: number;
};

export function loadStoredAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (parsed.authenticated !== true || !parsed.usuario?.idUsuario) {
      localStorage.removeItem(AUTH_SESSION_KEY);
      return null;
    }
    return parsed as AuthSession;
  } catch {
    return null;
  }
}

export function saveAuthSession(usuario: UsuarioResponse) {
  const session: AuthSession = {
    authenticated: true,
    usuario,
    savedAt: Date.now(),
  };
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}
