import { useMemo, useState } from "react";
import { CalendarRange, Droplets, TrendingUp } from "lucide-react";
import {
  ChartDetailPanel,
  DonutChart,
  WaterBarChart,
} from "@/components/dashboard/charts";
import { DashboardCard, DataTable, MetricTile } from "@/components/dashboard/ui";
import {
  gridCols3,
  gridSplit2,
  labelMuted,
  nestedCard,
  rowHover,
  tdClass,
  textMuted,
  textPrimary,
  thClass,
} from "@/constants/dashboard";
import { MOCK_DASHBOARD_DATA } from "@/data/mockDashboard";
import { useDashboard } from "@/context/DashboardContext";
import {
  filterLabel,
  getAdjustedWaterHistory,
  getAdjustedWaterMetrics,
  getWaterComparativeLabel,
  hasWaterComparativeFilter,
} from "@/lib/dashboard/helpers";
import type { ChartSegment } from "@/types/dashboard";

export function WaterView() {
  const {
    water,
    selectedWaterSeg,
    setSelectedWaterSeg,
    appliedFilters,
    pageTimeFilter,
  } = useDashboard();

  const metrics = useMemo(
    () => getAdjustedWaterMetrics(pageTimeFilter, appliedFilters, water),
    [pageTimeFilter, appliedFilters, water],
  );
  const history = useMemo(
    () => getAdjustedWaterHistory(pageTimeFilter, appliedFilters),
    [pageTimeFilter, appliedFilters],
  );
  const comparativeLabel = getWaterComparativeLabel(pageTimeFilter, appliedFilters);
  const segments: ChartSegment[] = MOCK_DASHBOARD_DATA.water.distribution.map((d) => ({ ...d }));
  const [barIndex, setBarIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4 sm:space-y-6">
      {hasWaterComparativeFilter(pageTimeFilter, appliedFilters) && comparativeLabel && (
        <div className={`flex items-start gap-3 ${nestedCard}`}>
          <CalendarRange className="mt-0.5 size-4 shrink-0 text-verde-floresta" aria-hidden />
          <div>
            <p className={labelMuted}>Comparativo ativo</p>
            <p className={`mt-1 text-sm font-semibold ${textPrimary}`}>{comparativeLabel}</p>
            <p className={`mt-1 text-xs ${textMuted}`}>
              Métricas e histórico ajustados ao período selecionado nos filtros.
            </p>
          </div>
        </div>
      )}

      <div className={gridCols3}>
        <MetricTile
          label="Consumo"
          value={metrics.consumptionLiters.toLocaleString("pt-BR")}
          unit="L"
          icon={Droplets}
        />
        <MetricTile
          label="Economia"
          value={`${(metrics.savingsLiters / 1000).toFixed(0)} mil`}
          unit="L"
          icon={TrendingUp}
        />
        <MetricTile label="Eficiência" value={String(metrics.efficiency)} unit="%" icon={Droplets} />
      </div>

      <div className={gridSplit2}>
        <DashboardCard>
          <p className={`${labelMuted} mb-4`}>Distribuição do consumo</p>
          <DonutChart
            segments={segments}
            centerValue={`${metrics.efficiency}%`}
            centerLabel="Eficiência"
            selectedId={selectedWaterSeg}
            onSelect={setSelectedWaterSeg}
            legendLayout="horizontal"
          />
        </DashboardCard>
        <DashboardCard>
          <p className={`${labelMuted} mb-4`}>Histórico — {filterLabel(pageTimeFilter)}</p>
          <WaterBarChart
            values={history.values}
            labels={history.labels}
            selectedIndex={barIndex}
            onSelect={setBarIndex}
          />
          {barIndex !== null && (
            <ChartDetailPanel
              title={`${history.labels[barIndex]} — consumo`}
              detail={`${history.values[barIndex].toLocaleString("pt-BR")} litros no período ${filterLabel(pageTimeFilter).toLowerCase()}.`}
            />
          )}
        </DashboardCard>
      </div>

      <DashboardCard>
        <p className={`${labelMuted} mb-4`}>Irrigação por setor</p>
        <DataTable caption="Irrigação">
          <thead>
            <tr>
              <th className={thClass}>Setor</th>
              <th className={thClass}>Consumo</th>
              <th className={thClass}>Meta</th>
              <th className={thClass}>Economia</th>
              <th className={thClass}>Eficiência</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DASHBOARD_DATA.water.irrigationBySector.map((row) => (
              <tr key={row.sector} className={rowHover}>
                <td className={`${tdClass} font-medium`}>{row.sector}</td>
                <td className={`${tdClass} tabular-nums`}>{row.used} L</td>
                <td className={`${tdClass} tabular-nums ${textMuted}`}>{row.target} L</td>
                <td className={`${tdClass} font-semibold text-verde-floresta`}>{row.save}</td>
                <td className={`${tdClass} font-bold tabular-nums`}>{row.efficiency}%</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </DashboardCard>
    </div>
  );
}
