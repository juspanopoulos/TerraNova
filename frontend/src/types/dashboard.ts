import type { LayoutDashboard } from "lucide-react";

export type AuthMode = "login" | "register" | "registerCompany";

export type RegisterCredentials = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginUserOption = {
  id: string;
  name: string;
  email: string;
  password: string;
  profile: string;
  status: string;
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

export type AlertItem = {
  id: string;
  level: AlertLevel;
  title: string;
  type: string;
  sector: string;
  time: string;
  summary: string;
};

export type ChartSegment = {
  id: string;
  value: number;
  color: string;
  label: string;
  detail: string;
};

export type DonutLegendLayout = "vertical" | "horizontal";

export type ClimateState = {
  temperature: number;
  humidity: number;
  wind: number;
};

export type ClimateSeries = {
  labels: string[];
  temperature: number[];
  humidity: number[];
  wind: number[];
};

export type ClimateHistoryState = Record<TimeFilter, ClimateSeries>;

export type SoilCurrentState = {
  moisture: number;
  soilType: string;
  source: string;
  collectedAt: string;
};

export type SoilSectorState = SoilCurrentState & {
  id: string;
  idArea: number;
  sector: string;
  status: string;
};

export type SoilSeries = {
  labels: string[];
  moisture: number[];
};

export type SoilHistoryState = Record<TimeFilter, SoilSeries>;

export type SoilState = {
  current: SoilCurrentState;
  sectors: SoilSectorState[];
  history: SoilHistoryState;
};

export type IrrigationRow = {
  id: string;
  idArea: number;
  sector: string;
  date: string;
  type: string;
  previousMm: number;
  currentMm: number;
  areaHa: number | null;
  coverage: string;
  origin: string;
};

export type WaterCurrentState = {
  consumptionMm: number;
  previousMm: number;
  areaHa: number | null;
  type: string;
  coverage: string;
  origin: string;
  date: string;
};

export type WaterSeries = {
  labels: string[];
  values: number[];
};

export type WaterHistoryState = Record<TimeFilter, WaterSeries>;

export type WaterState = {
  current: WaterCurrentState;
  history: WaterHistoryState;
  distribution: ChartSegment[];
  irrigation: IrrigationRow[];
};

export type CropPlantingItem = {
  id: string;
  idAreaCultura: number;
  idArea: number;
  idCultura: number;
  name: string;
  zone: string;
  status: string;
  stage: string;
  plantedAt: string;
  harvestAt: string;
  waterNeedMm: number | null;
  plantingPeriod: string | null;
  description: string | null;
};

export type PredictionItem = {
  id: string;
  idArea: number;
  idAreaCultura: number | null;
  sector: string;
  cropName: string | null;
  date: string;
  type: string;
  model: string;
  version: string;
  status: string;
  productivity: number | null;
  classification: string;
  waterVolumeMm: number | null;
  situation: string;
  error: string | null;
};

export type NavItem = { id: ViewId; label: string; icon: typeof LayoutDashboard };
