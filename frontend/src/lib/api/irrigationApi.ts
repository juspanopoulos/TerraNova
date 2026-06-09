import { apiRequest } from "@/lib/api/client";
import type { IrrigacaoRequest, IrrigacaoResponse } from "@/lib/api/types";

export function listIrrigacoes() {
  return apiRequest<IrrigacaoResponse[]>("/irrigacoes");
}

export function listHistoricoIrrigacaoPorArea(idArea: number) {
  return apiRequest<IrrigacaoResponse[]>(`/irrigacoes/area/${idArea}/historico`);
}

export function createIrrigacao(body: IrrigacaoRequest) {
  return apiRequest<IrrigacaoResponse>("/irrigacoes", {
    method: "POST",
    body,
  });
}
