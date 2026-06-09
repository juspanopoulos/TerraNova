import { apiRequest } from "@/lib/api/client";
import type { AnotacaoRequest, AnotacaoResponse } from "@/lib/api/types";

export function listAnotacoes(idUsuario: number) {
  return apiRequest<AnotacaoResponse[]>(`/usuarios/${idUsuario}/anotacoes`);
}

export function createAnotacao(idUsuario: number, body: AnotacaoRequest) {
  return apiRequest<AnotacaoResponse>(`/usuarios/${idUsuario}/anotacoes`, {
    method: "POST",
    body,
  });
}

export function updateAnotacao(idAnotacao: number, body: AnotacaoRequest) {
  return apiRequest<AnotacaoResponse>(`/anotacoes/${idAnotacao}`, {
    method: "PUT",
    body,
  });
}

export function deleteAnotacao(idAnotacao: number) {
  return apiRequest<void>(`/anotacoes/${idAnotacao}`, {
    method: "DELETE",
  });
}
