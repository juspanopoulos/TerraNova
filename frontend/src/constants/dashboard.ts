import {
  Bell,
  Building2,
  Calendar,
  CalendarDays,
  CalendarRange,
  Cloud,
  Droplets,
  LayoutDashboard,
  Leaf,
  Plug,
  Settings2,
  Sprout,
  TrendingUp,
} from "lucide-react";
import type { AlertLevel, BreadcrumbItem, NavItem, SettingsTabId, TimeFilter, ViewId } from "@/types/dashboard";

export const LOGO_SRC = "/logos/logo-colorido.png";

export const shellBg = "bg-[var(--db-bg)]";
export const cardBase =
  "rounded-xl border border-[var(--db-border)] bg-[var(--db-surface)] p-4 shadow-sm sm:p-5 md:p-6";
export const cardInset =
  "rounded-xl border border-[var(--db-border)] bg-[var(--db-nested-bg)] p-4";
export const nestedCard = cardInset;
export const surfaceCard =
  "rounded-xl border border-[var(--db-border)] bg-[var(--db-surface)] shadow-sm";
export const textPrimary = "text-[var(--db-text)]";
export const textMuted = "text-[var(--db-text-muted)]";
export const textFaint = "text-[var(--db-text-faint)]";
export const chartDetailPanel =
  "mt-4 rounded-xl border border-verde-floresta/20 bg-[var(--db-detail-panel)] p-4 shadow-sm";
export const labelMuted =
  "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--db-text-faint)]";
export const pageTitle =
  "text-2xl font-bold tracking-tight text-[var(--db-text)] sm:text-3xl md:text-4xl";
export const chartMotion = "dashboard-soft";
export const tooltipSurface =
  "rounded-lg border border-[var(--db-border)] bg-[var(--db-surface)] px-3 py-2 text-xs text-[var(--db-text)] shadow-md";
export const btnClick =
  `cursor-pointer ${chartMotion} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-floresta/40`;
export const sectionTitle = "text-lg font-bold text-[var(--db-text)] sm:text-xl";
export const inputField =
  "w-full rounded-lg border border-[var(--db-border)] bg-[var(--db-surface)] px-3 py-2 text-sm text-[var(--db-text)] outline-none placeholder:text-[var(--db-text-faint)] focus:border-verde-floresta/40 focus:ring-2 focus:ring-verde-floresta/15";
export const btnSecondary =
  "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--db-border)] bg-[var(--db-surface)] px-3 py-2 text-sm font-semibold text-[var(--db-text)] hover:bg-[var(--db-hover)]";
export const btnSecondaryMuted =
  "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--db-border)] bg-transparent px-3 py-2 text-sm font-semibold text-[var(--db-text-muted)] hover:bg-[var(--db-hover)]";
export const btnDisabled =
  "w-full rounded-lg border border-[var(--db-border)] px-3 py-2 text-sm font-semibold text-[var(--db-text-faint)]";
export const badgeMuted =
  "rounded-full bg-[var(--db-nested-bg)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--db-text-faint)]";
export const badgeStatus =
  "rounded-md bg-[var(--db-nested-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--db-text-muted)]";
export const rowHover = "hover:bg-[var(--db-hover)]";
export const heroGradient = "db-hero-gradient border-b border-[var(--db-border-soft)]";
export const thClass =
  "whitespace-nowrap border-b border-[var(--db-border)] bg-[var(--db-surface-muted)] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--db-text-muted)] sm:px-4";
export const tdClass =
  "border-b border-[var(--db-border-soft)] px-3 py-3 text-sm text-[var(--db-text)] sm:px-4";

export const gridCols2 = "grid grid-cols-2 gap-3 sm:gap-4";
export const gridCols3 = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4";
export const gridCols4 = "grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4";
export const gridSplit2 = "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6";

export const grids = {
  cols2: gridCols2,
  cols3: gridCols3,
  cols4: gridCols4,
  split2: gridSplit2,
} as const;

export const TIME_FILTERS: { id: TimeFilter; label: string }[] = [
  { id: "daily", label: "Diário" },
  { id: "weekly", label: "Semanal" },
  { id: "monthly", label: "Mensal" },
  { id: "yearly", label: "Anual" },
];

export const VISION_CARDS: {
  id: TimeFilter;
  label: string;
  description: string;
  icon: typeof CalendarDays;
}[] = [
  { id: "daily", label: "Visão do Dia", description: "Indicadores e consumo nas últimas 24h", icon: CalendarDays },
  { id: "weekly", label: "Visão Semanal", description: "Tendências e comparativos da semana", icon: CalendarRange },
  { id: "monthly", label: "Visão do Mês", description: "Panorama consolidado do mês corrente", icon: Calendar },
  { id: "yearly", label: "Visão Anual", description: "Evolução e metas ao longo do ano", icon: TrendingUp },
];

export const PAGE_TITLES: Record<ViewId, string> = {
  overview: "Visão Geral",
  alerts: "Alertas",
  climate: "Controle Climático",
  soil: "Controle do Solo",
  growth: "Previsão de Colheitas",
  water: "Consumo Hídrico",
  settings: "Configurações",
};

export const SETTINGS_TAB_TITLES: Record<SettingsTabId, string> = {
  geral: "Geral",
  empresa: "Empresa",
  integracoes: "Integrações",
};

export const SETTINGS_NAV_ITEMS: { id: SettingsTabId; label: string; icon: typeof Settings2 }[] = [
  { id: "geral", label: "Geral", icon: Settings2 },
  { id: "empresa", label: "Empresa", icon: Building2 },
  { id: "integracoes", label: "Integrações", icon: Plug },
];

export const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { id: "alerts", label: "Alertas", icon: Bell },
  { id: "climate", label: "Controle Climático", icon: Cloud },
  { id: "soil", label: "Controle do Solo", icon: Leaf },
  { id: "growth", label: "Previsão de Colheitas", icon: Sprout },
  { id: "water", label: "Consumo Hídrico", icon: Droplets },
];

export const levelLabel: Record<AlertLevel, string> = {
  critical: "Crítico",
  warning: "Moderado",
  normal: "Normal",
};

export const levelAccent: Record<
  AlertLevel,
  { bar: string; chip: string; chipText: string; glow: string }
> = {
  critical: {
    bar: "bg-red-400/85",
    chip: "bg-red-500/15",
    chipText: "text-red-400",
    glow: "hover:shadow-[0_8px_24px_rgba(220,90,90,0.12)]",
  },
  warning: {
    bar: "bg-laranja-solar/90",
    chip: "bg-amber-500/15",
    chipText: "text-amber-400",
    glow: "hover:shadow-[0_8px_24px_rgba(229,155,58,0.14)]",
  },
  normal: {
    bar: "bg-verde-floresta/80",
    chip: "bg-verde-floresta/10",
    chipText: "text-verde-floresta",
    glow: "hover:shadow-[0_8px_24px_rgba(63,107,75,0.12)]",
  },
};

/** Largura máxima do conteúdo do dashboard (área principal, sem sidebar). */
export const dashboardContentShell = "mx-auto w-full max-w-none";

export const contentPad = "px-4 sm:px-5 md:px-6 lg:px-8";

export const DASHBOARD_ROUTES = {
  root: "/plataforma",
  visaoGeral: "/plataforma/visao-geral",
  cadastrarArea: "/plataforma/areas/cadastrar",
  visaoDia: "/plataforma/visao/dia",
  visaoSemana: "/plataforma/visao/semana",
  visaoMes: "/plataforma/visao/mes",
  visaoAnual: "/plataforma/visao/anual",
  alertas: "/plataforma/alertas",
  clima: "/plataforma/clima",
  solo: "/plataforma/solo",
  colheitas: "/plataforma/colheitas",
  agua: "/plataforma/agua",
  configuracoes: "/plataforma/configuracoes",
  configuracoesGeral: "/plataforma/configuracoes/geral",
  configuracoesEmpresa: "/plataforma/configuracoes/empresa",
  configuracoesIntegracoes: "/plataforma/configuracoes/integracoes",
} as const;

export const SETTINGS_ROUTE_BY_TAB: Record<SettingsTabId, string> = {
  geral: DASHBOARD_ROUTES.configuracoesGeral,
  empresa: DASHBOARD_ROUTES.configuracoesEmpresa,
  integracoes: DASHBOARD_ROUTES.configuracoesIntegracoes,
};

export const VISION_ROUTE_BY_FILTER: Record<TimeFilter, string> = {
  daily: DASHBOARD_ROUTES.visaoDia,
  weekly: DASHBOARD_ROUTES.visaoSemana,
  monthly: DASHBOARD_ROUTES.visaoMes,
  yearly: DASHBOARD_ROUTES.visaoAnual,
};

const PATH_TO_TIME_FILTER: [string, TimeFilter][] = [
  [DASHBOARD_ROUTES.visaoDia, "daily"],
  [DASHBOARD_ROUTES.visaoSemana, "weekly"],
  [DASHBOARD_ROUTES.visaoMes, "monthly"],
  [DASHBOARD_ROUTES.visaoAnual, "yearly"],
];

export function TIME_FILTER_FROM_PATH(pathname: string): TimeFilter | null {
  for (const [path, filter] of PATH_TO_TIME_FILTER) {
    if (pathname === path || pathname.startsWith(`${path}/`)) {
      return filter;
    }
  }
  return null;
}

export function showsPagePeriodFilter(view: ViewId): boolean {
  return (
    view !== "overview" &&
    view !== "alerts" &&
    view !== "settings"
  );
}

export function resolvePageTimeFilter(
  view: ViewId,
  pathname: string,
  pageTimeFilter: TimeFilter,
): TimeFilter {
  const fromPath = TIME_FILTER_FROM_PATH(pathname);
  if (fromPath) return fromPath;
  if (view === "overview") return "daily";
  return pageTimeFilter;
}

export const VIEW_ROUTE_BY_ID: Record<ViewId, string> = {
  overview: DASHBOARD_ROUTES.visaoGeral,
  alerts: DASHBOARD_ROUTES.alertas,
  climate: DASHBOARD_ROUTES.clima,
  soil: DASHBOARD_ROUTES.solo,
  growth: DASHBOARD_ROUTES.colheitas,
  water: DASHBOARD_ROUTES.agua,
  settings: DASHBOARD_ROUTES.configuracoesGeral,
};

export function isVisaoGeralHub(pathname: string): boolean {
  return (
    pathname === DASHBOARD_ROUTES.visaoGeral ||
    pathname === `${DASHBOARD_ROUTES.visaoGeral}/`
  );
}

export function pathToSettingsTab(pathname: string): SettingsTabId | null {
  if (pathname.startsWith(DASHBOARD_ROUTES.configuracoesIntegracoes)) return "integracoes";
  if (pathname.startsWith(DASHBOARD_ROUTES.configuracoesEmpresa)) return "empresa";
  if (pathname.startsWith(DASHBOARD_ROUTES.configuracoesGeral)) return "geral";
  if (pathname.startsWith(DASHBOARD_ROUTES.configuracoes)) return "geral";
  return null;
}

export function isSettingsPath(pathname: string): boolean {
  return pathname.startsWith(DASHBOARD_ROUTES.configuracoes);
}

export function pathToViewId(pathname: string): ViewId {
  if (isSettingsPath(pathname)) return "settings";
  if (pathname.startsWith(DASHBOARD_ROUTES.alertas)) return "alerts";
  if (pathname.startsWith(DASHBOARD_ROUTES.clima)) return "climate";
  if (pathname.startsWith(DASHBOARD_ROUTES.solo)) return "soil";
  if (pathname.startsWith(DASHBOARD_ROUTES.colheitas)) return "growth";
  if (pathname.startsWith(DASHBOARD_ROUTES.agua)) return "water";
  if (
    pathname.startsWith(DASHBOARD_ROUTES.visaoGeral) ||
    pathname.startsWith(`${DASHBOARD_ROUTES.root}/visao/`)
  ) {
    return "overview";
  }
  return "overview";
}

export const VISION_PAGE_TITLES: Record<TimeFilter, string> = {
  daily: "Visão do Dia",
  weekly: "Visão Semanal",
  monthly: "Visão do Mês",
  yearly: "Visão Anual",
};

export function pageTitleFromPath(pathname: string): string {
  if (pathname.startsWith(DASHBOARD_ROUTES.cadastrarArea)) return "Cadastrar uma área";
  const settingsTab = pathToSettingsTab(pathname);
  if (settingsTab) return SETTINGS_TAB_TITLES[settingsTab];
  const timeFilter = TIME_FILTER_FROM_PATH(pathname);
  if (timeFilter) return VISION_PAGE_TITLES[timeFilter];
  return PAGE_TITLES[pathToViewId(pathname)];
}

export function breadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  if (isVisaoGeralHub(pathname)) return [];

  const items: BreadcrumbItem[] = [{ label: "Plataforma", to: DASHBOARD_ROUTES.visaoGeral }];

  if (pathname.startsWith(DASHBOARD_ROUTES.cadastrarArea)) {
    items.push({ label: "Visão Geral", to: DASHBOARD_ROUTES.visaoGeral });
    items.push({ label: "Cadastrar uma área" });
    return items;
  }

  const settingsTab = pathToSettingsTab(pathname);
  if (settingsTab) {
    items.push({ label: "Configurações", to: DASHBOARD_ROUTES.visaoGeral });
    items.push({ label: SETTINGS_TAB_TITLES[settingsTab] });
    return items;
  }

  const timeFilter = TIME_FILTER_FROM_PATH(pathname);
  if (timeFilter) {
    items.push({ label: "Visão Geral", to: DASHBOARD_ROUTES.visaoGeral });
    items.push({ label: VISION_PAGE_TITLES[timeFilter] });
    return items;
  }

  const view = pathToViewId(pathname);
  if (view === "overview" && pathname.startsWith(DASHBOARD_ROUTES.visaoGeral)) {
    items.push({ label: "Visão Geral" });
    return items;
  }

  items.push({ label: PAGE_TITLES[view] });
  return items;
}
