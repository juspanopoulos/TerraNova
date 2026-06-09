import {
  AlertTriangle,
  Bell,
  Cloud,
  CloudRain,
  Droplets,
  Leaf,
  ShieldCheck,
  Thermometer,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { AlertLevel } from "@/types/dashboard";

export type AlertKanbanColumn = {
  id: AlertLevel;
  label: string;
  hint: string;
  icon: LucideIcon;
  header: string;
};

/** Colunas do quadro por nível de severidade */
export const ALERT_KANBAN_COLUMNS: AlertKanbanColumn[] = [
  {
    id: "critical",
    label: "Críticos",
    hint: "Ação imediata necessária",
    icon: AlertTriangle,
    header: "bg-red-500/90 text-white dark:bg-red-500/80",
  },
  {
    id: "warning",
    label: "Moderados",
    hint: "Monitorar e avaliar resposta",
    icon: Bell,
    header: "bg-laranja-solar text-preto-suave",
  },
  {
    id: "normal",
    label: "Normais",
    hint: "Situação dentro do esperado",
    icon: ShieldCheck,
    header: "bg-verde-floresta text-bege-natural",
  },
];

export const ALERT_TYPE_ICONS: Record<string, LucideIcon> = {
  Temperatura: Thermometer,
  "UV / Calor": Cloud,
  Precipitação: CloudRain,
  Vento: Wind,
  Umidade: Droplets,
  Solo: Leaf,
  Clima: Cloud,
  Equipamento: Bell,
  Seca: Leaf,
  Enchente: CloudRain,
  Geada: Thermometer,
  Granizo: Cloud,
  "Excesso de irrigacao": Droplets,
  "Deficit hidrico": Droplets,
};

export function alertTypeIcon(type: string): LucideIcon {
  return ALERT_TYPE_ICONS[type] ?? Bell;
}
