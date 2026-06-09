import { useState } from "react";
import { Droplets, Gauge, Waves } from "lucide-react";
import { ChartDetailPanel, WaterBarChart } from "@/components/dashboard/charts";
import { DashboardCard, DataTable, MetricTile } from "@/components/dashboard/ui";
import {
  gridCols3,
  labelMuted,
  rowHover,
  tdClass,
  textMuted,
  thClass,
} from "@/constants/dashboard";
import { useDashboard } from "@/context/DashboardContext";
import { filterLabel } from "@/lib/dashboard/helpers";

export function WaterView() {
  const {
    water,
    pageTimeFilter,
  } = useDashboard();
  const history = water.history[pageTimeFilter];
  const [barIndex, setBarIndex] = useState<number | null>(null);

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
