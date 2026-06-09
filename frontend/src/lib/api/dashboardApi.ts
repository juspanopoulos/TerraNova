import { apiRequest } from "@/lib/api/client";
import type {
  DashboardAreaResumoResponse,
  DashboardResumoResponse,
} from "@/lib/api/types";

export function getDashboardResumo() {
  return apiRequest<DashboardResumoResponse>("/dashboard/resumo");
}

export function getDashboardArea(idArea: number) {
  return apiRequest<DashboardAreaResumoResponse>(`/dashboard/areas/${idArea}`);
}
