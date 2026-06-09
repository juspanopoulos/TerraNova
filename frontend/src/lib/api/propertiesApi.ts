import { apiRequest } from "@/lib/api/client";
import type { PropriedadeResponse } from "@/lib/api/types";

export function listPropriedades() {
  return apiRequest<PropriedadeResponse[]>("/propriedades");
}
