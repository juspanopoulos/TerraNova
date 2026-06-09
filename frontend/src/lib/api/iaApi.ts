import { apiRequest } from "@/lib/api/client";
import type {
  IaIrrigacaoRequest,
  IaIrrigacaoResponse,
  IaProdutividadeRequest,
  IaProdutividadeResponse,
} from "@/lib/api/types";

export function predizerProdutividade(payload: IaProdutividadeRequest) {
  return apiRequest<IaProdutividadeResponse>("/ia/produtividade", {
    method: "POST",
    body: payload,
  });
}

export function predizerIrrigacao(payload: IaIrrigacaoRequest) {
  return apiRequest<IaIrrigacaoResponse>("/ia/irrigacao", {
    method: "POST",
    body: payload,
  });
}
