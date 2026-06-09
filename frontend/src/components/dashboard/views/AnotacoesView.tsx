import { useCallback, useEffect, useState } from "react";
import { NotebookPen, Plus, Trash2 } from "lucide-react";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { DashboardCard } from "@/components/dashboard/ui";
import {
  btnClick,
  btnSecondary,
  inputField,
  labelMuted,
  textFaint,
  textMuted,
  textPrimary,
} from "@/constants/dashboard";
import { useDashboard } from "@/context/DashboardContext";
import {
  createAnotacao,
  deleteAnotacao,
  listAnotacoes,
  updateAnotacao,
} from "@/lib/api/notesApi";
import type { AnotacaoResponse } from "@/lib/api/types";

function notePreviewText(note: AnotacaoResponse): string {
  const plain = (note.conteudoHtml ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain || "Sem conteúdo";
}

function formatNoteDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function AnotacoesView() {
  const { authUser } = useDashboard();
  const [notes, setNotes] = useState<AnotacaoResponse[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [draft, setDraft] = useState<AnotacaoResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const activeNote = draft;

  useEffect(() => {
    if (!authUser) return;
    let cancelled = false;
    setLoading(true);

    void listAnotacoes(authUser.idUsuario)
      .then((items) => {
        if (cancelled) return;
        setNotes(items);
        setActiveId(items[0]?.idAnotacao ?? null);
        setDraft(items[0] ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authUser]);

  const selectNote = useCallback((note: AnotacaoResponse) => {
    setActiveId(note.idAnotacao);
    setDraft(note);
  }, []);

  const persistDraft = useCallback((next: AnotacaoResponse) => {
    setDraft(next);
    setNotes((current) =>
      current
        .map((note) => (note.idAnotacao === next.idAnotacao ? next : note))
        .sort((a, b) => new Date(b.dataAtualizacao).getTime() - new Date(a.dataAtualizacao).getTime()),
    );
    void updateAnotacao(next.idAnotacao, {
      titulo: next.titulo.trim() || "Sem título",
      conteudoHtml: next.conteudoHtml ?? "",
    });
  }, []);

  const handleNewNote = () => {
    if (!authUser) return;
    void createAnotacao(authUser.idUsuario, {
      titulo: "Nova anotação",
      conteudoHtml: "",
    }).then((note) => {
      setNotes((current) => [note, ...current]);
      selectNote(note);
    });
  };

  const handleDelete = () => {
    if (!activeNote) return;
    const confirmed = window.confirm("Excluir esta anotação? Esta ação não pode ser desfeita.");
    if (!confirmed) return;

    void deleteAnotacao(activeNote.idAnotacao).then(() => {
      setNotes((current) => {
        const updated = current.filter((note) => note.idAnotacao !== activeNote.idAnotacao);
        const nextActive = updated[0] ?? null;
        setActiveId(nextActive?.idAnotacao ?? null);
        setDraft(nextActive);
        return updated;
      });
    });
  };

  const updateTitle = (titulo: string) => {
    if (!activeNote) return;
    persistDraft({ ...activeNote, titulo, dataAtualizacao: new Date().toISOString() });
  };

  const updateContent = (conteudoHtml: string) => {
    if (!activeNote) return;
    persistDraft({ ...activeNote, conteudoHtml, dataAtualizacao: new Date().toISOString() });
  };

  return (
    <div className="dashboard-fade-up flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-6">
      <aside className="flex w-full shrink-0 flex-col gap-3 lg:w-72 xl:w-80">
        <div className="flex items-center justify-between gap-2">
          <p className={labelMuted}>Suas anotações</p>
          <button
            type="button"
            onClick={handleNewNote}
            className={`${btnSecondary} ${btnClick} px-2.5 py-1.5 text-xs`}
            aria-label="Nova anotação"
          >
            <Plus className="size-4" aria-hidden />
            Nova
          </button>
        </div>

        <ul className="flex max-h-48 flex-col gap-2 overflow-y-auto lg:max-h-[calc(100dvh-18rem)]">
          {notes.map((note) => {
            const selected = note.idAnotacao === activeId;
            return (
              <li key={note.idAnotacao}>
                <button
                  type="button"
                  onClick={() => selectNote(note)}
                  className={[
                    btnClick,
                    "w-full rounded-xl border px-3 py-3 text-left transition-colors",
                    selected
                      ? "border-verde-floresta/30 bg-verde-floresta/5 ring-1 ring-verde-floresta/15"
                      : "border-[var(--db-border)] bg-[var(--db-surface)] hover:bg-[var(--db-hover)]",
                  ].join(" ")}
                >
                  <p className={`truncate text-sm font-semibold ${textPrimary}`}>{note.titulo}</p>
                  <p className={`mt-1 line-clamp-2 text-xs leading-relaxed ${textMuted}`}>
                    {notePreviewText(note)}
                  </p>
                  <p className={`mt-2 text-[10px] ${textFaint}`}>{formatNoteDate(note.dataAtualizacao)}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <DashboardCard className="flex min-h-[28rem] flex-1 flex-col p-0 sm:min-h-[32rem]">
        {activeNote ? (
          <>
            <div className="flex items-start justify-between gap-3 border-b border-[var(--db-border-soft)] px-4 py-4 sm:px-6">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg bg-verde-floresta/10 text-verde-floresta">
                  <NotebookPen className="size-4" aria-hidden />
                </span>
                <input
                  type="text"
                  value={activeNote.titulo}
                  onChange={(e) => updateTitle(e.target.value)}
                  className={`${inputField} border-0 bg-transparent px-0 py-0 text-lg font-bold shadow-none focus:ring-0 sm:text-xl`}
                  aria-label="Título da anotação"
                />
              </div>
              <button
                type="button"
                onClick={handleDelete}
                className={`${btnClick} flex size-9 shrink-0 items-center justify-center rounded-lg text-[var(--db-text-muted)] hover:bg-red-500/10 hover:text-red-500`}
                aria-label="Excluir anotação"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
              <RichTextEditor
                value={activeNote.conteudoHtml ?? ""}
                onChange={updateContent}
                placeholder="Registre observações sobre a propriedade, tarefas, colheitas ou qualquer outro assunto..."
                className="min-h-0 flex-1"
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <NotebookPen className="size-10 text-verde-floresta/60" aria-hidden />
            <p className={`mt-4 text-sm ${textMuted}`}>
              {loading ? "Carregando anotações..." : "Selecione ou crie uma anotação para começar."}
            </p>
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
