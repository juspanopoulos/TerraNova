import { apiRequest } from "@/lib/api/client";
import type {
  ChatIaRequest,
  ChatIaResponse,
  IaIrrigacaoRequest,
  IaIrrigacaoResponse,
  IaProdutividadeRequest,
  IaProdutividadeResponse,
} from "@/lib/api/types";

export function chatIa(payload: ChatIaRequest) {
  return apiRequest<ChatIaResponse>("/ia/chat", {
    method: "POST",
    body: payload,
  });
}

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
