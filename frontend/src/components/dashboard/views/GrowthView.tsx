import { MaturityHorizontalChart } from "@/components/dashboard/charts";
import { DashboardCard, DataTable } from "@/components/dashboard/ui";
import { badgeStatus, labelMuted, rowHover, tdClass, textMuted, thClass } from "@/constants/dashboard";
import { MOCK_DASHBOARD_DATA } from "@/data/mockDashboard";
import { useDashboard } from "@/context/DashboardContext";

export function GrowthView() {
  const { selectedCrop, setSelectedCrop, appliedFilters } = useDashboard();
  const crops = MOCK_DASHBOARD_DATA.crops.filter(
    (crop) => appliedFilters.growthCrop === "all" || crop.id === appliedFilters.growthCrop,
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardCard>
        <MaturityHorizontalChart crops={crops} selectedId={selectedCrop} onSelect={setSelectedCrop} />
      </DashboardCard>
      <DashboardCard>
        <p className={`${labelMuted} mb-4`}>Cronograma</p>
        <DataTable caption="Colheitas">
          <thead>
            <tr>
              <th className={thClass}>Cultura</th>
              <th className={thClass}>Zona</th>
              <th className={thClass}>Maturidade</th>
              <th className={thClass}>Semana</th>
              <th className={thClass}>Colheita</th>
              <th className={thClass}>Status</th>
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
                <td className={tdClass}>
                  <span className={badgeStatus}>
                    {c.status}
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
