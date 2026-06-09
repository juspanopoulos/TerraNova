import { useMemo } from "react";
import { Bell } from "lucide-react";
import { AlertsKanbanBoard } from "@/components/dashboard/AlertsKanbanBoard";
import type { PageFilters } from "@/components/dashboard/FilterSlideover";
import { labelMuted, textFaint, textMuted, textPrimary } from "@/constants/dashboard";
import { useDashboard } from "@/context/DashboardContext";

export function AlertsView() {
  const { alerts: dashboardAlerts, appliedFilters, company } = useDashboard();
  const filters: PageFilters = appliedFilters;

  const alerts = useMemo(() => {
    return dashboardAlerts.filter((alert) => {
      if (filters.alertLevels.length > 0 && !filters.alertLevels.includes(alert.level)) {
        return false;
      }
      if (filters.alertTypes.length > 0 && !filters.alertTypes.includes(alert.type)) {
        return false;
      }
      return true;
    });
  }, [dashboardAlerts, filters.alertLevels, filters.alertTypes]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="db-hero-gradient overflow-hidden rounded-xl border border-[var(--db-border)] p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-verde-floresta text-bege-natural">
              <Bell className="size-5" aria-hidden />
            </span>
            <div>
              <p className={labelMuted}>Central de alertas</p>
              <p className={`mt-1 max-w-xl text-sm leading-relaxed ${textMuted}`}>
                Alertas da{" "}
                <strong className={textPrimary}>{company.nomePropriedade || "propriedade"}</strong>{" "}
                organizados por severidade — críticos, moderados e normais.
              </p>
            </div>
          </div>
          <p className={`text-sm font-semibold tabular-nums ${textFaint}`}>
            {alerts.length} alertas
          </p>
        </div>
      </div>

      <AlertsKanbanBoard alerts={alerts} />
    </div>
  );
}
