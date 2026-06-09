import { apiRequest } from "@/lib/api/client";
import type {
  CadastroPlataformaRequest,
  CadastroPlataformaResponse,
  LoginRequest,
  LoginResponse,
  UsuarioRequest,
  UsuarioResponse,
} from "@/lib/api/types";

export function listUsuarios() {
  return apiRequest<UsuarioResponse[]>("/usuarios");
}

export function loginUsuario(body: LoginRequest) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body,
  });
}

export function registerPlataforma(body: CadastroPlataformaRequest) {
  return apiRequest<CadastroPlataformaResponse>("/auth/register", {
    method: "POST",
    body,
  });
}

export function updateUsuario(idUsuario: number, body: UsuarioRequest) {
  return apiRequest<UsuarioResponse>(`/usuarios/${idUsuario}`, {
    method: "PUT",
    body,
  });
}
