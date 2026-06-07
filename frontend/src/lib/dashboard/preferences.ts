import type { GeneralPreferences } from "@/types/dashboard";

export const PREFERENCES_STORAGE_KEY = "terranova-dashboard-preferences";

export const DEFAULT_GENERAL_PREFERENCES: GeneralPreferences = {
  darkMode: false,
  reducedMotion: false,
  emailNotifications: true,
};

export function loadStoredPreferences(): GeneralPreferences {
  if (typeof window === "undefined") return { ...DEFAULT_GENERAL_PREFERENCES };

  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_GENERAL_PREFERENCES };
    const parsed = JSON.parse(raw) as Partial<GeneralPreferences>;
    return { ...DEFAULT_GENERAL_PREFERENCES, ...parsed };
  } catch {
    return { ...DEFAULT_GENERAL_PREFERENCES };
  }
}

export function saveStoredPreferences(preferences: GeneralPreferences) {
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
}
