import { apiRequest } from "@/lib/api/client";
import type { EmpresaResponse } from "@/lib/api/types";

export function listEmpresas() {
  return apiRequest<EmpresaResponse[]>("/empresas");
}
