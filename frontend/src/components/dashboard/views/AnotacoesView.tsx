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
import {
  createNote,
  deleteNote,
  formatNoteDate,
  loadActiveNoteId,
  loadNotes,
  notePreviewText,
  saveActiveNoteId,
  upsertNote,
  type Note,
} from "@/lib/dashboard/notesStorage";

function resolveInitialState() {
  const notes = loadNotes();
  const storedId = loadActiveNoteId();
  const active =
    storedId && notes.some((n) => n.id === storedId) ? storedId : (notes[0]?.id ?? null);
  const draft = active ? (notes.find((n) => n.id === active) ?? null) : null;
  return { notes, activeId: active, draft };
}

export function AnotacoesView() {
  const [notes, setNotes] = useState<Note[]>(() => resolveInitialState().notes);
  const [activeId, setActiveId] = useState<string | null>(() => resolveInitialState().activeId);
  const [draft, setDraft] = useState<Note | null>(() => resolveInitialState().draft);

  const activeNote = draft;

  const selectNote = useCallback((note: Note) => {
    setActiveId(note.id);
    saveActiveNoteId(note.id);
    setDraft(note);
  }, []);

  const persistDraft = useCallback((next: Note) => {
    setDraft(next);
    const updated = upsertNote(next);
    setNotes(updated);
    saveActiveNoteId(next.id);
    setActiveId(next.id);
  }, []);

  useEffect(() => {
    if (notes.length > 0) return;
    const note = createNote();
    const updated = upsertNote(note);
    setNotes(updated);
    setActiveId(note.id);
    setDraft(note);
    saveActiveNoteId(note.id);
  }, [notes.length]);

  const handleNewNote = () => {
    const note = createNote();
    const updated = upsertNote(note);
    setNotes(updated);
    selectNote(note);
  };

  const handleDelete = () => {
    if (!activeNote) return;
    const confirmed = window.confirm("Excluir esta anotação? Esta ação não pode ser desfeita.");
    if (!confirmed) return;
    const updated = deleteNote(activeNote.id);
    setNotes(updated);
    setDraft(null);
    if (updated.length > 0) {
      selectNote(updated[0]);
    } else {
      const note = createNote();
      const fresh = upsertNote(note);
      setNotes(fresh);
      selectNote(note);
    }
  };

  const updateTitle = (title: string) => {
    if (!activeNote) return;
    persistDraft({ ...activeNote, title });
  };

  const updateContent = (contentHtml: string) => {
    if (!activeNote) return;
    persistDraft({ ...activeNote, contentHtml });
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
            const selected = note.id === activeId;
            return (
              <li key={note.id}>
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
                  <p className={`truncate text-sm font-semibold ${textPrimary}`}>{note.title}</p>
                  <p className={`mt-1 line-clamp-2 text-xs leading-relaxed ${textMuted}`}>
                    {notePreviewText(note)}
                  </p>
                  <p className={`mt-2 text-[10px] ${textFaint}`}>{formatNoteDate(note.updatedAt)}</p>
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
                  value={activeNote.title}
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
                value={activeNote.contentHtml}
                onChange={updateContent}
                placeholder="Registre observações sobre a propriedade, tarefas, colheitas ou qualquer outro assunto…"
                className="min-h-0 flex-1"
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <NotebookPen className="size-10 text-verde-floresta/60" aria-hidden />
            <p className={`mt-4 text-sm ${textMuted}`}>Selecione ou crie uma anotação para começar.</p>
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
