export type Note = {
  id: string;
  title: string;
  contentHtml: string;
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "terranova-notes";
const ACTIVE_KEY = "terranova-notes-active-id";

function readNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function loadNotes(): Note[] {
  return readNotes().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function loadActiveNoteId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

export function saveActiveNoteId(id: string | null) {
  if (id) localStorage.setItem(ACTIVE_KEY, id);
  else localStorage.removeItem(ACTIVE_KEY);
}

export function createNote(): Note {
  const now = Date.now();
  return {
    id: `note-${now}`,
    title: "Nova anotação",
    contentHtml: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function upsertNote(note: Note): Note[] {
  const notes = readNotes();
  const index = notes.findIndex((n) => n.id === note.id);
  const updated = { ...note, updatedAt: Date.now() };
  if (index >= 0) notes[index] = updated;
  else notes.unshift(updated);
  writeNotes(notes);
  return notes.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function deleteNote(id: string): Note[] {
  const notes = readNotes().filter((n) => n.id !== id);
  writeNotes(notes);
  return notes.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function notePreviewText(note: Note): string {
  const plain = note.contentHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain) return plain.length > 80 ? `${plain.slice(0, 80)}…` : plain;
  return "Sem conteúdo";
}

export function formatNoteDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
