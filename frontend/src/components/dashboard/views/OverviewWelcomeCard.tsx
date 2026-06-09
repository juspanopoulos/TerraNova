import {
  AlertTriangle,
  Bell,
  CloudRain,
  Droplets,
  Gauge,
  Leaf,
  MapPin,
  Sprout,
  Thermometer,
  Wind,
} from "lucide-react";
import logoColorido from "@/assets/logos/logo-colorido.png";
import { DashboardCard } from "@/components/dashboard/ui";
import { cardInset, gridCols4, labelMuted, LOGO_SRC, textFaint, textMuted, textPrimary } from "@/constants/dashboard";
import { useDashboard } from "@/context/DashboardContext";
import { formatTodayPt, getGreeting } from "@/lib/dashboard/loadDashboardData";

export function OverviewWelcomeCard() {
  const { company, dashboardSummary, dashboardAreas, alerts, climate, water, soil } = useDashboard();
  const criticalAlerts = alerts.filter((a) => a.level === "critical").length;
  const warningAlerts = alerts.filter((a) => a.level === "warning").length;
  const totalAreaHa = Math.round(
    dashboardAreas.reduce((sum, area) => sum + Number(area.areaHectares ?? 0), 0),
  );
  const cropCount = dashboardSummary?.indicadores.totalCulturas ?? 0;
  const activeSectors = dashboardSummary?.indicadores.totalAreas ?? company.activeSectors;
  const activePlantings = dashboardSummary?.indicadores.totalPlantiosAtivos ?? 0;
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

        <div className={`${gridCols4} lg:col-span-2`}>
          <div className={cardInset}>
            <p className={labelMuted}>Área total</p>
            <p className={`mt-1 text-lg font-bold sm:text-xl ${textPrimary}`}>
              {totalAreaHa > 0 ? totalAreaHa : company.totalAreaHa} ha
            </p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Setores ativos</p>
            <p className={`mt-1 text-lg font-bold sm:text-xl ${textPrimary}`}>{activeSectors}</p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Culturas</p>
            <p className={`mt-1 flex items-center gap-1.5 text-lg font-bold sm:text-xl ${textPrimary}`}>
              <Sprout className="size-4 text-verde-floresta" aria-hidden />
              {cropCount}
            </p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Plantios ativos</p>
            <p className={`mt-1 flex items-center gap-1.5 text-lg font-bold sm:text-xl ${textPrimary}`}>
              <Gauge className="size-4 text-verde-floresta" aria-hidden />
              {activePlantings}
            </p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Temperatura</p>
            <p className={`mt-1 flex items-center gap-1.5 text-lg font-bold sm:text-xl ${textPrimary}`}>
              <Thermometer className="size-4 text-laranja-solar" aria-hidden />
              {climate.temperature.toFixed(1)}°C
            </p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Umidade do ar</p>
            <p className={`mt-1 flex items-center gap-1.5 text-lg font-bold sm:text-xl ${textPrimary}`}>
              <CloudRain className="size-4 text-verde-floresta" aria-hidden />
              {Math.round(climate.humidity)}%
            </p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Umidade do solo</p>
            <p className={`mt-1 flex items-center gap-1.5 text-lg font-bold sm:text-xl ${textPrimary}`}>
              <Leaf className="size-4 text-verde-floresta" aria-hidden />
              {Math.round(soil.moisture)}%
            </p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Vento</p>
            <p className={`mt-1 flex items-center gap-1.5 text-lg font-bold sm:text-xl ${textPrimary}`}>
              <Wind className="size-4 text-verde-claro" aria-hidden />
              {climate.wind.toFixed(1)} km/h
            </p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Consumo hídrico hoje</p>
            <p className={`mt-1 flex items-center gap-1.5 text-lg font-bold sm:text-xl ${textPrimary}`}>
              <Droplets className="size-4 text-verde-floresta" aria-hidden />
              {water.consumptionLiters.toLocaleString("pt-BR")} L
            </p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Eficiência hídrica</p>
            <p className={`mt-1 flex items-center gap-1.5 text-lg font-bold sm:text-xl ${textPrimary}`}>
              <Droplets className="size-4 text-verde-claro" aria-hidden />
              {water.efficiency}%
            </p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Economia acumulada</p>
            <p className="mt-1 text-lg font-bold text-verde-claro sm:text-xl">
              {water.savingsLiters.toLocaleString("pt-BR")} L
            </p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Alertas críticos</p>
            <p className={`mt-1 flex items-center gap-1.5 text-lg font-bold sm:text-xl ${textPrimary}`}>
              <AlertTriangle className="size-4 text-laranja-solar" aria-hidden />
              {criticalAlerts}
            </p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Alertas moderados</p>
            <p className={`mt-1 flex items-center gap-1.5 text-lg font-bold sm:text-xl ${textPrimary}`}>
              <Bell className="size-4 text-amber-500" aria-hidden />
              {warningAlerts}
            </p>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
