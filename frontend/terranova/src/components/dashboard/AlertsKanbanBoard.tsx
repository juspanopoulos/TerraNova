import { useMemo } from "react";
import { Clock, MapPin } from "lucide-react";
import type { AlertItem } from "@/data/mockDashboard";
import {
  levelAccent,
  textFaint,
  textMuted,
  textPrimary,
} from "@/constants/dashboard";
import {
  ALERT_KANBAN_COLUMNS,
  alertTypeIcon,
  type AlertKanbanColumn,
} from "@/lib/dashboard/alertKanban";
import type { AlertLevel } from "@/types/dashboard";

function AlertKanbanCard({ alert }: { alert: AlertItem }) {
  const accent = levelAccent[alert.level];
  const TypeIcon = alertTypeIcon(alert.type);

  return (
    <article className="relative overflow-hidden rounded-xl border border-[var(--db-border-soft)] bg-[var(--db-surface)]">
      <div className={`absolute inset-y-0 left-0 w-1 ${accent.bar}`} aria-hidden />

      <div className="flex flex-col gap-2.5 py-3 pl-4 pr-3">
        <div className="flex items-start gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-verde-floresta/10 text-verde-floresta">
            <TypeIcon className="size-3.5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className={`text-sm font-bold leading-snug ${textPrimary}`}>{alert.title}</h3>
            <span className="mt-1.5 inline-flex rounded-full bg-[var(--db-nested-bg)] px-2 py-0.5 text-[10px] font-medium text-verde-claro">
              {alert.type}
            </span>
          </div>
        </div>

        <p className={`line-clamp-2 text-xs leading-relaxed ${textMuted}`}>{alert.summary}</p>

        <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium ${textFaint}`}>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Clock className="size-3 shrink-0" aria-hidden />
            {alert.time}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3 shrink-0 text-verde-floresta/60" aria-hidden />
            {alert.sector}
          </span>
        </div>
      </div>
    </article>
  );
}

function KanbanColumn({
  config,
  alerts,
}: {
  config: AlertKanbanColumn;
  alerts: AlertItem[];
}) {
  const HeaderIcon = config.icon;

  return (
    <section className="flex min-w-0 flex-1 flex-col">
      <div className="flex min-h-[26rem] flex-1 flex-col rounded-2xl border border-[var(--db-border-soft)] bg-[var(--db-kanban-column)] p-2 sm:min-h-[30rem] sm:p-2.5">
        <header className={["rounded-xl px-3 py-2.5", config.header].join(" ")}>
          <div className="flex items-center gap-2">
            <HeaderIcon className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wide">{config.label}</h2>
                <span className="flex size-5 items-center justify-center rounded-full bg-black/10 text-[10px] font-bold tabular-nums dark:bg-white/15">
                  {alerts.length}
                </span>
              </div>
              <p className="mt-0.5 text-[10px] leading-snug opacity-80">{config.hint}</p>
            </div>
          </div>
        </header>

        <div className="mt-2.5 flex flex-1 flex-col gap-2.5 overflow-y-auto sm:mt-3 sm:gap-3">
          {alerts.length === 0 ? (
            <div
              className={`flex flex-1 items-center justify-center rounded-xl border border-dashed border-verde-floresta/20 px-3 py-8 text-center text-[11px] leading-relaxed ${textFaint}`}
            >
              Nenhum alerta neste nível
            </div>
          ) : (
            alerts.map((alert) => <AlertKanbanCard key={alert.id} alert={alert} />)
          )}
        </div>
      </div>
    </section>
  );
}

export function AlertsKanbanBoard({ alerts }: { alerts: AlertItem[] }) {
  const alertsByLevel = useMemo(
    () =>
      ALERT_KANBAN_COLUMNS.reduce(
        (acc, { id }) => {
          acc[id] = alerts.filter((alert) => alert.level === id);
          return acc;
        },
        {} as Record<AlertLevel, AlertItem[]>,
      ),
    [alerts],
  );

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      {ALERT_KANBAN_COLUMNS.map((config) => (
        <KanbanColumn key={config.id} config={config} alerts={alertsByLevel[config.id]} />
      ))}
    </div>
  );
}
