import type { PageFilters } from "@/components/dashboard/FilterSlideover";
import type { UsuarioPreferenciasResponse } from "@/lib/api/types";
import type { GeneralPreferences } from "@/types/dashboard";

export const DEFAULT_GENERAL_PREFERENCES: GeneralPreferences = {
  darkMode: false,
  reducedMotion: false,
  emailNotifications: true,
};

export function filtersFromPreferences(
  preferencias: UsuarioPreferenciasResponse,
): PageFilters {
  return {
    dateRange: {
      start: preferencias.dateRangeStart,
      end: preferencias.dateRangeEnd,
    },
    selectedMonth: preferencias.selectedMonth,
    alertLevels: preferencias.alertLevels.filter(
      (level): level is PageFilters["alertLevels"][number] =>
        level === "critical" || level === "warning" || level === "normal",
    ),
    alertTypes: preferencias.alertTypes,
    soilSector: preferencias.soilSector || "all",
    growthCrop: preferencias.growthCrop || "all",
  };
}

export function generalPreferencesFromResponse(
  preferencias: UsuarioPreferenciasResponse,
): GeneralPreferences {
  return {
    darkMode: preferencias.darkMode,
    reducedMotion: preferencias.reducedMotion,
    emailNotifications: preferencias.emailNotifications,
  };
}
