import { useState } from "react";
import { AlertTriangle, Leaf, Sprout, Thermometer } from "lucide-react";
import { DonutChart } from "@/components/dashboard/charts";
import { DashboardCard, MetricTile } from "@/components/dashboard/ui";
import { gridCols4, labelMuted } from "@/constants/dashboard";
import { MOCK_DASHBOARD_DATA } from "@/data/mockDashboard";
import { useDashboard } from "@/context/DashboardContext";
import { filterLabel } from "@/lib/dashboard/helpers";
import type { ChartSegment, TimeFilter } from "@/types/dashboard";

export function VisionDetailView({ timeFilter }: { timeFilter: TimeFilter }) {
  const { climate, soil, water } = useDashboard();
  const crops = MOCK_DASHBOARD_DATA.crops;
  const avgMaturity = crops.reduce((s, c) => s + c.maturity, 0) / crops.length;
  const criticalCount = MOCK_DASHBOARD_DATA.alerts.filter((a) => a.level === "critical").length;
  const [selectedWater, setSelectedWater] = useState<string | null>(null);
  const waterSegments: ChartSegment[] = MOCK_DASHBOARD_DATA.water.distribution.map((d) => ({ ...d }));

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className={gridCols4}>
        <MetricTile label="Temperatura" value={climate.temperature.toFixed(1)} unit="°C" icon={Thermometer} />
        <MetricTile label="Umidade solo" value={Math.round(soil.moisture).toString()} unit="%" icon={Leaf} />
        <MetricTile label="Maturidade média" value={avgMaturity.toFixed(0)} unit="%" icon={Sprout} />
        <MetricTile label="Alertas críticos" value={String(criticalCount)} icon={AlertTriangle} />
      </div>

      <DashboardCard>
        <p className={`${labelMuted} mb-4`}>Distribuição hídrica — {filterLabel(timeFilter)}</p>
        <DonutChart
          segments={waterSegments}
          centerValue={`${water.efficiency}%`}
          centerLabel="Eficiência"
          selectedId={selectedWater}
          onSelect={setSelectedWater}
          legendLayout="horizontal"
        />
      </DashboardCard>
    </div>
  );
}
