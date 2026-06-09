import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Thermometer } from "lucide-react";
import { History, MessageSquarePlus } from "lucide-react";
import { ToolbarActionButton } from "@/components/dashboard/AssistantHistorySlideover";
import { VisionExcelExportButton } from "@/components/dashboard/VisionExcelExportButton";
import { useAssistantChatOptional } from "@/context/AssistantChatContext";
import {
  FilterTriggerButton,
  hasFiltersForView,
} from "@/components/dashboard/FilterSlideover";
import {
  btnClick,
  cardBase,
  cardInset,
  gridCols4,
  labelMuted,
  pageTitle,
  pageTitleFromPath,
  showsPagePeriodFilter,
  TIME_FILTER_FROM_PATH,
  TIME_FILTERS,
  VISION_CARDS,
  VISION_ROUTE_BY_FILTER,
} from "@/constants/dashboard";
import { eyebrow } from "@/constants/layout";
import type { TimeFilter, ViewId } from "@/types/dashboard";

export function DashboardCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <article className={`${cardBase} ${className}`.trim()}>{children}</article>;
}

export function PageToolbar({
  view,
  timeFilter,
  activeFilterCount,
  onOpenFilters,
  onPeriodChange,
  pathname,
}: {
  view: ViewId;
  timeFilter: TimeFilter;
  activeFilterCount: number;
  onOpenFilters: () => void;
  onPeriodChange: (filter: TimeFilter) => void;
  pathname: string;
}) {
  const assistantChat = useAssistantChatOptional();
  const showPeriodFilter = showsPagePeriodFilter(view);
  const showFilters = hasFiltersForView(view, timeFilter);
  const showAssistantActions = view === "assistant" && assistantChat;
  const visionTimeFilter = TIME_FILTER_FROM_PATH(pathname);
  const showVisionExport = visionTimeFilter !== null;
  const showActions = showPeriodFilter || showFilters || showAssistantActions || showVisionExport;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-8">
      <h1 className={`min-w-0 flex-1 ${pageTitle}`}>{pageTitleFromPath(pathname)}</h1>
      {showActions && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          {showVisionExport && visionTimeFilter && (
            <VisionExcelExportButton timeFilter={visionTimeFilter} />
          )}
          {showPeriodFilter && (
            <PeriodFilterTabs value={timeFilter} onChange={onPeriodChange} inline />
          )}
          {showAssistantActions && (
            <>
              <ToolbarActionButton
                label="Histórico"
                icon={History}
                onClick={assistantChat.openHistory}
              />
              <ToolbarActionButton
                label="Nova conversa"
                icon={MessageSquarePlus}
                onClick={assistantChat.startNewConversation}
              />
            </>
          )}
          {showFilters && (
            <FilterTriggerButton activeCount={activeFilterCount} onClick={onOpenFilters} />
          )}
        </div>
      )}
    </div>
  );
}

export function VisionNavCards() {
  const { pathname } = useLocation();

  return (
    <div className={gridCols4}>
      {VISION_CARDS.map(({ id, label, description, icon: Icon }) => {
        const to = VISION_ROUTE_BY_FILTER[id];
        const active = pathname === to || pathname.startsWith(`${to}/`);
        return (
          <Link
            key={id}
            to={to}
            className={[
              btnClick,
              cardBase,
              "group relative flex min-w-0 w-full cursor-pointer flex-col gap-3 overflow-hidden text-left no-underline",
              active
                ? "border-verde-floresta/25 ring-2 ring-verde-floresta/15"
                : "hover:border-[var(--db-border)]",
            ].join(" ")}
          >
            <span
              className={[
                "absolute inset-x-0 top-0 h-0.5 bg-verde-floresta dashboard-soft",
                active ? "opacity-100" : "opacity-0",
              ].join(" ")}
              aria-hidden
            />
            <div className="flex items-center justify-between gap-2">
              <span
                className={[
                  "flex size-9 items-center justify-center rounded-md dashboard-soft",
                  active
                    ? "bg-verde-floresta text-bege-natural"
                    : "bg-[var(--db-surface-muted)] text-[var(--db-text-muted)] group-hover:bg-[var(--db-hover)]",
                ].join(" ")}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span
                className={[
                  `${eyebrow} mb-0 text-[10px] dashboard-soft`,
                  active ? "opacity-100" : "pointer-events-none opacity-0",
                ].join(" ")}
              >
                Ativa
              </span>
            </div>
            <div>
              <p
                className={[
                  "text-sm font-bold dashboard-soft sm:text-base",
                  active ? "text-verde-floresta" : "text-[var(--db-text)]",
                ].join(" ")}
              >
                {label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--db-text-muted)] sm:text-sm">
                {description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function PeriodFilterTabs({
  value,
  onChange,
  inline = false,
}: {
  value: TimeFilter;
  onChange: (filter: TimeFilter) => void;
  inline?: boolean;
}) {
  return (
    <div
      className={inline ? "flex flex-wrap items-center gap-1.5 sm:gap-2" : "mb-4 flex flex-wrap gap-2 sm:mb-6"}
      role="tablist"
      aria-label="Período de análise"
    >
      {TIME_FILTERS.map(({ id, label }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={[
              btnClick,
              "rounded-md border px-2.5 py-2 text-xs font-semibold sm:px-3 sm:text-sm",
              inline ? "shadow-sm" : "",
              active
                ? "border-verde-floresta bg-verde-floresta text-bege-natural"
                : "border-[var(--db-border)] bg-[var(--db-surface)] text-[var(--db-text-muted)] hover:border-verde-floresta/30 hover:text-verde-floresta",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function MetricTile({
  label,
  value,
  unit,
  icon: Icon,
}: {
  label: string;
  value: string;
  unit?: string;
  icon: typeof Thermometer;
}) {
  return (
    <div className={`${cardInset} min-w-0`}>
      <div className="flex items-start justify-between gap-2">
        <p className={labelMuted}>{label}</p>
        <Icon className="size-4 shrink-0 text-verde-floresta/50 sm:size-5" aria-hidden />
      </div>
      <p className="mt-2 text-xl font-bold tabular-nums text-[var(--db-text)] sm:text-2xl md:text-3xl">
        {value}
        {unit && <span className="ml-1 text-sm font-semibold text-[var(--db-text-faint)]">{unit}</span>}
      </p>
    </div>
  );
}

export function DataTable({ children, caption }: { children: ReactNode; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--db-border)]">
      <table className="w-full min-w-[280px] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}
