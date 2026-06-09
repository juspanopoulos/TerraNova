import { apiRequest } from "@/lib/api/client";
import type { AreaCulturaResponse, CulturaResponse } from "@/lib/api/types";

export function listCulturas() {
  return apiRequest<CulturaResponse[]>("/culturas");
}

export function listAreasCulturasAtivas() {
  return apiRequest<AreaCulturaResponse[]>("/areas-culturas/ativos");
}
