import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { ApiRequestError } from "@/lib/api/client";
import {
  createAssistenteConversa,
  deleteAssistenteConversa,
  listAssistenteConversas,
  sendAssistenteMessage,
} from "@/lib/api/assistantApi";
import type { AssistenteConversaResponse } from "@/lib/api/types";
import { formatChatTime, type ChatMessage, type Conversation } from "@/lib/dashboard/assistantChat";

type AssistantChatContextValue = {
  conversations: Conversation[];
  activeId: string;
  messages: ChatMessage[];
  isEmpty: boolean;
  isTyping: boolean;
  errorMessage: string | null;
  isHistoryOpen: boolean;
  openHistory: () => void;
  closeHistory: () => void;
  startNewConversation: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  sendMessage: (text: string) => void;
};

const AssistantChatContext = createContext<AssistantChatContextValue | null>(null);

function toTimestamp(value: string) {
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : Date.now();
}

function mapConversation(conversa: AssistenteConversaResponse): Conversation {
  return {
    id: String(conversa.idConversa),
    title: conversa.titulo,
    createdAt: toTimestamp(conversa.dataCriacao),
    updatedAt: toTimestamp(conversa.dataAtualizacao),
    messages: conversa.mensagens.map((mensagem) => ({
      id: String(mensagem.idMensagem),
      role: mensagem.papel === "user" ? "user" : "assistant",
      content: mensagem.conteudo,
      time: formatChatTime(new Date(mensagem.dataMensagem)),
    })),
  };
}

function assistantErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiRequestError) return error.message;
  return fallback;
}

export function AssistantChatProvider({
  children,
  idUsuario,
  propertyName,
}: {
  children: ReactNode;
  idUsuario: number | null;
  propertyName: string;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsHistoryOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!idUsuario) return;
    let cancelled = false;

    void listAssistenteConversas(idUsuario)
      .then((items) => {
        if (cancelled) return;
        setErrorMessage(null);
        const mapped = items.map(mapConversation);
        setConversations(mapped);
        setActiveId((current) =>
          current && mapped.some((conversation) => conversation.id === current)
            ? current
            : mapped[0]?.id ?? "",
        );
      })
      .catch(() => {
        if (cancelled) return;
        setConversations([]);
        setActiveId("");
        setErrorMessage("Não foi possível carregar o histórico do assistente.");
      });

    return () => {
      cancelled = true;
    };
  }, [idUsuario]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );

  const messages = activeConversation?.messages ?? [];
  const isEmpty = messages.length === 0;

  const upsertConversation = useCallback((conversation: Conversation) => {
    setConversations((prev) => {
      const withoutCurrent = prev.filter((item) => item.id !== conversation.id);
      return [conversation, ...withoutCurrent].sort((a, b) => b.updatedAt - a.updatedAt);
    });
    setActiveId(conversation.id);
  }, []);

  const startNewConversation = useCallback(() => {
    if (!idUsuario) return;
    setIsTyping(false);
    setIsHistoryOpen(false);
    setErrorMessage(null);
    void createAssistenteConversa(idUsuario, { titulo: "Nova conversa" })
      .then((created) => {
        upsertConversation(mapConversation(created));
      })
      .catch((error) => {
        setErrorMessage(assistantErrorMessage(error, "Não foi possível criar uma nova conversa."));
      });
  }, [idUsuario, upsertConversation]);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
    setIsTyping(false);
    setErrorMessage(null);
    setIsHistoryOpen(false);
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      const numericId = Number(id);
      if (!Number.isFinite(numericId)) return;
      setErrorMessage(null);
      void deleteAssistenteConversa(numericId)
        .then(() => {
          setConversations((prev) => {
            const next = prev.filter((c) => c.id !== id);
            if (activeId === id) setActiveId(next[0]?.id ?? "");
            return next;
          });
        })
        .catch((error) => {
          setErrorMessage(assistantErrorMessage(error, "Não foi possível excluir a conversa."));
        });
      setIsTyping(false);
    },
    [activeId],
  );

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping || !idUsuario) return;

      setIsTyping(true);
      setErrorMessage(null);

      void (async () => {
        try {
          let conversation = activeConversation;
          if (!conversation) {
            const created = await createAssistenteConversa(idUsuario, { titulo: "Nova conversa" });
            conversation = mapConversation(created);
            upsertConversation(conversation);
          }

          const optimistic: Conversation = {
            ...conversation,
            updatedAt: Date.now(),
            messages: [
              ...conversation.messages,
              {
                id: `pending-${Date.now()}`,
                role: "user",
                content: trimmed,
                time: formatChatTime(new Date()),
              },
            ],
          };
          upsertConversation(optimistic);

          const response = await sendAssistenteMessage(Number(conversation.id), {
            pergunta: trimmed,
            contexto: `Propriedade: ${propertyName}`,
          });
          upsertConversation(mapConversation(response));
        } catch (error) {
          setErrorMessage(assistantErrorMessage(error, "Não foi possível enviar a mensagem."));
        } finally {
          setIsTyping(false);
        }
      })();
    },
    [activeConversation, idUsuario, isTyping, propertyName, upsertConversation],
  );

  const value = useMemo(
    (): AssistantChatContextValue => ({
      conversations,
      activeId,
      messages,
      isEmpty,
      isTyping,
      errorMessage,
      isHistoryOpen,
      openHistory: () => setIsHistoryOpen(true),
      closeHistory: () => setIsHistoryOpen(false),
      startNewConversation,
      selectConversation,
      deleteConversation,
      sendMessage,
    }),
    [
      conversations,
      activeId,
      messages,
      isEmpty,
      isTyping,
      errorMessage,
      isHistoryOpen,
      startNewConversation,
      selectConversation,
      deleteConversation,
      sendMessage,
    ],
  );

  return (
    <AssistantChatContext.Provider value={value}>{children}</AssistantChatContext.Provider>
  );
}

export function useAssistantChat() {
  const ctx = useContext(AssistantChatContext);
  if (!ctx) {
    throw new Error("useAssistantChat must be used within AssistantChatProvider");
  }
  return ctx;
}

export function useAssistantChatOptional() {
  return useContext(AssistantChatContext);
}
