import { apiRequest } from "@/lib/api/client";
import type { EmpresaRequest, EmpresaResponse } from "@/lib/api/types";

export function listEmpresas() {
  return apiRequest<EmpresaResponse[]>("/empresas");
}

export function updateEmpresa(idEmpresa: number, body: EmpresaRequest) {
  return apiRequest<EmpresaResponse>(`/empresas/${idEmpresa}`, {
    method: "PUT",
    body,
  });
}
