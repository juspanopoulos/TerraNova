import { apiRequest } from "@/lib/api/client";
import type { LoginRequest, LoginResponse, UsuarioResponse } from "@/lib/api/types";

export function listUsuarios() {
  return apiRequest<UsuarioResponse[]>("/usuarios");
}

export function loginUsuario(body: LoginRequest) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body,
  });
}
