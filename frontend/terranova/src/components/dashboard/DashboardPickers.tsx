import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS_SHORT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const MONTHS_FULL = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

const pickerTrigger =
  "dashboard-soft flex min-w-[9.5rem] w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-[var(--db-border)] bg-[var(--db-surface)] px-3 py-2 text-sm font-semibold text-[var(--db-text)] shadow-sm outline-none hover:border-verde-floresta/30 focus-visible:border-verde-floresta/50 focus-visible:ring-2 focus-visible:ring-verde-floresta/10";

const pickerPopover =
  "dashboard-popover-in absolute right-0 top-full z-50 mt-2 w-full min-w-[17.5rem] rounded-xl border border-[var(--db-border)] bg-[var(--db-surface)] p-4 shadow-[0_10px_28px_rgba(0,0,0,0.18)]";

const navBtn =
  "dashboard-soft flex size-8 cursor-pointer items-center justify-center rounded-md text-verde-floresta/70 hover:bg-[var(--db-hover)] hover:text-verde-floresta focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-verde-floresta/40";

const listOptionBtn =
  "dashboard-soft w-full cursor-pointer rounded-md px-3 py-2.5 text-left text-sm font-semibold text-[var(--db-text-muted)] hover:bg-[var(--db-hover)] hover:text-[var(--db-text)]";

function parseIsoDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateDisplay(iso: string) {
  return parseIsoDate(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMonthDisplay(iso: string) {
  const [y, m] = iso.split("-").map(Number);
  return `${MONTHS_FULL[m - 1]} ${y}`;
}

function usePickerDismiss(open: boolean, onClose: () => void, containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;

    const onPointer = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, containerRef]);
}

function CalendarGrid({
  viewYear,
  viewMonth,
  selected,
  min,
  max,
  onSelect,
}: {
  viewYear: number;
  viewMonth: number;
  selected: string;
  min?: string;
  max?: string;
  onSelect: (iso: string) => void;
}) {
  const selectedDate = parseIsoDate(selected);
  const minDate = min ? parseIsoDate(min) : null;
  const maxDate = max ? parseIsoDate(max) : null;
  const todayIso = toIsoDate(new Date());

  const cells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const result: { day: number | null; iso: string | null }[] = [];

    for (let i = 0; i < startPad; i++) result.push({ day: null, iso: null });
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = toIsoDate(new Date(viewYear, viewMonth, day));
      result.push({ day, iso });
    }
    return result;
  }, [viewYear, viewMonth]);

  const isDisabled = (iso: string) => {
    const d = parseIsoDate(iso);
    if (minDate && d < minDate) return true;
    if (maxDate && d > maxDate) return true;
    return false;
  };

  return (
    <>
      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-[var(--db-text-faint)]"
          >
            {w}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell.day || !cell.iso) {
            return <span key={`empty-${i}`} className="size-8" aria-hidden />;
          }
          const disabled = isDisabled(cell.iso);
          const isSelected =
            selectedDate.getFullYear() === viewYear &&
            selectedDate.getMonth() === viewMonth &&
            selectedDate.getDate() === cell.day;
          const isToday = cell.iso === todayIso;

          return (
            <button
              key={cell.iso}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(cell.iso!)}
              className={[
                "dashboard-soft size-8 cursor-pointer rounded-md text-xs font-semibold tabular-nums",
                disabled && "cursor-not-allowed opacity-30",
                isSelected
                  ? "bg-verde-floresta text-bege-natural shadow-sm"
                  : isToday
                    ? "bg-verde-floresta/10 text-verde-floresta ring-1 ring-verde-floresta/25"
                    : "text-[var(--db-text-muted)] hover:bg-[var(--db-hover)]",
              ].join(" ")}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </>
  );
}

export function CustomDatePicker({
  value,
  onChange,
  min,
  max,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  id?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = parseIsoDate(value);
  const [viewYear, setViewYear] = useState(selected.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getMonth());

  usePickerDismiss(open, () => setOpen(false), rootRef);

  useEffect(() => {
    const d = parseIsoDate(value);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }, [value]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelect = (iso: string) => {
    onChange(iso);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={pickerTrigger}
      >
        <span className="inline-flex items-center gap-2 tabular-nums">
          <CalendarDays className="size-3.5 shrink-0 text-verde-floresta/60" aria-hidden />
          {formatDateDisplay(value)}
        </span>
        <ChevronDown
          className={`dashboard-soft size-3.5 shrink-0 text-[var(--db-text-faint)] ${open ? "rotate-180" : "rotate-0"}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className={pickerPopover} role="dialog" aria-label="Selecionar data">
          <div className="mb-3 flex items-center justify-between gap-2">
            <button type="button" onClick={prevMonth} className={navBtn} aria-label="Mês anterior">
              <ChevronLeft className="size-4" />
            </button>
            <p className="text-sm font-bold text-verde-floresta">
              {MONTHS_FULL[viewMonth]} {viewYear}
            </p>
            <button type="button" onClick={nextMonth} className={navBtn} aria-label="Próximo mês">
              <ChevronRight className="size-4" />
            </button>
          </div>
          <CalendarGrid
            viewYear={viewYear}
            viewMonth={viewMonth}
            selected={value}
            min={min}
            max={max}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}

export function CustomMonthPicker({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(Number(value.split("-")[0]));

  usePickerDismiss(open, () => setOpen(false), rootRef);

  useEffect(() => {
    setYear(Number(value.split("-")[0]));
  }, [value]);

  const selectedMonth = Number(value.split("-")[1]);

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={pickerTrigger}
      >
        <span className="inline-flex items-center gap-2">
          <CalendarDays className="size-3.5 shrink-0 text-verde-floresta/60" aria-hidden />
          {formatMonthDisplay(value)}
        </span>
        <ChevronDown
          className={`dashboard-soft size-3.5 shrink-0 text-[var(--db-text-faint)] ${open ? "rotate-180" : "rotate-0"}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className={pickerPopover} role="dialog" aria-label="Selecionar mês">
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setYear((y) => y - 1)}
              className={navBtn}
              aria-label="Ano anterior"
            >
              <ChevronLeft className="size-4" />
            </button>
            <p className="text-sm font-bold text-verde-floresta">{year}</p>
            <button
              type="button"
              onClick={() => setYear((y) => y + 1)}
              className={navBtn}
              aria-label="Próximo ano"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MONTHS_SHORT.map((label, index) => {
              const month = index + 1;
              const iso = `${year}-${String(month).padStart(2, "0")}`;
              const active = selectedMonth === month && Number(value.split("-")[0]) === year;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                  className={[
                    "dashboard-soft cursor-pointer rounded-md px-2 py-2 text-xs font-semibold",
                    active
                      ? "bg-verde-floresta text-bege-natural shadow-sm"
                      : "text-[var(--db-text-muted)] hover:bg-[var(--db-hover)]",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Selecionar",
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  id?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  usePickerDismiss(open, () => setOpen(false), rootRef);

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={pickerTrigger}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={`dashboard-soft size-3.5 shrink-0 text-[var(--db-text-faint)] ${open ? "rotate-180" : "rotate-0"}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          className={`${pickerPopover} max-h-56 overflow-y-auto py-1`}
          role="listbox"
          aria-label={placeholder}
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={[
                  listOptionBtn,
                  active && "bg-verde-floresta/10 text-verde-floresta",
                ].join(" ")}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
