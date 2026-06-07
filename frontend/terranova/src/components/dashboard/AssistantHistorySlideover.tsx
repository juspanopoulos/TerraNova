import { useEffect, useMemo, useState } from "react";
import { Trash2, X, type LucideIcon } from "lucide-react";
import { useAssistantChat } from "@/context/AssistantChatContext";
import { formatConversationDate } from "@/lib/dashboard/assistantChat";
import { btnClick, textFaint, textMuted, textPrimary } from "@/constants/dashboard";

export function ToolbarActionButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="dashboard-soft inline-flex cursor-pointer items-center gap-2 rounded-md border border-[var(--db-border)] bg-[var(--db-surface)] px-3 py-2 text-sm font-semibold text-[var(--db-text)] shadow-sm hover:border-verde-floresta/30 hover:text-verde-floresta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-floresta/40 sm:px-4"
    >
      <Icon className="size-4" aria-hidden />
      {label}
    </button>
  );
}

export function AssistantHistorySlideover() {
  const {
    conversations,
    activeId,
    isHistoryOpen,
    closeHistory,
    selectConversation,
    deleteConversation,
  } = useAssistantChat();

  const [mounted, setMounted] = useState(isHistoryOpen);

  useEffect(() => {
    if (isHistoryOpen) setMounted(true);
  }, [isHistoryOpen]);

  useEffect(() => {
    if (!isHistoryOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeHistory();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isHistoryOpen, closeHistory]);

  useEffect(() => {
    if (mounted && !isHistoryOpen) {
      const timer = window.setTimeout(() => setMounted(false), 450);
      return () => window.clearTimeout(timer);
    }
  }, [mounted, isHistoryOpen]);

  const sorted = useMemo(
    () => [...conversations].sort((a, b) => b.updatedAt - a.updatedAt),
    [conversations],
  );

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button
        type="button"
        className={[
          "absolute inset-0 cursor-pointer bg-preto-suave/40",
          isHistoryOpen ? "dashboard-backdrop-in opacity-100" : "dashboard-soft opacity-0",
        ].join(" ")}
        aria-label="Fechar histórico"
        onClick={closeHistory}
      />

      <aside
        className={[
          "relative flex h-full w-full max-w-sm flex-col border-l border-[var(--db-border)] bg-[var(--db-surface)] shadow-[-8px_0_32px_rgba(42,42,42,0.1)]",
          isHistoryOpen ? "dashboard-slideover-panel" : "dashboard-soft translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Histórico de conversas"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-[var(--db-border-soft)] px-5 py-4">
          <h2 className={`text-lg font-bold ${textPrimary}`}>Histórico</h2>
          <button
            type="button"
            onClick={closeHistory}
            className="dashboard-soft flex size-9 cursor-pointer items-center justify-center rounded-md border border-[var(--db-border-soft)] bg-[var(--db-surface)] text-[var(--db-text-muted)] hover:border-verde-floresta/30 hover:text-verde-floresta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-floresta/40"
            aria-label="Fechar"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {sorted.length === 0 ? (
            <p className={`px-2 py-8 text-center text-sm ${textMuted}`}>Nenhuma conversa ainda.</p>
          ) : (
            <ul className="space-y-1">
              {sorted.map((conv) => {
                const active = conv.id === activeId;
                return (
                  <li key={conv.id}>
                    <div
                      className={[
                        "flex items-center gap-1 rounded-lg transition",
                        active ? "bg-verde-floresta/10 ring-1 ring-verde-floresta/25" : "hover:bg-[var(--db-hover)]",
                      ].join(" ")}
                    >
                      <button
                        type="button"
                        onClick={() => selectConversation(conv.id)}
                        className={`${btnClick} min-w-0 flex-1 px-3 py-2.5 text-left`}
                      >
                        <p
                          className={[
                            "truncate text-sm font-medium",
                            active ? "text-verde-floresta" : textPrimary,
                          ].join(" ")}
                        >
                          {conv.title}
                        </p>
                        <p className={`mt-0.5 text-[10px] ${textFaint}`}>
                          {formatConversationDate(conv.updatedAt)}
                          {conv.messages.length > 0 && ` · ${conv.messages.length} msgs`}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteConversation(conv.id)}
                        className={`${btnClick} mr-1.5 flex size-8 shrink-0 items-center justify-center rounded-md text-[var(--db-text-faint)] hover:bg-red-500/10 hover:text-red-500`}
                        aria-label={`Apagar conversa ${conv.title}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
