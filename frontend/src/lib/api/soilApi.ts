import { apiRequest } from "@/lib/api/client";
import type { LeituraSoloRequest, LeituraSoloResponse } from "@/lib/api/types";

export function listLeiturasSolo() {
  return apiRequest<LeituraSoloResponse[]>("/leituras-solo");
}

export function listHistoricoSoloPorArea(idArea: number) {
  return apiRequest<LeituraSoloResponse[]>(`/leituras-solo/area/${idArea}/historico`);
}

export function getUltimaLeituraSoloPorArea(idArea: number) {
  return apiRequest<LeituraSoloResponse>(`/leituras-solo/area/${idArea}/ultima`);
}

export function createLeituraSolo(body: LeituraSoloRequest) {
  return apiRequest<LeituraSoloResponse>("/leituras-solo", {
    method: "POST",
    body,
  });
}
