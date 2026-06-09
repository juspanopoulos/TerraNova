import { apiRequest } from "@/lib/api/client";
import type { IrrigacaoResponse } from "@/lib/api/types";

export function listIrrigacoes() {
  return apiRequest<IrrigacaoResponse[]>("/irrigacoes");
}

export function listHistoricoIrrigacaoPorArea(idArea: number) {
  return apiRequest<IrrigacaoResponse[]>(`/irrigacoes/area/${idArea}/historico`);
}
