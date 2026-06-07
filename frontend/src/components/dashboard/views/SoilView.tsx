import { DonutChart } from "@/components/dashboard/charts";
import { DashboardCard, DataTable } from "@/components/dashboard/ui";
import {
  badgeStatus,
  cardInset,
  gridCols2,
  gridSplit2,
  labelMuted,
  rowHover,
  tdClass,
  thClass,
} from "@/constants/dashboard";
import { MOCK_DASHBOARD_DATA } from "@/data/mockDashboard";
import { useDashboard } from "@/context/DashboardContext";
import type { ChartSegment } from "@/types/dashboard";

export function SoilView() {
  const { soil, selectedNutrient, setSelectedNutrient, appliedFilters } = useDashboard();
  const segments: ChartSegment[] = MOCK_DASHBOARD_DATA.soil.nutrients.map((n) => ({ ...n }));
  const sectors = MOCK_DASHBOARD_DATA.soil.sectors.filter(
    (row) => appliedFilters.soilSector === "all" || row.sector === appliedFilters.soilSector,
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className={gridSplit2}>
        <DashboardCard>
          <p className={`${labelMuted} mb-4`}>Composição NPK</p>
          <DonutChart
            segments={segments}
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
        <DataTable caption="Setores">
          <thead>
            <tr>
              <th className={thClass}>Setor</th>
              <th className={thClass}>Umidade</th>
              <th className={thClass}>pH</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sectors.map((row) => (
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
                    <span className="font-semibold tabular-nums">{row.moisture}%</span>
                  </div>
                </td>
                <td className={`${tdClass} tabular-nums`}>{row.ph.toFixed(1)}</td>
                <td className={tdClass}>
                  <span className={badgeStatus}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </DashboardCard>
    </div>
  );
}
