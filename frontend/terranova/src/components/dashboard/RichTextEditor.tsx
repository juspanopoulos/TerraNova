import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  RemoveFormatting,
  Strikethrough,
  Underline,
} from "lucide-react";
import { btnClick, textMuted } from "@/constants/dashboard";

type FormatId =
  | "bold"
  | "italic"
  | "underline"
  | "strikeThrough"
  | "h2"
  | "h3"
  | "quote"
  | "insertUnorderedList"
  | "insertOrderedList"
  | "insertHorizontalRule"
  | "highlight"
  | "alignLeft"
  | "alignCenter"
  | "alignRight"
  | "link"
  | "removeFormat";

type ToolbarButton = {
  id: FormatId;
  label: string;
  icon: typeof Bold;
};

type ToolbarGroup = {
  id: string;
  items: ToolbarButton[];
};

const TOOLBAR_GROUPS: ToolbarGroup[] = [
  {
    id: "text",
    items: [
      { id: "bold", label: "Negrito", icon: Bold },
      { id: "italic", label: "Itálico", icon: Italic },
      { id: "underline", label: "Sublinhado", icon: Underline },
      { id: "strikeThrough", label: "Tachado", icon: Strikethrough },
    ],
  },
  {
    id: "headings",
    items: [
      { id: "h2", label: "Título grande", icon: Heading2 },
      { id: "h3", label: "Subtítulo", icon: Heading3 },
      { id: "quote", label: "Citação", icon: Quote },
    ],
  },
  {
    id: "lists",
    items: [
      { id: "insertUnorderedList", label: "Lista com marcadores", icon: List },
      { id: "insertOrderedList", label: "Lista numerada", icon: ListOrdered },
      { id: "insertHorizontalRule", label: "Linha divisória", icon: Minus },
    ],
  },
  {
    id: "align",
    items: [
      { id: "alignLeft", label: "Alinhar à esquerda", icon: AlignLeft },
      { id: "alignCenter", label: "Centralizar", icon: AlignCenter },
      { id: "alignRight", label: "Alinhar à direita", icon: AlignRight },
    ],
  },
  {
    id: "extra",
    items: [
      { id: "highlight", label: "Destacar texto", icon: Highlighter },
      { id: "link", label: "Inserir link", icon: Link2 },
      { id: "removeFormat", label: "Limpar formatação", icon: RemoveFormatting },
    ],
  },
];

const ACTIVE_QUERY: Partial<Record<FormatId, string>> = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  strikeThrough: "strikeThrough",
  insertUnorderedList: "insertUnorderedList",
  insertOrderedList: "insertOrderedList",
  alignLeft: "justifyLeft",
  alignCenter: "justifyCenter",
  alignRight: "justifyRight",
};

const HIGHLIGHT_COLOR = "#F5E6C8";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

function isEditorFocused(editor: HTMLDivElement | null) {
  if (!editor) return false;
  const selection = window.getSelection();
  return Boolean(selection?.anchorNode && editor.contains(selection.anchorNode));
}

function readActiveFormats(editor: HTMLDivElement | null): Set<FormatId> {
  const active = new Set<FormatId>();
  if (!isEditorFocused(editor)) return active;

  for (const [id, command] of Object.entries(ACTIVE_QUERY) as [FormatId, string][]) {
    try {
      if (document.queryCommandState(command)) active.add(id);
    } catch {
      /* ignore unsupported commands */
    }
  }

  try {
    const block = document.queryCommandValue("formatBlock").toLowerCase();
    if (block === "h2") active.add("h2");
    if (block === "h3") active.add("h3");
    if (block === "blockquote") active.add("quote");
  } catch {
    /* ignore */
  }

  return active;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Escreva sua anotação…",
  className = "",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);
  const [activeFormats, setActiveFormats] = useState<Set<FormatId>>(() => new Set());

  const refreshActiveFormats = useCallback(() => {
    setActiveFormats(readActiveFormats(editorRef.current));
  }, []);

  useEffect(() => {
    const el = editorRef.current;
    if (!el || isInternalChange.current) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value;
    }
  }, [value]);

  useEffect(() => {
    const onSelectionChange = () => refreshActiveFormats();
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, [refreshActiveFormats]);

  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    isInternalChange.current = true;
    onChange(el.innerHTML);
    requestAnimationFrame(() => {
      isInternalChange.current = false;
    });
    refreshActiveFormats();
  }, [onChange, refreshActiveFormats]);

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const applyFormat = (id: FormatId) => {
    focusEditor();

    switch (id) {
      case "h2":
        document.execCommand("formatBlock", false, "h2");
        break;
      case "h3":
        document.execCommand("formatBlock", false, "h3");
        break;
      case "quote":
        document.execCommand("formatBlock", false, "blockquote");
        break;
      case "highlight": {
        const highlighted =
          document.execCommand("hiliteColor", false, HIGHLIGHT_COLOR) ||
          document.execCommand("backColor", false, HIGHLIGHT_COLOR);
        if (!highlighted) {
          document.execCommand("insertHTML", false, `<mark>${window.getSelection()?.toString() || ""}</mark>`);
        }
        break;
      }
      case "alignLeft":
        document.execCommand("justifyLeft", false);
        break;
      case "alignCenter":
        document.execCommand("justifyCenter", false);
        break;
      case "alignRight":
        document.execCommand("justifyRight", false);
        break;
      case "link": {
        const url = window.prompt("URL do link:");
        if (!url?.trim()) break;
        const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
        document.execCommand("createLink", false, normalized);
        break;
      }
      case "removeFormat":
        document.execCommand("removeFormat", false);
        document.execCommand("unlink", false);
        break;
      default:
        document.execCommand(id, false);
    }

    emitChange();
  };

  const handleInput = () => {
    emitChange();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    emitChange();
  };

  const toolbarBtnClass = (active: boolean) =>
    [
      btnClick,
      "flex size-8 items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
      active
        ? "border-verde-floresta/40 bg-verde-floresta text-bege-natural shadow-sm"
        : "border-transparent bg-transparent text-[var(--db-text-muted)] hover:border-[var(--db-border)] hover:bg-[var(--db-hover)] hover:text-verde-floresta",
    ].join(" ");

  return (
    <div className={`flex min-h-0 flex-1 flex-col ${className}`.trim()}>
      <div
        className="flex flex-wrap items-center gap-x-1 gap-y-1.5 rounded-t-xl border border-b-0 border-[var(--db-border)] bg-[var(--db-surface-muted)] px-2 py-2 sm:px-3"
        role="toolbar"
        aria-label="Formatação de texto"
      >
        {TOOLBAR_GROUPS.map((group, groupIndex) => (
          <div key={group.id} className="flex items-center gap-0.5">
            {groupIndex > 0 && (
              <span
                className="mx-1 hidden h-5 w-px bg-[var(--db-border)] sm:block"
                aria-hidden
              />
            )}
            {group.items.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                title={label}
                aria-label={label}
                aria-pressed={activeFormats.has(id)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat(id)}
                className={toolbarBtnClass(activeFormats.has(id))}
              >
                <Icon className="size-4" aria-hidden />
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="relative min-h-0 flex-1">
        {!value.replace(/<[^>]+>/g, "").trim() && (
          <p
            className={`pointer-events-none absolute left-4 top-4 text-sm sm:left-5 sm:top-5 ${textMuted}`}
            aria-hidden
          >
            {placeholder}
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyUp={refreshActiveFormats}
          onMouseUp={refreshActiveFormats}
          onFocus={refreshActiveFormats}
          className="notes-editor-content min-h-[16rem] flex-1 overflow-y-auto rounded-b-xl border border-[var(--db-border)] bg-[var(--db-surface)] px-4 py-4 text-sm leading-relaxed text-[var(--db-text)] outline-none focus:ring-2 focus:ring-inset focus:ring-verde-floresta/15 sm:min-h-[20rem] sm:px-5 sm:py-5"
          role="textbox"
          aria-multiline
          aria-label="Conteúdo da anotação"
        />
      </div>
    </div>
  );
}
