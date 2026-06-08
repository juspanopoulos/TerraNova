import { DEFAULT_MONTH, TIME_FILTERS } from "@/constants/dashboard";
import { MOCK_DASHBOARD_DATA } from "@/data/mockDashboard";
import {
  DEFAULT_DATE_RANGE,
  DEFAULT_PAGE_FILTERS,
  type PageFilters,
} from "@/components/dashboard/FilterSlideover";
import type { TimeFilter, ViewId } from "@/types/dashboard";
import { formatIsoDate, formatMonthLabel } from "@/utils/format/date";
import { clamp } from "@/utils/number";

export { clamp } from "@/utils/number";
export { formatIsoDate, formatMonthLabel } from "@/utils/format/date";

function waterVariationFactor(timeFilter: TimeFilter, filters: PageFilters) {
  if (timeFilter === "monthly" && filters.selectedMonth !== DEFAULT_MONTH) {
    const month = Number(filters.selectedMonth.split("-")[1]);
    return 0.92 + (month % 5) * 0.03;
  }
  if (
    (timeFilter === "weekly" || timeFilter === "yearly") &&
    (filters.dateRange.start !== DEFAULT_DATE_RANGE.start ||
      filters.dateRange.end !== DEFAULT_DATE_RANGE.end)
  ) {
    const start = new Date(filters.dateRange.start).getTime();
    const end = new Date(filters.dateRange.end).getTime();
    const days = Math.max(1, Math.round((end - start) / 86_400_000));
    return clamp(0.88 + (days % 14) * 0.015, 0.85, 1.12);
  }
  return 1;
}

export function getWaterComparativeLabel(timeFilter: TimeFilter, filters: PageFilters): string | null {
  if (timeFilter === "monthly" && filters.selectedMonth !== DEFAULT_MONTH) {
    return formatMonthLabel(filters.selectedMonth);
  }
  if (
    (timeFilter === "weekly" || timeFilter === "yearly") &&
    (filters.dateRange.start !== DEFAULT_DATE_RANGE.start ||
      filters.dateRange.end !== DEFAULT_DATE_RANGE.end)
  ) {
    return `${formatIsoDate(filters.dateRange.start)} — ${formatIsoDate(filters.dateRange.end)}`;
  }
  return null;
}

export function hasWaterComparativeFilter(timeFilter: TimeFilter, filters: PageFilters) {
  return getWaterComparativeLabel(timeFilter, filters) !== null;
}

type WaterMetrics = typeof MOCK_DASHBOARD_DATA.water.current;

export function getAdjustedWaterMetrics(
  timeFilter: TimeFilter,
  filters: PageFilters,
  current: WaterMetrics,
): WaterMetrics {
  const factor = waterVariationFactor(timeFilter, filters);
  const history = getWaterHistory(timeFilter);
  const periodTotal = history.values.reduce((sum, value) => sum + value, 0);
  const baseConsumption =
    timeFilter === "daily" ? current.consumptionLiters : Math.round(periodTotal / history.values.length);

  return {
    consumptionLiters: Math.round(baseConsumption * factor),
    savingsLiters: Math.round(current.savingsLiters * factor),
    efficiency: clamp(Math.round(current.efficiency + (factor - 1) * 8), 78, 98),
  };
}

export function getAdjustedWaterHistory(timeFilter: TimeFilter, filters: PageFilters) {
  const base = getWaterHistory(timeFilter);
  const factor = waterVariationFactor(timeFilter, filters);
  return {
    labels: base.labels,
    values: base.values.map((value) => Math.round(value * factor)),
  };
}

export function getClimateHistory(filter: TimeFilter) {
  return MOCK_DASHBOARD_DATA.climate.history[filter];
}

export function getWaterHistory(filter: TimeFilter) {
  return MOCK_DASHBOARD_DATA.water.history[filter];
}

export function filterLabel(filter: TimeFilter) {
  return TIME_FILTERS.find((f) => f.id === filter)?.label ?? "";
}

export function clearFiltersForView(view: ViewId, timeFilter: TimeFilter, current: PageFilters): PageFilters {
  if (view === "overview" || view === "water") {
    if (timeFilter === "monthly") {
      return { ...current, selectedMonth: DEFAULT_MONTH };
    }
    if (timeFilter === "weekly" || timeFilter === "yearly") {
      return { ...current, dateRange: { ...DEFAULT_PAGE_FILTERS.dateRange } };
    }
  }
  if (view === "alerts") {
    return { ...current, alertLevels: [], alertTypes: [] };
  }
  if (view === "soil") {
    return { ...current, soilSector: "all" };
  }
  if (view === "growth") {
    return { ...current, growthCrop: "all" };
  }
  return current;
}
