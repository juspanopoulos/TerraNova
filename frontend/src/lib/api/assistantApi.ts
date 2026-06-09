import { apiRequest } from "@/lib/api/client";
import type {
  AssistenteChatPersistidoRequest,
  AssistenteConversaRequest,
  AssistenteConversaResponse,
} from "@/lib/api/types";

export function listAssistenteConversas(idUsuario: number) {
  return apiRequest<AssistenteConversaResponse[]>(
    `/usuarios/${idUsuario}/assistente/conversas`,
  );
}

export function createAssistenteConversa(
  idUsuario: number,
  body: AssistenteConversaRequest = {},
) {
  return apiRequest<AssistenteConversaResponse>(
    `/usuarios/${idUsuario}/assistente/conversas`,
    {
      method: "POST",
      body,
    },
  );
}

export function sendAssistenteMessage(
  idConversa: number,
  body: AssistenteChatPersistidoRequest,
) {
  return apiRequest<AssistenteConversaResponse>(
    `/assistente/conversas/${idConversa}/chat`,
    {
      method: "POST",
      body,
    },
  );
}

export function deleteAssistenteConversa(idConversa: number) {
  return apiRequest<void>(`/assistente/conversas/${idConversa}`, {
    method: "DELETE",
  });
}
