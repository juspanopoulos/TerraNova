import { useMemo, useState } from "react";
import { Droplets, Thermometer, Wind } from "lucide-react";
import { ClimateAreaChart } from "@/components/dashboard/charts";
import { DashboardCard } from "@/components/dashboard/ui";
import { btnClick, cardBase, gridCols3, labelMuted, textPrimary } from "@/constants/dashboard";
import { useDashboard } from "@/context/DashboardContext";
import { climateMetricColor } from "@/lib/dashboard/chartTheme";

export function ClimateView() {
  const { climate, climateHistory, preferences, pageTimeFilter } = useDashboard();
  const history = climateHistory[pageTimeFilter];
  const [metric, setMetric] = useState<"temperature" | "humidity" | "wind">("temperature");

  const metrics = useMemo(
    () => [
      {
        key: "temperature" as const,
        label: "Temperatura",
        value: `${climate.temperature.toFixed(1)}°C`,
        icon: Thermometer,
        data: history.temperature,
        unit: "°C",
        color: climateMetricColor("temperature", preferences.darkMode),
      },
      {
        key: "humidity" as const,
        label: "Umidade",
        value: `${Math.round(climate.humidity)}%`,
        icon: Droplets,
        data: history.humidity,
        unit: "%",
        color: climateMetricColor("humidity", preferences.darkMode),
      },
      {
        key: "wind" as const,
        label: "Vento",
        value: `${climate.wind.toFixed(1)} km/h`,
        icon: Wind,
        data: history.wind,
        unit: " km/h",
        color: climateMetricColor("wind", preferences.darkMode),
      },
    ],
    [climate, history, preferences.darkMode],
  );

  const active = metrics.find((m) => m.key === metric) ?? metrics[0];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className={gridCols3}>
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setMetric(m.key)}
              className={[
                btnClick,
                cardBase,
                "text-left",
                metric === m.key && "ring-2 ring-verde-floresta/25",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <p className={labelMuted}>{m.label}</p>
                <Icon className="size-4 text-verde-floresta/50" />
              </div>
              <p className={`mt-2 text-2xl font-bold tabular-nums ${textPrimary}`}>{m.value}</p>
            </button>
          );
        })}
      </div>
      <DashboardCard>
        <ClimateAreaChart
          label={`Histórico de ${active.label}`}
          values={active.data}
          labels={history.labels}
          unit={active.unit}
          color={active.color}
        />
      </DashboardCard>
    </div>
  );
}
