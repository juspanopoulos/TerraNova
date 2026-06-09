import { DashboardCard, DataTable } from "@/components/dashboard/ui";
import {
  cardInset,
  gridCols2,
  gridSplit2,
  labelMuted,
  rowHover,
  tdClass,
  thClass,
} from "@/constants/dashboard";
import { useDashboard } from "@/context/DashboardContext";

export function SoilView() {
  const { soil, appliedFilters } = useDashboard();
  const sectors = soil.sectors.filter(
    (row) => appliedFilters.soilSector === "all" || row.sector === appliedFilters.soilSector,
  );

  return (
    <div className="space-y-4 sm:space-y-6">
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
          <p className={`${labelMuted} mb-4`}>Indicadores</p>
          <div className={gridCols2}>
            {[
              { l: "Umidade", v: `${Math.round(soil.current.moisture)}%` },
              { l: "Tipo", v: soil.current.soilType },
              { l: "Fonte", v: soil.current.source },
              { l: "Coleta", v: soil.current.collectedAt || "Não informada" },
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
              <th className={thClass}>Tipo de solo</th>
              <th className={thClass}>Fonte</th>
            </tr>
          </thead>
          <tbody>
            {sectors.length === 0 ? (
              <tr>
                <td className={tdClass} colSpan={4}>
                  Nenhuma leitura de solo encontrada.
                </td>
              </tr>
            ) : (
              sectors.map((row) => (
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
                      <span className="font-semibold tabular-nums">{Math.round(row.moisture)}%</span>
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
    </div>
  );
}
