import { DEFAULT_MONTH, TIME_FILTERS } from "@/constants/dashboard";
import {
  DEFAULT_DATE_RANGE,
  DEFAULT_PAGE_FILTERS,
  type PageFilters,
} from "@/components/dashboard/FilterSlideover";
import type { TimeFilter, ViewId } from "@/types/dashboard";
import { formatIsoDate, formatMonthLabel } from "@/utils/format/date";

export { formatIsoDate, formatMonthLabel } from "@/utils/format/date";

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
