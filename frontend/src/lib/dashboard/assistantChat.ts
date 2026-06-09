export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  time: string;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
};

export const SUGGESTED_PROMPTS = [
  "Qual a umidade do solo hoje?",
  "Há alertas críticos ativos?",
  "Como está o consumo hídrico esta semana?",
] as const;

const STORAGE_KEY = "terranova-assistant-conversations";
const ACTIVE_KEY = "terranova-assistant-active-id";

export { formatChatTime, formatConversationDate } from "@/utils/format/date";

export function createConversation(): Conversation {
  const now = Date.now();
  return {
    id: `conv-${now}`,
    title: "Nova conversa",
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

export function conversationTitleFromMessage(text: string) {
  const trimmed = text.trim();
  if (trimmed.length <= 42) return trimmed;
  return `${trimmed.slice(0, 42)}…`;
}

export function loadConversations(): { conversations: Conversation[]; activeId: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const activeId = localStorage.getItem(ACTIVE_KEY);
    if (!raw) {
      const initial = createConversation();
      return { conversations: [initial], activeId: initial.id };
    }
    const conversations = JSON.parse(raw) as Conversation[];
    if (!Array.isArray(conversations) || conversations.length === 0) {
      const initial = createConversation();
      return { conversations: [initial], activeId: initial.id };
    }
    const validActive = activeId && conversations.some((c) => c.id === activeId) ? activeId : conversations[0].id;
    return { conversations, activeId: validActive };
  } catch {
    const initial = createConversation();
    return { conversations: [initial], activeId: initial.id };
  }
}

export function saveConversations(conversations: Conversation[], activeId: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  localStorage.setItem(ACTIVE_KEY, activeId);
}
