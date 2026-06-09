import { apiRequest } from "@/lib/api/client";
import type {
  UsuarioPreferenciasRequest,
  UsuarioPreferenciasResponse,
} from "@/lib/api/types";

export function getUsuarioPreferencias(idUsuario: number) {
  return apiRequest<UsuarioPreferenciasResponse>(`/usuarios/${idUsuario}/preferencias`);
}

export function updateUsuarioPreferencias(
  idUsuario: number,
  body: UsuarioPreferenciasRequest,
) {
  return apiRequest<UsuarioPreferenciasResponse>(`/usuarios/${idUsuario}/preferencias`, {
    method: "PUT",
    body,
  });
}
