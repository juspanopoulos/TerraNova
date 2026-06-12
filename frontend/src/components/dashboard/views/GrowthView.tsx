import { CropHorizontalChart } from "@/components/dashboard/charts";
import { ProductivityPredictionCard } from "@/components/dashboard/IaPredictionCards";
import { DashboardCard, DataTable } from "@/components/dashboard/ui";
import {
  badgeStatus,
  labelMuted,
  rowHover,
  tdClass,
  textMuted,
  thClass,
} from "@/constants/dashboard";
import { useDashboard } from "@/context/DashboardContext";

function formatOptionalNumber(value: number | null, unit: string) {
  if (value === null) return "Não informado";
  return `${value.toLocaleString("pt-BR")} ${unit}`;
}

export function GrowthView() {
  const {
    crops: dashboardCrops,
    predictions,
    selectedCrop,
    setSelectedCrop,
    appliedFilters,
    dashboardSummary,
    selectedArea,
    climate,
    water,
    company,
    reloadDashboard,
  } = useDashboard();
  const crops = dashboardCrops.filter(
    (crop) => appliedFilters.growthCrop === "all" || crop.id === appliedFilters.growthCrop,
  );
  const activeCrop = crops.find((crop) => crop.id === selectedCrop) ?? crops[0] ?? null;
  const activeAreaSummary =
    dashboardSummary?.areas.find((area) => area.idArea === activeCrop?.idArea) ??
    (selectedArea?.idArea === activeCrop?.idArea ? selectedArea : null);
  const activeIrrigation = water.irrigation.find((row) => row.idArea === activeCrop?.idArea) ?? null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(22rem,1fr)]">
        <DashboardCard>
          <CropHorizontalChart crops={crops} selectedId={selectedCrop} onSelect={setSelectedCrop} />
        </DashboardCard>
        <ProductivityPredictionCard
          key={`prod-${activeCrop?.id ?? "none"}`}
          crop={activeCrop}
          climate={climate}
          areaSummary={activeAreaSummary}
          selectedArea={selectedArea}
          company={company}
          irrigation={activeIrrigation}
          onPredicted={reloadDashboard}
        />
      </div>
      <DashboardCard>
        <p className={`${labelMuted} mb-4`}>Cronograma</p>
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
                  <td className={tdClass}>
                    <span className={badgeStatus}>{crop.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </DataTable>
      </DashboardCard>

      <DashboardCard>
        <p className={`${labelMuted} mb-4`}>Predições IA</p>
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
                  <td className={tdClass}>
                    <span className={badgeStatus}>{prediction.situation}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </DataTable>
      </DashboardCard>
    </div>
  );
}
