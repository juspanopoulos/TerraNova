import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, Loader2, User } from "lucide-react";
import { btnClick, textFaint, textMuted, textPrimary } from "@/constants/dashboard";
import { useAssistantChat } from "@/context/AssistantChatContext";
import { SUGGESTED_PROMPTS, type ChatMessage } from "@/lib/dashboard/assistantChat";

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <span
        className={[
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-[var(--db-nested-bg)] text-verde-floresta" : "bg-verde-floresta text-bege-natural",
        ].join(" ")}
        aria-hidden
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </span>
      <div className={`flex max-w-[min(85%,36rem)] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={[
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "rounded-tr-md bg-verde-floresta text-bege-natural"
              : "rounded-tl-md bg-[var(--db-nested-bg)] text-[var(--db-text)]",
          ].join(" ")}
        >
          {message.content}
        </div>
        <time className={`text-[10px] tabular-nums ${textFaint}`}>{message.time}</time>
      </div>
    </div>
  );
}

function ChatEmptyState({ onSelectPrompt }: { onSelectPrompt: (prompt: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
      <span
        className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-verde-floresta text-bege-natural"
        aria-hidden
      >
        <Bot className="size-7" />
      </span>
      <h2 className={`text-center text-xl font-bold tracking-tight sm:text-2xl ${textPrimary}`}>
        Como posso te ajudar hoje?
      </h2>
      <p className={`mt-2 max-w-md text-center text-sm ${textMuted}`}>
        Pergunte sobre clima, solo, irrigação, alertas e colheitas.
      </p>
      <div className="mt-8 flex w-full max-w-lg flex-col gap-2.5">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className={`${btnClick} w-full rounded-full border border-[var(--db-border)] bg-[var(--db-surface)] px-5 py-3 text-left text-sm font-medium text-[var(--db-text)] hover:border-verde-floresta/30 hover:text-verde-floresta`}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AssistenteView() {
  const { messages, isEmpty, isTyping, sendMessage } = useAssistantChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    if (!isEmpty) scrollToBottom();
  }, [messages, isTyping, isEmpty, scrollToBottom]);

  const handleSubmit = () => {
    if (!draft.trim() || isTyping) return;
    sendMessage(draft);
    setDraft("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex min-h-[min(24rem,60vh)] flex-col">
      {isEmpty ? (
        <ChatEmptyState onSelectPrompt={sendMessage} />
      ) : (
        <div
          ref={scrollRef}
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto py-4 sm:py-6"
          role="log"
          aria-live="polite"
        >
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-verde-floresta text-bege-natural">
                <Bot className="size-4" aria-hidden />
              </span>
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-md bg-[var(--db-nested-bg)] px-4 py-2.5">
                <Loader2 className="size-4 animate-spin text-verde-floresta" aria-hidden />
                <span className={`text-sm ${textMuted}`}>Digitando…</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="shrink-0 pt-2 pb-1 sm:pt-3">
        <div className="mx-auto flex max-w-2xl items-end gap-2 rounded-full border border-[var(--db-border)] bg-[var(--db-surface)] px-2 py-1.5 sm:px-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Pergunte sobre clima, solo, irrigação ou alertas…"
            disabled={isTyping}
            className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-[var(--db-text)] outline-none rounded-2xl placeholder:text-[var(--db-text-faint)] disabled:opacity-60"
            aria-label="Mensagem"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!draft.trim() || isTyping}
            className={`${btnClick} mb-0.5 mr-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-laranja-solar text-white disabled:opacity-40`}
            aria-label="Enviar"
          >
            <ArrowUp className="size-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
