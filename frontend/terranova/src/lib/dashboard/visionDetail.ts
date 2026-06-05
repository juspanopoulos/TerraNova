import { DEFAULT_PAGE_FILTERS } from "@/components/dashboard/FilterSlideover";
import { MOCK_DASHBOARD_DATA } from "@/data/mockDashboard";
import type { AlertItem } from "@/data/mockDashboard";
import {
  clamp,
  filterLabel,
  getAdjustedWaterHistory,
  getAdjustedWaterMetrics,
  getClimateHistory,
} from "@/lib/dashboard/helpers";
import type { TimeFilter } from "@/types/dashboard";

const PERIOD_SCALE: Record<TimeFilter, number> = {
  daily: 1,
  weekly: 1.08,
  monthly: 0.92,
  yearly: 1.15,
};

const SOIL_MOISTURE_DELTA: Record<TimeFilter, number> = {
  daily: 0,
  weekly: -1,
  monthly: -3,
  yearly: -5,
};

const CROP_MATURITY_DELTA: Record<TimeFilter, number> = {
  daily: 0,
  weekly: 2,
  monthly: 5,
  yearly: 8,
};

const VISION_ALERT_COUNT: Record<TimeFilter, number> = {
  daily: 4,
  weekly: 6,
  monthly: 8,
  yearly: 10,
};

function last<T>(arr: readonly T[]): T {
  return arr[arr.length - 1];
}

function sectorJitter(sector: string) {
  let hash = 0;
  for (let i = 0; i < sector.length; i++) hash += sector.charCodeAt(i);
  return (hash % 5) - 2;
}

export function getVisionClimateSnapshot(timeFilter: TimeFilter) {
  const history = getClimateHistory(timeFilter);
  return {
    temperature: last(history.temperature),
    humidity: last(history.humidity),
    wind: last(history.wind),
    history,
  };
}

export function getVisionWaterMetrics(
  timeFilter: TimeFilter,
  current = MOCK_DASHBOARD_DATA.water.current,
) {
  return getAdjustedWaterMetrics(timeFilter, DEFAULT_PAGE_FILTERS, current);
}

export function getVisionWaterHistory(timeFilter: TimeFilter) {
  return getAdjustedWaterHistory(timeFilter, DEFAULT_PAGE_FILTERS);
}

export function getVisionWaterDistribution(timeFilter: TimeFilter) {
  const scale = PERIOD_SCALE[timeFilter];
  return MOCK_DASHBOARD_DATA.water.distribution.map((seg) => ({
    ...seg,
    value: Math.round(seg.value * scale),
    detail: seg.detail.replace(/\d+ L/, (m) => {
      const n = Math.round(parseInt(m, 10) * scale);
      return `${n} L`;
    }),
  }));
}

export function getVisionIrrigationRows(timeFilter: TimeFilter) {
  const scale = PERIOD_SCALE[timeFilter];
  return MOCK_DASHBOARD_DATA.water.irrigationBySector.map((row) => ({
    ...row,
    used: Math.round(row.used * scale),
    target: Math.round(row.target * scale),
    efficiency: clamp(Math.round(row.efficiency + (scale - 1) * 5), 78, 98),
  }));
}

export function getVisionSoilSnapshot(timeFilter: TimeFilter) {
  const base = MOCK_DASHBOARD_DATA.soil;
  const delta = SOIL_MOISTURE_DELTA[timeFilter];
  const nutrientShift = Math.round(delta / 2);

  return {
    nitrogen: clamp(base.current.nitrogen + nutrientShift, 0, 100),
    phosphorus: clamp(base.current.phosphorus + nutrientShift, 0, 100),
    potassium: clamp(base.current.potassium + nutrientShift, 0, 100),
    moisture: clamp(base.current.moisture + delta, 0, 100),
    ph: base.current.ph,
    nutrients: base.nutrients.map((n) => ({
      ...n,
      value: clamp(n.value + nutrientShift, 0, 100),
    })),
    sectors: base.sectors.map((s) => ({
      ...s,
      moisture: clamp(s.moisture + delta + sectorJitter(s.sector), 35, 95),
    })),
  };
}

export function getVisionCrops(timeFilter: TimeFilter) {
  const delta = CROP_MATURITY_DELTA[timeFilter];
  const periodRef = filterLabel(timeFilter);

  return MOCK_DASHBOARD_DATA.crops.map((crop) => ({
    ...crop,
    maturity: clamp(crop.maturity + delta, 0, 100),
    week: timeFilter === "daily" ? crop.week : `${crop.week} · ${periodRef}`,
  }));
}

export function getVisionAlerts(timeFilter: TimeFilter): AlertItem[] {
  return MOCK_DASHBOARD_DATA.alerts.slice(0, VISION_ALERT_COUNT[timeFilter]);
}

export function getVisionSummaryKpis(timeFilter: TimeFilter) {
  const climate = getVisionClimateSnapshot(timeFilter);
  const water = getVisionWaterMetrics(timeFilter);
  const soil = getVisionSoilSnapshot(timeFilter);
  const crops = getVisionCrops(timeFilter);
  const alerts = getVisionAlerts(timeFilter);

  const avgMaturity =
    crops.length > 0 ? crops.reduce((s, c) => s + c.maturity, 0) / crops.length : 0;
  const criticalCount = alerts.filter((a) => a.level === "critical").length;

  return {
    climate,
    water,
    soil,
    avgMaturity,
    criticalCount,
    alertTotal: alerts.length,
  };
}
