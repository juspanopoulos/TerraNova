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
import {
  conversationTitleFromMessage,
  createConversation,
  formatChatTime,
  loadConversations,
  saveConversations,
  type ChatMessage,
  type Conversation,
} from "@/lib/dashboard/assistantChat";
import { chatIa } from "@/lib/api/iaApi";

type AssistantChatContextValue = {
  conversations: Conversation[];
  activeId: string;
  messages: ChatMessage[];
  isEmpty: boolean;
  isTyping: boolean;
  isHistoryOpen: boolean;
  openHistory: () => void;
  closeHistory: () => void;
  startNewConversation: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  sendMessage: (text: string) => void;
};

const AssistantChatContext = createContext<AssistantChatContextValue | null>(null);

export function AssistantChatProvider({
  children,
  farmName,
}: {
  children: ReactNode;
  farmName: string;
}) {
  const [initialData] = useState(() => loadConversations());
  const [conversations, setConversations] = useState<Conversation[]>(initialData.conversations);
  const [activeId, setActiveId] = useState<string>(
    initialData.activeId ?? initialData.conversations[0].id,
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsHistoryOpen(false);
  }, [location.pathname]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? conversations[0],
    [conversations, activeId],
  );

  const messages = activeConversation?.messages ?? [];
  const isEmpty = messages.length === 0;

  useEffect(() => {
    saveConversations(conversations, activeId);
  }, [conversations, activeId]);

  const updateConversation = useCallback(
    (id: string, updater: (conv: Conversation) => Conversation) => {
      setConversations((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
    },
    [],
  );

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping || !activeConversation) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        time: formatChatTime(new Date()),
      };

      const isFirstMessage = activeConversation.messages.length === 0;

      updateConversation(activeConversation.id, (conv) => ({
        ...conv,
        title: isFirstMessage ? conversationTitleFromMessage(trimmed) : conv.title,
        updatedAt: Date.now(),
        messages: [...conv.messages, userMsg],
      }));

      setIsTyping(true);

      void (async () => {
        let content = "Nao consegui consultar a IA agora. Tente novamente em instantes.";
        try {
          const response = await chatIa({
            pergunta: trimmed,
            contexto: `Fazenda: ${farmName}`,
          });
          content = response.resposta;
        } catch {
          content = "Nao consegui consultar a IA agora. Verifique se o backend e o servico de IA estao ativos.";
        }

        const reply: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content,
          time: formatChatTime(new Date()),
        };
        updateConversation(activeConversation.id, (conv) => ({
          ...conv,
          updatedAt: Date.now(),
          messages: [...conv.messages, reply],
        }));
        setIsTyping(false);
      })();
    },
    [activeConversation, farmName, isTyping, updateConversation],
  );

  const startNewConversation = useCallback(() => {
    const next = createConversation();
    setConversations((prev) => [next, ...prev]);
    setActiveId(next.id);
    setIsTyping(false);
    setIsHistoryOpen(false);
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
    setIsTyping(false);
    setIsHistoryOpen(false);
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (next.length === 0) {
          const fresh = createConversation();
          setActiveId(fresh.id);
          return [fresh];
        }
        if (activeId === id) {
          setActiveId(next[0].id);
        }
        return next;
      });
      setIsTyping(false);
    },
    [activeId],
  );

  const value = useMemo(
    (): AssistantChatContextValue => ({
      conversations,
      activeId,
      messages,
      isEmpty,
      isTyping,
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
