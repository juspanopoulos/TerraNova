import { AlertTriangle, Droplets, MapPin, Sprout } from "lucide-react";
import logoColorido from "@/assets/logos/logo-colorido.png";
import { DashboardCard } from "@/components/dashboard/ui";
import { cardInset, gridCols2, gridCols4, labelMuted, LOGO_SRC, textFaint, textMuted, textPrimary } from "@/constants/dashboard";
import { MOCK_DASHBOARD_DATA } from "@/data/mockDashboard";
import { useDashboard } from "@/context/DashboardContext";
import { formatTodayPt, getGreeting } from "@/lib/dashboard/loadDashboardData";

export function OverviewWelcomeCard() {
  const { company, climate, water } = useDashboard();
  const criticalAlerts = MOCK_DASHBOARD_DATA.alerts.filter((a) => a.level === "critical").length;
  const cropCount = MOCK_DASHBOARD_DATA.crops.length;
  const greeting = getGreeting();

  return (
    <DashboardCard className="dashboard-fade-up overflow-hidden p-0">
      <div className="db-hero-gradient relative border-b border-[var(--db-border-soft)] px-4 py-5 sm:px-6 sm:py-6 md:px-8 rounded-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className={`${labelMuted} mb-2`}>Painel geral</p>
            <h2 className={`text-xl font-bold tracking-tight sm:text-2xl md:text-3xl ${textPrimary}`}>
              {greeting}, {company.responsibleName.split(" ")[0]}!
            </h2>
            <p className={`mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm sm:text-base ${textMuted}`}>
              <span className="inline-flex items-center gap-1.5 font-semibold text-verde-floresta">
                <MapPin className="size-4 shrink-0" aria-hidden />
                {company.farmName}
              </span>
              <span className={`hidden sm:inline ${textFaint}`} aria-hidden>
                ·
              </span>
              <span>{company.farmRegion}</span>
            </p>
            <p className={`mt-1 text-xs capitalize sm:text-sm ${textFaint}`}>
              {formatTodayPt()}
            </p>
          </div>
          <img
            src={LOGO_SRC}
            alt="TerraNova"
            className="h-20 w-auto shrink-0 object-contain sm:h-24 md:h-28"
            onError={(e) => {
              (e.target as HTMLImageElement).src = logoColorido;
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 md:p-6 lg:grid-cols-2">
        <p className={`text-sm leading-relaxed lg:col-span-2 ${textMuted}`}>
          Acompanhe o desempenho da propriedade em tempo real. Hoje a temperatura está em{" "}
          <strong className={`font-semibold ${textPrimary}`}>
            {climate.temperature.toFixed(1)}°C
          </strong>
          , com eficiência hídrica de{" "}
          <strong className={`font-semibold ${textPrimary}`}>{water.efficiency}%</strong> e{" "}
          <strong className={`font-semibold ${textPrimary}`}>{criticalAlerts}</strong>{" "}
          {criticalAlerts === 1 ? "alerta crítico" : "alertas críticos"} ativos.
        </p>

        <div className={gridCols4}>
          <div className={cardInset}>
            <p className={labelMuted}>Área total</p>
            <p className={`mt-1 text-lg font-bold sm:text-xl ${textPrimary}`}>
              {company.totalAreaHa} ha
            </p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Setores ativos</p>
            <p className={`mt-1 text-lg font-bold sm:text-xl ${textPrimary}`}>
              {company.activeSectors}
            </p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Culturas</p>
            <p className={`mt-1 flex items-center gap-1.5 text-lg font-bold sm:text-xl ${textPrimary}`}>
              <Sprout className="size-4 text-verde-floresta" aria-hidden />
              {cropCount}
            </p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Alertas críticos</p>
            <p className={`mt-1 flex items-center gap-1.5 text-lg font-bold sm:text-xl ${textPrimary}`}>
              <AlertTriangle className="size-4 text-laranja-solar" aria-hidden />
              {criticalAlerts}
            </p>
          </div>
        </div>

        <div className={`${gridCols2} lg:col-span-2`}>
          <div className={cardInset}>
            <p className={labelMuted}>Consumo hídrico hoje</p>
            <p className={`mt-1 flex items-center gap-1.5 text-base font-bold sm:text-lg ${textPrimary}`}>
              <Droplets className="size-4 text-verde-floresta" aria-hidden />
              {water.consumptionLiters.toLocaleString("pt-BR")} L
            </p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Economia acumulada</p>
            <p className="mt-1 text-base font-bold text-verde-claro sm:text-lg">
              {water.savingsLiters.toLocaleString("pt-BR")} L
            </p>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
