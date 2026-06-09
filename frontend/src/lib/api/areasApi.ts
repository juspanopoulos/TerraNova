import { apiRequest } from "@/lib/api/client";
import type { AreaMonitoradaRequest, AreaMonitoradaResponse } from "@/lib/api/types";

export function listAreasMonitoradas() {
  return apiRequest<AreaMonitoradaResponse[]>("/areas-monitoradas");
}

export function createAreaMonitorada(body: AreaMonitoradaRequest) {
  return apiRequest<AreaMonitoradaResponse>("/areas-monitoradas", {
    method: "POST",
    body,
  });
}
