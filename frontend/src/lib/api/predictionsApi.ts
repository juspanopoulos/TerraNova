import { apiRequest } from "@/lib/api/client";
import type { PredicaoIaResponse } from "@/lib/api/types";

export function listPredicoesIa() {
  return apiRequest<PredicaoIaResponse[]>("/predicoes-ia");
}

export function listPredicoesIaPorArea(idArea: number) {
  return apiRequest<PredicaoIaResponse[]>(`/predicoes-ia/area/${idArea}`);
}
