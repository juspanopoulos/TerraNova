import { apiRequest } from "@/lib/api/client";
import type { ColetaNasaResponse, DadoClimaticoResponse } from "@/lib/api/types";

export function listDadosClimaticos() {
  return apiRequest<DadoClimaticoResponse[]>("/dados-climaticos");
}

export function listHistoricoClimaticoPorArea(idArea: number) {
  return apiRequest<DadoClimaticoResponse[]>(`/dados-climaticos/area/${idArea}/historico`);
}

export function coletarClimaNasa(idArea: number, dataReferencia?: string) {
  const query = dataReferencia ? `?dataReferencia=${encodeURIComponent(dataReferencia)}` : "";
  return apiRequest<ColetaNasaResponse>(`/clima/nasa/areas/${idArea}/coletar${query}`, {
    method: "POST",
  });
}
