import { useEffect, useState, type ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  CustomDatePicker,
  CustomMonthPicker,
  CustomSelect,
} from "@/components/dashboard/DashboardPickers";

export type DateRange = { start: string; end: string };

export type AlertLevel = "critical" | "warning" | "normal";

export type ViewId = "overview" | "alerts" | "climate" | "soil" | "growth" | "water" | "assistant" | "notes" | "settings";

export type TimeFilter = "daily" | "weekly" | "monthly" | "yearly";

export type PageFilters = {
  dateRange: DateRange;
  selectedMonth: string;
  alertLevels: AlertLevel[];
  alertTypes: string[];
  soilSector: string;
  growthCrop: string;
};

function isoDate(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function defaultDateRange(): DateRange {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 30);
  return { start: isoDate(start), end: isoDate(end) };
}

export const DEFAULT_DATE_RANGE: DateRange = defaultDateRange();

export const DEFAULT_MONTH = monthKey(new Date());

export const DEFAULT_PAGE_FILTERS: PageFilters = {
  dateRange: DEFAULT_DATE_RANGE,
  selectedMonth: DEFAULT_MONTH,
  alertLevels: [],
  alertTypes: [],
  soilSector: "all",
  growthCrop: "all",
};

const filterFieldLabel =
  "text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--db-text-faint)] sm:text-xs";

const chipBtn =
  "dashboard-soft cursor-pointer rounded-md border px-3 py-1.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-floresta/40";

const ALERT_LEVELS: { id: AlertLevel; label: string }[] = [
  { id: "critical", label: "Crítico" },
  { id: "warning", label: "Moderado" },
  { id: "normal", label: "Normal" },
];

export function hasFiltersForView(view: ViewId, timeFilter: TimeFilter): boolean {
  if (view === "climate" || view === "settings" || view === "assistant" || view === "notes") return false;
  if (view === "alerts" || view === "soil" || view === "growth") return true;
  if (view === "overview" || view === "water") return timeFilter !== "daily";
  return false;
}

export function countActiveFilters(view: ViewId, timeFilter: TimeFilter, filters: PageFilters): number {
  if (!hasFiltersForView(view, timeFilter)) return 0;

  let count = 0;

  if ((view === "overview" || view === "water") && timeFilter === "monthly") {
    if (filters.selectedMonth !== DEFAULT_MONTH) count++;
  }

  if ((view === "overview" || view === "water") && (timeFilter === "weekly" || timeFilter === "yearly")) {
    if (filters.dateRange.start !== DEFAULT_DATE_RANGE.start) count++;
    if (filters.dateRange.end !== DEFAULT_DATE_RANGE.end) count++;
  }

  if (view === "alerts") {
    if (filters.alertLevels.length > 0) count++;
    if (filters.alertTypes.length > 0) count++;
  }

  if (view === "soil" && filters.soilSector !== "all") count++;
  if (view === "growth" && filters.growthCrop !== "all") count++;

  return count;
}

function toggleChip<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-[var(--db-border-soft)] pb-5 last:border-b-0 last:pb-0">
      <h3 className={`${filterFieldLabel} mb-3`}>{title}</h3>
      {children}
    </section>
  );
}

function ChipGroup<T extends string>({
  options,
  selected,
  onChange,
}: {
  options: { id: T; label: string }[];
  selected: T[];
  onChange: (next: T[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(({ id, label }) => {
        const active = selected.includes(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(toggleChip(selected, id))}
            className={[
              chipBtn,
              active
                ? "border-verde-floresta bg-verde-floresta text-bege-natural"
                : "border-[var(--db-border)] bg-[var(--db-surface)] text-[var(--db-text-muted)] hover:border-verde-floresta/30",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function FilterTriggerButton({
  activeCount,
  onClick,
}: {
  activeCount: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="dashboard-soft inline-flex cursor-pointer items-center gap-2 rounded-md border border-[var(--db-border)] bg-[var(--db-surface)] px-3 py-2 text-sm font-semibold text-[var(--db-text)] shadow-sm hover:border-verde-floresta/30 hover:text-verde-floresta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-floresta/40 sm:px-4"
    >
      <SlidersHorizontal className="size-4" aria-hidden />
      Filtros
      {activeCount > 0 && (
        <span className="dashboard-soft flex size-5 items-center justify-center rounded-full bg-verde-floresta text-[10px] font-bold text-bege-natural">
          {activeCount}
        </span>
      )}
    </button>
  );
}

export function FilterSlideover({
  open,
  view,
  timeFilter,
  draft,
  alertTypes,
  soilSectors,
  growthCrops,
  onClose,
  onDraftChange,
  onApply,
  onClear,
}: {
  open: boolean;
  view: ViewId;
  timeFilter: TimeFilter;
  draft: PageFilters;
  alertTypes: string[];
  soilSectors: string[];
  growthCrops: { id: string; label: string }[];
  onClose: () => void;
  onDraftChange: (next: PageFilters) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (mounted && !open) {
      const timer = window.setTimeout(() => setMounted(false), 450);
      return () => window.clearTimeout(timer);
    }
  }, [mounted, open]);

  if (!mounted) return null;

  const showComparative =
    (view === "overview" || view === "water") &&
    (timeFilter === "weekly" || timeFilter === "yearly");
  const showMonth = (view === "overview" || view === "water") && timeFilter === "monthly";

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button
        type="button"
        className={[
          "absolute inset-0 cursor-pointer bg-preto-suave/40",
          open ? "dashboard-backdrop-in opacity-100" : "dashboard-soft opacity-0",
        ].join(" ")}
        aria-label="Fechar filtros"
        onClick={onClose}
      />

      <aside
        className={[
          "relative flex h-full w-full max-w-sm flex-col border-l border-[var(--db-border)] bg-[var(--db-surface)] shadow-[-8px_0_32px_rgba(42,42,42,0.1)]",
          open ? "dashboard-slideover-panel" : "dashboard-soft translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-[var(--db-border-soft)] px-5 py-4">
          <h2 className="text-lg font-bold text-[var(--db-text)]">Filtros</h2>
          <button
            type="button"
            onClick={onClose}
            className="dashboard-soft flex size-9 cursor-pointer items-center justify-center rounded-md border border-[var(--db-border-soft)] bg-[var(--db-surface)] text-[var(--db-text-muted)] hover:border-verde-floresta/30 hover:text-verde-floresta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-floresta/40"
            aria-label="Fechar"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {showComparative && (
            <div className="space-y-4 border-b border-[var(--db-border-soft)] pb-5">
              <div className="flex flex-col gap-1.5">
                <span className={filterFieldLabel}>Período</span>
                <CustomDatePicker
                  value={draft.dateRange.start}
                  max={draft.dateRange.end}
                  onChange={(start) =>
                    onDraftChange({ ...draft, dateRange: { ...draft.dateRange, start } })
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className={filterFieldLabel}>Comparativo</span>
                <CustomDatePicker
                  value={draft.dateRange.end}
                  min={draft.dateRange.start}
                  onChange={(end) =>
                    onDraftChange({ ...draft, dateRange: { ...draft.dateRange, end } })
                  }
                />
              </div>
            </div>
          )}

          {showMonth && (
            <div className="border-b border-[var(--db-border-soft)] pb-5">
              <div className="flex flex-col gap-1.5">
                <span className={filterFieldLabel}>Mês</span>
                <CustomMonthPicker
                  value={draft.selectedMonth}
                  onChange={(selectedMonth) => onDraftChange({ ...draft, selectedMonth })}
                />
              </div>
            </div>
          )}

          {view === "alerts" && (
            <>
              <FilterSection title="Nível">
                <ChipGroup
                  options={ALERT_LEVELS}
                  selected={draft.alertLevels}
                  onChange={(alertLevels) => onDraftChange({ ...draft, alertLevels })}
                />
              </FilterSection>
              <FilterSection title="Tipo">
                <ChipGroup
                  options={alertTypes.map((t) => ({ id: t, label: t }))}
                  selected={draft.alertTypes}
                  onChange={(alertTypes) => onDraftChange({ ...draft, alertTypes })}
                />
              </FilterSection>
            </>
          )}

          {view === "soil" && (
            <FilterSection title="Setor">
              <CustomSelect
                value={draft.soilSector}
                onChange={(soilSector) => onDraftChange({ ...draft, soilSector })}
                placeholder="Todos os setores"
                options={[
                  { value: "all", label: "Todos os setores" },
                  ...soilSectors.map((sector) => ({ value: sector, label: sector })),
                ]}
              />
            </FilterSection>
          )}

          {view === "growth" && (
            <FilterSection title="Cultura">
              <CustomSelect
                value={draft.growthCrop}
                onChange={(growthCrop) => onDraftChange({ ...draft, growthCrop })}
                placeholder="Todas as culturas"
                options={[
                  { value: "all", label: "Todas as culturas" },
                  ...growthCrops.map(({ id, label }) => ({ value: id, label })),
                ]}
              />
            </FilterSection>
          )}
        </div>

        <footer className="flex shrink-0 gap-3 border-t border-[var(--db-border-soft)] px-5 py-4">
          <button
            type="button"
            onClick={onClear}
            className="dashboard-soft flex-1 cursor-pointer rounded-md border border-[var(--db-border)] bg-[var(--db-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--db-text-muted)] hover:border-verde-floresta/30 hover:text-verde-floresta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-floresta/40"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={onApply}
            className="dashboard-soft flex-1 cursor-pointer rounded-md bg-verde-floresta px-4 py-2.5 text-sm font-semibold text-bege-natural hover:bg-verde-floresta/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-floresta/40"
          >
            Aplicar
          </button>
        </footer>
      </aside>
    </div>
  );
}
