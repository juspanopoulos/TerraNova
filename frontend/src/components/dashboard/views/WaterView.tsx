import { useState } from "react";
import { Droplets, Gauge, Waves } from "lucide-react";
import { ChartDetailPanel, WaterBarChart } from "@/components/dashboard/charts";
import { IrrigationPredictionCard } from "@/components/dashboard/IaPredictionCards";
import { DashboardCard, DataTable, MetricTile } from "@/components/dashboard/ui";
import {
  badgeStatus,
  gridCols3,
  labelMuted,
  rowHover,
  tdClass,
  textMuted,
  thClass,
} from "@/constants/dashboard";
import { useDashboard } from "@/context/DashboardContext";
import { filterLabel } from "@/lib/dashboard/helpers";
import { isIrrigationCropSupported } from "@/lib/dashboard/irrigationModel";

function formatOptionalNumber(value: number | null, unit: string) {
  if (value === null) return "Não informado";
  return `${value.toLocaleString("pt-BR")} ${unit}`;
}

export function WaterView() {
  const {
    water,
    pageTimeFilter,
    crops,
    selectedCrop,
    predictions,
    company,
    soil,
    reloadDashboard,
  } = useDashboard();
  const history = water.history[pageTimeFilter];
  const [barIndex, setBarIndex] = useState<number | null>(null);
  const activeCrop = crops.find((crop) => crop.id === selectedCrop) ?? crops[0] ?? null;
  const activeIrrigation =
    water.irrigation.find((row) => row.idArea === activeCrop?.idArea) ??
    water.irrigation[0] ??
    null;
  const activeSoilSector =
    soil.sectors.find((row) => row.idArea === activeCrop?.idArea) ??
    soil.sectors.find((row) => row.idArea === activeIrrigation?.idArea) ??
    null;
  const predictionCrop =
    activeCrop && isIrrigationCropSupported(activeCrop.name) ? activeCrop : null;
  const irrigationPredictions = predictions.filter(
    (prediction) => prediction.modelType === "IRRIGACAO",
  );
  const predictionAreaId = predictionCrop?.idArea ?? null;
  const latestIrrigationPrediction =
    predictionAreaId === null
      ? null
      : irrigationPredictions.find((prediction) => prediction.idArea === predictionAreaId) ?? null;

  return (
    <div className="space-y-4 sm:space-y-6">
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
          icon={Waves}
        />
        <MetricTile label="Origem" value={water.current.origin} icon={Gauge} />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(22rem,1fr)]">
        <DashboardCard>
          <p className={`${labelMuted} mb-4`}>Histórico - {filterLabel(pageTimeFilter)}</p>
          <WaterBarChart
            values={history.values}
            labels={history.labels}
            unit="mm"
            selectedIndex={barIndex}
            onSelect={setBarIndex}
          />
          {barIndex !== null && (
            <ChartDetailPanel
              title={`${history.labels[barIndex]} - consumo`}
              detail={`${history.values[barIndex].toLocaleString("pt-BR")} mm no período ${filterLabel(pageTimeFilter).toLowerCase()}.`}
            />
          )}
        </DashboardCard>
        <IrrigationPredictionCard
          key={`irrig-${activeCrop?.id ?? "none"}-${activeIrrigation?.id ?? "none"}`}
          crop={predictionCrop}
          selectedCropName={activeCrop?.name ?? null}
          company={company}
          soil={soil}
          soilSector={activeSoilSector}
          irrigation={activeIrrigation}
          latestPrediction={latestIrrigationPrediction}
          onPredicted={reloadDashboard}
        />
      </div>

      <DashboardCard>
        <p className={`${labelMuted} mb-4`}>Histórico de predições de irrigação</p>
        <DataTable caption="Predições de irrigação">
          <thead>
            <tr>
              <th className={thClass}>Data</th>
              <th className={thClass}>Área</th>
              <th className={thClass}>Cultura</th>
              <th className={thClass}>Água recomendada</th>
              <th className={thClass}>Situação</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>
          <tbody>
            {irrigationPredictions.length === 0 ? (
              <tr>
                <td className={tdClass} colSpan={6}>
                  Nenhuma predição de irrigação encontrada.
                </td>
              </tr>
            ) : (
              irrigationPredictions.map((prediction) => (
                <tr key={prediction.id} className={rowHover}>
                  <td className={tdClass}>{prediction.date || "Não informada"}</td>
                  <td className={`${tdClass} ${textMuted}`}>{prediction.sector}</td>
                  <td className={tdClass}>{prediction.cropName ?? "Não informada"}</td>
                  <td className={`${tdClass} tabular-nums`}>
                    {formatOptionalNumber(prediction.waterVolumeMm, "mm")}
                  </td>
                  <td className={tdClass}>{prediction.situation}</td>
                  <td className={tdClass}>
                    <span className={badgeStatus}>{prediction.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </DataTable>
      </DashboardCard>

      <DashboardCard>
        <p className={`${labelMuted} mb-4`}>Irrigação por setor</p>
        <DataTable caption="Irrigação">
          <thead>
            <tr>
              <th className={thClass}>Setor</th>
              <th className={thClass}>Tipo</th>
              <th className={thClass}>Consumo atual</th>
              <th className={thClass}>Irrigação anterior</th>
              <th className={thClass}>Cobertura</th>
              <th className={thClass}>Origem</th>
            </tr>
          </thead>
          <tbody>
            {water.irrigation.length === 0 ? (
              <tr>
                <td className={tdClass} colSpan={6}>
                  Nenhuma irrigação registrada.
                </td>
              </tr>
            ) : (
              water.irrigation.map((row) => (
                <tr key={row.id} className={rowHover}>
                  <td className={`${tdClass} font-medium`}>{row.sector}</td>
                  <td className={tdClass}>{row.type}</td>
                  <td className={`${tdClass} tabular-nums`}>
                    {row.currentMm.toLocaleString("pt-BR")} mm
                  </td>
                  <td className={`${tdClass} tabular-nums ${textMuted}`}>
                    {row.previousMm.toLocaleString("pt-BR")} mm
                  </td>
                  <td className={tdClass}>{row.coverage}</td>
                  <td className={tdClass}>{row.origin}</td>
                </tr>
              ))
            )}
          </tbody>
        </DataTable>
      </DashboardCard>
    </div>
  );
}
