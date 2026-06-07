import { Bell, Palette, Sparkles, SunMoon } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/ui";
import { SettingsToggle } from "@/components/dashboard/SettingsToggle";
import { labelMuted } from "@/constants/dashboard";
import { useDashboard } from "@/context/DashboardContext";
import type { GeneralPreferences } from "@/types/dashboard";

const APPEARANCE_OPTIONS: {
  key: keyof Pick<GeneralPreferences, "darkMode" | "reducedMotion">;
  label: string;
  description: string;
  icon: typeof SunMoon;
}[] = [
  {
    key: "darkMode",
    label: "Modo escuro",
    description: "Ativa o tema escuro em todo o painel da plataforma.",
    icon: SunMoon,
  },
  {
    key: "reducedMotion",
    label: "Reduzir animações",
    description: "Diminui transições e efeitos visuais para uma experiência mais estável.",
    icon: Sparkles,
  },
];

export function GeralView() {
  const { preferences, updatePreference } = useDashboard();

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardCard>
        <p className={labelMuted}>Preferências</p>
        <h2 className="mt-1 text-lg font-bold text-[var(--db-text)] sm:text-xl">
          Configurações gerais
        </h2>
        <p className="mt-2 text-sm text-[var(--db-text-muted)]">
          Personalize a aparência e o comportamento do dashboard.
        </p>
      </DashboardCard>

      <DashboardCard>
        <div className="mb-5 flex items-center gap-2">
          <Palette className="size-4 text-verde-floresta" aria-hidden />
          <p className={`${labelMuted} mb-0`}>Aparência</p>
        </div>
        <div className="space-y-5">
          {APPEARANCE_OPTIONS.map(({ key, label, description, icon: Icon }) => (
            <div
              key={key}
              className="flex items-center gap-4 rounded-lg border border-[var(--db-border-soft)] bg-[var(--db-surface-muted)]/40 p-4 sm:gap-5 sm:p-5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--db-surface)] text-[var(--db-text-muted)] ring-1 ring-[var(--db-border-soft)]">
                <Icon className="size-4" aria-hidden />
              </span>
              <SettingsToggle
                id={`pref-${key}`}
                label={label}
                description={description}
                checked={preferences[key]}
                onChange={(value) => updatePreference(key, value)}
              />
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard>
        <div className="mb-5 flex items-center gap-2">
          <Bell className="size-4 text-verde-floresta" aria-hidden />
          <p className={`${labelMuted} mb-0`}>Notificações</p>
        </div>
        <div className="rounded-lg border border-[var(--db-border-soft)] bg-[var(--db-surface-muted)]/40 p-4 sm:p-5">
          <SettingsToggle
          id="pref-emailNotifications"
          label="Alertas por e-mail"
          description="Receba resumos diários e alertas críticos no e-mail cadastrado da empresa."
          checked={preferences.emailNotifications}
          onChange={(value) => updatePreference("emailNotifications", value)}
        />
        </div>
      </DashboardCard>
    </div>
  );
}
