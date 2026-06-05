import type { LayoutDashboard } from "lucide-react";

export type AuthMode = "login" | "register" | "registerCompany";

export type RegisterCredentials = {
  fullName: string;
  email: string;
  password: string;
};

export type ViewId =
  | "overview"
  | "alerts"
  | "climate"
  | "soil"
  | "growth"
  | "water"
  | "assistant"
  | "notes"
  | "settings";

export type SettingsTabId = "geral" | "empresa" | "integracoes";

export type GeneralPreferences = {
  darkMode: boolean;
  reducedMotion: boolean;
  emailNotifications: boolean;
};

export type DashboardLoadErrorKind = "network" | "server" | "timeout" | "unauthorized";

export type DashboardLoadError = {
  kind: DashboardLoadErrorKind;
  message: string;
};

export type DashboardLoadStatus = "idle" | "loading" | "success" | "error";

export type CompanyProfile = {
  legalName: string;
  tradeName: string;
  cnpj: string;
  cpf: string;
  email: string;
  phone: string;
  mobile: string;
  street: string;
  streetNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  farmName: string;
  farmRegion: string;
  totalAreaHa: number;
  activeSectors: number;
  responsibleName: string;
};

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

export type TimeFilter = "daily" | "weekly" | "monthly" | "yearly";

export type AlertLevel = "critical" | "warning" | "normal";

export type ChartSegment = {
  id: string;
  value: number;
  color: string;
  label: string;
  detail: string;
};

export type DonutLegendLayout = "vertical" | "horizontal";

export type NavItem = { id: ViewId; label: string; icon: typeof LayoutDashboard };
