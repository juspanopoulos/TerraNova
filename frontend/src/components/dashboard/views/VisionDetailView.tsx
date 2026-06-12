import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Cloud,
  Droplets,
  Gauge,
  Leaf,
  Sprout,
  Thermometer,
} from "lucide-react";
import { AlertsKanbanBoard } from "@/components/dashboard/AlertsKanbanBoard";
import {
  ClimateAreaChart,
  CropHorizontalChart,
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
import type { TimeFilter } from "@/types/dashboard";

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

function formatOptionalNumber(value: number | null, unit: string) {
  if (value === null) return "Não informado";
  return `${value.toLocaleString("pt-BR")} ${unit}`;
}

export function VisionDetailView({ timeFilter }: { timeFilter: TimeFilter }) {
  const {
    preferences,
    climate,
    climateHistory,
    soil,
    water,
    crops,
    predictions,
    alerts,
  } = useDashboard();
  const periodLabel = filterLabel(timeFilter);
  const climateSeries = climateHistory[timeFilter];
  const waterHistory = water.history[timeFilter];
  const criticalCount = alerts.filter((alert) => alert.level === "critical").length;

  const [climateMetric, setClimateMetric] = useState<"temperature" | "humidity" | "wind">(
    "temperature",
  );
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [barIndex, setBarIndex] = useState<number | null>(null);

  const climateCharts = useMemo(
    () => [
      {
        key: "temperature" as const,
        label: "Temperatura",
        data: climateSeries.temperature,
        unit: "C",
        color: climateMetricColor("temperature", preferences.darkMode),
      },
      {
        key: "humidity" as const,
        label: "Umidade",
        data: climateSeries.humidity,
        unit: "%",
        color: climateMetricColor("humidity", preferences.darkMode),
      },
      {
        key: "wind" as const,
        label: "Vento",
        data: climateSeries.wind,
        unit: " km/h",
        color: climateMetricColor("wind", preferences.darkMode),
      },
    ],
    [climateSeries, preferences.darkMode],
  );

  const activeClimate = climateCharts.find((m) => m.key === climateMetric) ?? climateCharts[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      <DashboardCard>
        <p className={labelMuted}>Resumo - {periodLabel}</p>
        <p className={`mt-2 text-sm leading-relaxed ${textMuted}`}>
          Indicadores consolidados da fazenda no período{" "}
          <strong className={textPrimary}>{periodLabel.toLowerCase()}</strong>, usando os
          dados reais carregados da plataforma.
        </p>
        <div className={`${gridCols4} mt-5`}>
          <MetricTile
            label="Temperatura"
            value={climate.temperature.toFixed(1)}
            unit="C"
            icon={Thermometer}
          />
          <MetricTile
            label="Umidade do solo"
            value={Math.round(soil.current.moisture).toString()}
            unit="%"
            icon={Leaf}
          />
          <MetricTile
            label="Plantios ativos"
            value={String(crops.length)}
            icon={Sprout}
          />
          <MetricTile label="Alertas críticos" value={String(criticalCount)} icon={AlertTriangle} />
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
                  ? `${climate.temperature.toFixed(1)} C`
                  : m.key === "humidity"
                    ? `${Math.round(climate.humidity)}%`
                    : `${climate.wind.toFixed(1)} km/h`}
              </p>
            </button>
          ))}
        </div>
        <DashboardCard>
          <ClimateAreaChart
            label={`Histórico de ${activeClimate.label} - ${periodLabel}`}
            values={activeClimate.data}
            labels={climateSeries.labels}
            unit={activeClimate.unit}
            color={activeClimate.color}
          />
        </DashboardCard>
      </section>

      <section className="space-y-4">
        <SectionHeading
          icon={Droplets}
          title="Consumo hídrico"
          description={`Consumo e irrigação em mm no período ${periodLabel.toLowerCase()}.`}
        />
        <div className={gridCols3}>
          <MetricTile
            label="Consumo atual"
            value={water.current.consumptionMm.toLocaleString("pt-BR")}
            unit="mm"
            icon={Droplets}
          />
          <MetricTile
            label="Irrigação anterior"
            value={water.current.previousMm.toLocaleString("pt-BR")}
            unit="mm"
            icon={Droplets}
          />
          <MetricTile label="Origem" value={water.current.origin} icon={Gauge} />
        </div>
        <DashboardCard>
          <p className={`${labelMuted} mb-4`}>Histórico - {periodLabel}</p>
          <WaterBarChart
            values={waterHistory.values}
            labels={waterHistory.labels}
            unit="mm"
            selectedIndex={barIndex}
            onSelect={setBarIndex}
          />
        </DashboardCard>
        <DashboardCard>
          <p className={`${labelMuted} mb-4`}>Irrigação por setor - {periodLabel}</p>
          <DataTable caption="Irrigação por setor">
            <thead>
              <tr>
                <th className={thClass}>Setor</th>
                <th className={thClass}>Tipo</th>
                <th className={thClass}>Consumo atual</th>
                <th className={thClass}>Irrigação anterior</th>
                <th className={thClass}>Origem</th>
              </tr>
            </thead>
            <tbody>
              {water.irrigation.length === 0 ? (
                <tr>
                  <td className={tdClass} colSpan={5}>
                    Nenhuma irrigação registrada.
                  </td>
                </tr>
              ) : (
                water.irrigation.map((row) => (
                  <tr key={row.id} className={rowHover}>
                    <td className={`${tdClass} font-medium`}>{row.sector}</td>
                    <td className={tdClass}>{row.type}</td>
                    <td className={`${tdClass} tabular-nums`}>{row.currentMm.toLocaleString("pt-BR")} mm</td>
                    <td className={`${tdClass} tabular-nums ${textMuted}`}>
                      {row.previousMm.toLocaleString("pt-BR")} mm
                    </td>
                    <td className={tdClass}>{row.origin}</td>
                  </tr>
                ))
              )}
            </tbody>
          </DataTable>
        </DashboardCard>
      </section>

      <section className="space-y-4">
        <SectionHeading
          icon={Leaf}
          title="Controle do solo"
          description={`Umidade, tipo de solo e fonte referentes ao período ${periodLabel.toLowerCase()}.`}
        />
        <div className={gridSplit2}>
          <DashboardCard>
            <p className={`${labelMuted} mb-4`}>Leitura atual</p>
            <div className="flex items-center gap-3">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--db-chart-track)]">
                <div
                  className="h-full rounded-full bg-verde-floresta"
                  style={{ width: `${Math.min(Math.max(soil.current.moisture, 0), 100)}%` }}
                />
              </div>
              <span className="text-2xl font-bold tabular-nums text-verde-floresta">
                {Math.round(soil.current.moisture)}%
              </span>
            </div>
          </DashboardCard>
          <DashboardCard>
            <p className={`${labelMuted} mb-4`}>Detalhes da leitura atual</p>
            <div className={gridCols2}>
              {[
                { l: "Umidade atual", v: `${Math.round(soil.current.moisture)}%` },
                { l: "Tipo de solo", v: soil.current.soilType },
                { l: "Fonte da leitura", v: soil.current.source },
                { l: "Data da coleta", v: soil.current.collectedAt || "Não informada" },
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
                <th className={thClass}>Tipo de solo</th>
                <th className={thClass}>Fonte</th>
              </tr>
            </thead>
            <tbody>
              {soil.sectors.length === 0 ? (
                <tr>
                  <td className={tdClass} colSpan={4}>
                    Nenhuma leitura de solo encontrada.
                  </td>
                </tr>
              ) : (
                soil.sectors.map((row) => (
                  <tr key={row.id} className={rowHover}>
                    <td className={`${tdClass} font-medium`}>{row.sector}</td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-2">
                        <div className="h-2 max-w-28 flex-1 overflow-hidden rounded-full bg-[var(--db-chart-track)]">
                          <div
                            className="h-full rounded-full bg-verde-floresta"
                            style={{ width: `${Math.min(Math.max(row.moisture, 0), 100)}%` }}
                          />
                        </div>
                        <span className="font-bold tabular-nums">{Math.round(row.moisture)}%</span>
                      </div>
                    </td>
                    <td className={tdClass}>{row.soilType}</td>
                    <td className={tdClass}>{row.source}</td>
                  </tr>
                ))
              )}
            </tbody>
          </DataTable>
        </DashboardCard>
      </section>

      <section className="space-y-4">
        <SectionHeading
          icon={Sprout}
          title="Previsão de colheitas"
          description={`Plantios ativos e cronograma no contexto ${periodLabel.toLowerCase()}.`}
        />
        <DashboardCard>
          <CropHorizontalChart
            crops={crops}
            selectedId={selectedCrop}
            onSelect={setSelectedCrop}
          />
        </DashboardCard>
        <DashboardCard>
          <p className={`${labelMuted} mb-4`}>Cronograma - {periodLabel}</p>
          <DataTable caption="Colheitas">
            <thead>
              <tr>
                <th className={thClass}>Cultura</th>
                <th className={thClass}>Zona</th>
                <th className={thClass}>Estágio</th>
                <th className={thClass}>Plantio</th>
                <th className={thClass}>Colheita prevista</th>
                <th className={thClass}>Necessidade hídrica</th>
                <th className={thClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {crops.length === 0 ? (
                <tr>
                  <td className={tdClass} colSpan={7}>
                    Nenhum plantio ativo encontrado.
                  </td>
                </tr>
              ) : (
                crops.map((crop) => (
                  <tr key={crop.id} className={rowHover}>
                    <td className={`${tdClass} font-medium`}>{crop.name}</td>
                    <td className={`${tdClass} ${textMuted}`}>{crop.zone}</td>
                    <td className={tdClass}>{crop.stage}</td>
                    <td className={tdClass}>{crop.plantedAt || "Não informado"}</td>
                    <td className={tdClass}>{crop.harvestAt || "Não informada"}</td>
                    <td className={`${tdClass} tabular-nums`}>
                      {formatOptionalNumber(crop.waterNeedMm, "mm")}
                    </td>
                    <td className={tdClass}>{crop.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </DataTable>
        </DashboardCard>
      </section>

      <section className="space-y-4">
        <SectionHeading
          icon={Gauge}
          title="Predições IA"
          description={`Produtividade prevista, classificação, água sugerida e situação.`}
        />
        <DashboardCard>
          <DataTable caption="Predições IA">
            <thead>
              <tr>
                <th className={thClass}>Data</th>
                <th className={thClass}>Área</th>
                <th className={thClass}>Cultura</th>
                <th className={thClass}>Modelo</th>
                <th className={thClass}>Produtividade</th>
                <th className={thClass}>Classificação</th>
                <th className={thClass}>Água sugerida</th>
                <th className={thClass}>Situação</th>
              </tr>
            </thead>
            <tbody>
              {predictions.length === 0 ? (
                <tr>
                  <td className={tdClass} colSpan={8}>
                    Nenhuma predição de IA encontrada.
                  </td>
                </tr>
              ) : (
                predictions.map((prediction) => (
                  <tr key={prediction.id} className={rowHover}>
                    <td className={tdClass}>{prediction.date || "Não informada"}</td>
                    <td className={`${tdClass} ${textMuted}`}>{prediction.sector}</td>
                    <td className={tdClass}>{prediction.cropName ?? "Não informada"}</td>
                    <td className={tdClass}>{prediction.type}</td>
                    <td className={`${tdClass} tabular-nums`}>
                      {formatOptionalNumber(prediction.productivity, "t/ha")}
                    </td>
                    <td className={tdClass}>{prediction.classification}</td>
                    <td className={`${tdClass} tabular-nums`}>
                      {formatOptionalNumber(prediction.waterVolumeMm, "mm")}
                    </td>
                    <td className={tdClass}>{prediction.situation}</td>
                  </tr>
                ))
              )}
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
