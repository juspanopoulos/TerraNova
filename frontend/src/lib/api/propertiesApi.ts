import { apiRequest } from "@/lib/api/client";
import type { PropriedadeRequest, PropriedadeResponse } from "@/lib/api/types";

export function listPropriedades() {
  return apiRequest<PropriedadeResponse[]>("/propriedades");
}

export function updatePropriedade(idPropriedade: number, body: PropriedadeRequest) {
  return apiRequest<PropriedadeResponse>(`/propriedades/${idPropriedade}`, {
    method: "PUT",
    body,
  });
}
