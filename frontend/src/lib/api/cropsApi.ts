import { apiRequest } from "@/lib/api/client";
import type {
  AreaCulturaRequest,
  AreaCulturaResponse,
  CulturaRequest,
  CulturaResponse,
} from "@/lib/api/types";

export function listCulturas() {
  return apiRequest<CulturaResponse[]>("/culturas");
}

export function listAreasCulturasAtivas() {
  return apiRequest<AreaCulturaResponse[]>("/areas-culturas/ativos");
}

export function createCultura(body: CulturaRequest) {
  return apiRequest<CulturaResponse>("/culturas", {
    method: "POST",
    body,
  });
}

export function createAreaCultura(body: AreaCulturaRequest) {
  return apiRequest<AreaCulturaResponse>("/areas-culturas", {
    method: "POST",
    body,
  });
}
