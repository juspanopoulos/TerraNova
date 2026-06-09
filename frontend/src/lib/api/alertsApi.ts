import { apiRequest } from "@/lib/api/client";
import type { AlertaResponse } from "@/lib/api/types";

export function listAlertas() {
  return apiRequest<AlertaResponse[]>("/alertas");
}

export function listAlertasAbertos() {
  return apiRequest<AlertaResponse[]>("/alertas/abertos");
}
