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

export function formatChatTime(date: Date) {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function formatConversationDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

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

export function mockAssistantReply(userMessage: string, farmName: string): string {
  const text = userMessage.toLowerCase();

  if (text.includes("umidade") || text.includes("solo")) {
    return `Na ${farmName}, a umidade média do solo está em 61%, dentro da faixa operacional. O setor Reserva está mais seco (49%) — há um alerta crítico aberto.`;
  }
  if (text.includes("alerta") || text.includes("crítico")) {
    return "Há 3 alertas críticos no momento: risco de geada na Serra Norte, solo seco na Reserva e déficit hídrico no Talhão B. Recomendo revisar o quadro de alertas.";
  }
  if (text.includes("colheita") || text.includes("soja")) {
    return "A soja no Talhão A está com 72% de maturidade. A janela ideal de colheita é entre 18 e 22 de outubro, conforme condições climáticas favoráveis.";
  }
  if (text.includes("água") || text.includes("hídrico") || text.includes("irriga") || text.includes("consumo")) {
    return "O consumo hídrico de hoje está em 1.840 L com eficiência de 91%. A distribuição principal é por gotejamento (45%).";
  }

  return "Recebi sua mensagem. A integração com IA estará disponível em breve — por enquanto respondo com dados simulados da plataforma. Tente perguntar sobre solo, alertas, colheita ou consumo hídrico.";
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
