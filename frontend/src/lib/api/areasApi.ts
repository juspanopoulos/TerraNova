import { apiRequest } from "@/lib/api/client";
import type { AreaMonitoradaResponse } from "@/lib/api/types";

export function listAreasMonitoradas() {
  return apiRequest<AreaMonitoradaResponse[]>("/areas-monitoradas");
}
