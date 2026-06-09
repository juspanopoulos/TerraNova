import type { PageFilters } from "@/components/dashboard/FilterSlideover";
import type { UsuarioPreferenciasResponse } from "@/lib/api/types";
import type { GeneralPreferences } from "@/types/dashboard";

export const DEFAULT_GENERAL_PREFERENCES: GeneralPreferences = {
  darkMode: false,
  reducedMotion: false,
  emailNotifications: true,
};

const DARK_MODE_STORAGE_KEY = "terranova:dashboard:dark-mode";

export function loadStoredDarkMode(): boolean | null {
  try {
    const raw = localStorage.getItem(DARK_MODE_STORAGE_KEY);
    if (raw === "true") return true;
    if (raw === "false") return false;
    return null;
  } catch {
    return null;
  }
}

export function saveStoredDarkMode(enabled: boolean) {
  try {
    localStorage.setItem(DARK_MODE_STORAGE_KEY, String(enabled));
  } catch {
    // A preferência no backend continua sendo a fonte secundária se o navegador bloquear localStorage.
  }
}

export function preferencesWithStoredDarkMode(preferences: GeneralPreferences): GeneralPreferences {
  const storedDarkMode = loadStoredDarkMode();
  return {
    ...preferences,
    darkMode: storedDarkMode ?? preferences.darkMode,
  };
}

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
