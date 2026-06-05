import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Cloud,
  Droplets,
  Leaf,
  Sprout,
  Thermometer,
  TrendingUp,
} from "lucide-react";
import { AlertsKanbanBoard } from "@/components/dashboard/AlertsKanbanBoard";
import {
  ClimateAreaChart,
  DonutChart,
  MaturityHorizontalChart,
  WaterBarChart,
} from "@/components/dashboard/charts";
import { DashboardCard, DataTable, MetricTile } from "@/components/dashboard/ui";
import {
  btnClick,
  cardBase,
  cardInset,
  gridCols2,
  gridCols3,
  gridCols4,
  gridSplit2,
  labelMuted,
  rowHover,
  sectionTitle,
  tdClass,
  textMuted,
  textPrimary,
  thClass,
} from "@/constants/dashboard";
import { useDashboard } from "@/context/DashboardContext";
import { climateMetricColor } from "@/lib/dashboard/chartTheme";
import { filterLabel } from "@/lib/dashboard/helpers";
import {
  getVisionAlerts,
  getVisionClimateSnapshot,
  getVisionCrops,
  getVisionIrrigationRows,
  getVisionSoilSnapshot,
  getVisionSummaryKpis,
  getVisionWaterDistribution,
  getVisionWaterHistory,
} from "@/lib/dashboard/visionDetail";
import type { ChartSegment, TimeFilter } from "@/types/dashboard";

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Cloud;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-verde-floresta/10 text-verde-floresta">
        <Icon className="size-5" aria-hidden />
      </span>
      <div>
        <h2 className={sectionTitle}>{title}</h2>
        <p className={`mt-1 text-sm ${textMuted}`}>{description}</p>
      </div>
    </div>
  );
}

export function VisionDetailView({ timeFilter }: { timeFilter: TimeFilter }) {
  const { preferences } = useDashboard();
  const periodLabel = filterLabel(timeFilter);

  const kpis = useMemo(() => getVisionSummaryKpis(timeFilter), [timeFilter]);
  const climate = useMemo(() => getVisionClimateSnapshot(timeFilter), [timeFilter]);
  const waterMetrics = useMemo(() => kpis.water, [kpis]);
  const waterHistory = useMemo(() => getVisionWaterHistory(timeFilter), [timeFilter]);
  const waterSegments = useMemo(
    () => getVisionWaterDistribution(timeFilter) as ChartSegment[],
    [timeFilter],
  );
  const soil = useMemo(() => getVisionSoilSnapshot(timeFilter), [timeFilter]);
  const crops = useMemo(() => getVisionCrops(timeFilter), [timeFilter]);
  const alerts = useMemo(() => getVisionAlerts(timeFilter), [timeFilter]);
  const irrigationRows = useMemo(() => getVisionIrrigationRows(timeFilter), [timeFilter]);
  const nutrientSegments = useMemo(
    () => soil.nutrients.map((n) => ({ ...n })) as ChartSegment[],
    [soil.nutrients],
  );

  const [climateMetric, setClimateMetric] = useState<"temperature" | "humidity" | "wind">(
    "temperature",
  );
  const [selectedWater, setSelectedWater] = useState<string | null>(null);
  const [selectedNutrient, setSelectedNutrient] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [barIndex, setBarIndex] = useState<number | null>(null);

  const climateCharts = useMemo(
    () => [
      {
        key: "temperature" as const,
        label: "Temperatura",
        data: climate.history.temperature,
        unit: "°C",
        color: climateMetricColor("temperature", preferences.darkMode),
      },
      {
        key: "humidity" as const,
        label: "Umidade",
        data: climate.history.humidity,
        unit: "%",
        color: climateMetricColor("humidity", preferences.darkMode),
      },
      {
        key: "wind" as const,
        label: "Vento",
        data: climate.history.wind,
        unit: " km/h",
        color: climateMetricColor("wind", preferences.darkMode),
      },
    ],
    [climate.history, preferences.darkMode],
  );

  const activeClimate = climateCharts.find((m) => m.key === climateMetric) ?? climateCharts[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      <DashboardCard>
        <p className={labelMuted}>Resumo — {periodLabel}</p>
        <p className={`mt-2 text-sm leading-relaxed ${textMuted}`}>
          Indicadores consolidados da fazenda no período{" "}
          <strong className={textPrimary}>{periodLabel.toLowerCase()}</strong>, com os mesmos
          dados das demais áreas do dashboard filtrados para esta visão.
        </p>
        <div className={`${gridCols4} mt-5`}>
          <MetricTile
            label="Temperatura"
            value={climate.temperature.toFixed(1)}
            unit="°C"
            icon={Thermometer}
          />
          <MetricTile
            label="Umidade do solo"
            value={Math.round(soil.moisture).toString()}
            unit="%"
            icon={Leaf}
          />
          <MetricTile
            label="Maturidade média"
            value={kpis.avgMaturity.toFixed(0)}
            unit="%"
            icon={Sprout}
          />
          <MetricTile label="Alertas críticos" value={String(kpis.criticalCount)} icon={AlertTriangle} />
        </div>
      </DashboardCard>

      <section className="space-y-4">
        <SectionHeading
          icon={Cloud}
          title="Controle climático"
          description={`Histórico e leituras do período ${periodLabel.toLowerCase()}.`}
        />
        <div className={gridCols3}>
          {climateCharts.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setClimateMetric(m.key)}
              className={[
                btnClick,
                cardBase,
                "text-left",
                climateMetric === m.key && "ring-2 ring-verde-floresta/25",
              ].join(" ")}
            >
              <p className={labelMuted}>{m.label}</p>
              <p className={`mt-2 text-2xl font-bold tabular-nums ${textPrimary}`}>
                {m.key === "temperature"
                  ? `${climate.temperature.toFixed(1)}°C`
                  : m.key === "humidity"
                    ? `${Math.round(climate.humidity)}%`
                    : `${climate.wind.toFixed(1)} km/h`}
              </p>
            </button>
          ))}
        </div>
        <DashboardCard>
          <ClimateAreaChart
            label={`Histórico de ${activeClimate.label} — ${periodLabel}`}
            values={activeClimate.data}
            labels={climate.history.labels}
            unit={activeClimate.unit}
            color={activeClimate.color}
          />
        </DashboardCard>
      </section>

      <section className="space-y-4">
        <SectionHeading
          icon={Droplets}
          title="Consumo hídrico"
          description={`Consumo, eficiência e distribuição no período ${periodLabel.toLowerCase()}.`}
        />
        <div className={gridCols3}>
          <MetricTile
            label="Consumo"
            value={waterMetrics.consumptionLiters.toLocaleString("pt-BR")}
            unit="L"
            icon={Droplets}
          />
          <MetricTile
            label="Economia"
            value={`${(waterMetrics.savingsLiters / 1000).toFixed(0)} mil`}
            unit="L"
            icon={TrendingUp}
          />
          <MetricTile label="Eficiência" value={String(waterMetrics.efficiency)} unit="%" icon={Droplets} />
        </div>
        <div className={gridSplit2}>
          <DashboardCard>
            <p className={`${labelMuted} mb-4`}>Distribuição do consumo</p>
            <DonutChart
              segments={waterSegments}
              centerValue={`${waterMetrics.efficiency}%`}
              centerLabel="Eficiência"
              selectedId={selectedWater}
              onSelect={setSelectedWater}
              legendLayout="horizontal"
            />
          </DashboardCard>
          <DashboardCard>
            <p className={`${labelMuted} mb-4`}>Histórico — {periodLabel}</p>
            <WaterBarChart
              values={waterHistory.values}
              labels={waterHistory.labels}
              selectedIndex={barIndex}
              onSelect={setBarIndex}
            />
          </DashboardCard>
        </div>
        <DashboardCard>
          <p className={`${labelMuted} mb-4`}>Irrigação por setor — {periodLabel}</p>
          <DataTable caption="Irrigação por setor">
            <thead>
              <tr>
                <th className={thClass}>Setor</th>
                <th className={thClass}>Consumo</th>
                <th className={thClass}>Meta</th>
                <th className={thClass}>Eficiência</th>
              </tr>
            </thead>
            <tbody>
              {irrigationRows.map((row) => (
                <tr key={row.sector} className={rowHover}>
                  <td className={`${tdClass} font-medium`}>{row.sector}</td>
                  <td className={`${tdClass} tabular-nums`}>{row.used.toLocaleString("pt-BR")} L</td>
                  <td className={`${tdClass} tabular-nums ${textMuted}`}>
                    {row.target.toLocaleString("pt-BR")} L
                  </td>
                  <td className={`${tdClass} font-bold tabular-nums`}>{row.efficiency}%</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </DashboardCard>
      </section>

      <section className="space-y-4">
        <SectionHeading
          icon={Leaf}
          title="Controle do solo"
          description={`NPK e umidade por setor referentes ao período ${periodLabel.toLowerCase()}.`}
        />
        <div className={gridSplit2}>
          <DashboardCard>
            <p className={`${labelMuted} mb-4`}>Composição NPK</p>
            <DonutChart
              segments={nutrientSegments}
              centerValue={soil.ph.toFixed(1)}
              centerLabel="pH médio"
              selectedId={selectedNutrient}
              onSelect={setSelectedNutrient}
            />
          </DashboardCard>
          <DashboardCard>
            <p className={`${labelMuted} mb-4`}>Indicadores</p>
            <div className={gridCols2}>
              {[
                { l: "N", v: `${soil.nitrogen}%` },
                { l: "P", v: `${soil.phosphorus}%` },
                { l: "K", v: `${soil.potassium}%` },
                { l: "Umidade", v: `${Math.round(soil.moisture)}%` },
              ].map((item) => (
                <div key={item.l} className={cardInset}>
                  <p className={labelMuted}>{item.l}</p>
                  <p className="mt-1 text-2xl font-bold text-verde-floresta">{item.v}</p>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
        <DashboardCard>
          <p className={`${labelMuted} mb-4`}>Umidade por setor</p>
          <DataTable caption="Umidade por setor">
            <thead>
              <tr>
                <th className={thClass}>Setor</th>
                <th className={thClass}>Umidade</th>
                <th className={thClass}>pH</th>
                <th className={thClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {soil.sectors.map((row) => (
                <tr key={row.sector} className={rowHover}>
                  <td className={`${tdClass} font-medium`}>{row.sector}</td>
                  <td className={tdClass}>
                    <div className="flex items-center gap-2">
                      <div className="h-2 max-w-28 flex-1 overflow-hidden rounded-full bg-[var(--db-chart-track)]">
                        <div
                          className="h-full rounded-full bg-verde-floresta"
                          style={{ width: `${row.moisture}%` }}
                        />
                      </div>
                      <span className="font-bold tabular-nums">{row.moisture}%</span>
                    </div>
                  </td>
                  <td className={tdClass}>{row.ph}</td>
                  <td className={`${tdClass} ${textMuted}`}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </DashboardCard>
      </section>

      <section className="space-y-4">
        <SectionHeading
          icon={Sprout}
          title="Previsão de colheitas"
          description={`Maturidade e cronograma no contexto ${periodLabel.toLowerCase()}.`}
        />
        <DashboardCard>
          <MaturityHorizontalChart
            crops={crops}
            selectedId={selectedCrop}
            onSelect={setSelectedCrop}
          />
        </DashboardCard>
        <DashboardCard>
          <p className={`${labelMuted} mb-4`}>Cronograma — {periodLabel}</p>
          <DataTable caption="Colheitas">
            <thead>
              <tr>
                <th className={thClass}>Cultura</th>
                <th className={thClass}>Zona</th>
                <th className={thClass}>Maturidade</th>
                <th className={thClass}>Referência</th>
                <th className={thClass}>Colheita prevista</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((c) => (
                <tr key={c.id} className={rowHover}>
                  <td className={`${tdClass} font-medium`}>{c.name}</td>
                  <td className={`${tdClass} ${textMuted}`}>{c.zone}</td>
                  <td className={tdClass}>
                    <span className="font-bold text-verde-floresta">{c.maturity}%</span>
                  </td>
                  <td className={tdClass}>{c.week}</td>
                  <td className={tdClass}>{c.estimate}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </DashboardCard>
      </section>

      <section className="space-y-4">
        <SectionHeading
          icon={Bell}
          title="Alertas"
          description={`${alerts.length} alertas relevantes para o período ${periodLabel.toLowerCase()}.`}
        />
        <AlertsKanbanBoard alerts={alerts} />
      </section>
    </div>
  );
}
