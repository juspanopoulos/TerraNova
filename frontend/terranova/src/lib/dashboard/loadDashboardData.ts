import { MOCK_DASHBOARD_DATA } from "@/data/mockDashboard";
import type { DashboardLoadError, DashboardLoadErrorKind } from "@/types/dashboard";

export type DashboardPayload = {
  climate: typeof MOCK_DASHBOARD_DATA.climate.current;
  soil: typeof MOCK_DASHBOARD_DATA.soil.current;
  water: typeof MOCK_DASHBOARD_DATA.water.current;
};

const ERROR_MESSAGES: Record<DashboardLoadErrorKind, string> = {
  network: "Não foi possível conectar. Verifique sua internet e tente novamente.",
  server: "O servidor encontrou um problema ao buscar os dados. Tente novamente em instantes.",
  timeout: "A requisição demorou demais para responder. Verifique sua conexão e tente outra vez.",
  unauthorized: "Sua sessão expirou ou você não tem permissão. Faça login novamente.",
};

export class DashboardLoadFailure extends Error {
  kind: DashboardLoadErrorKind;

  constructor(kind: DashboardLoadErrorKind) {
    super(ERROR_MESSAGES[kind]);
    this.name = "DashboardLoadFailure";
    this.kind = kind;
  }
}

export function dashboardErrorFromKind(kind: DashboardLoadErrorKind): DashboardLoadError {
  return { kind, message: ERROR_MESSAGES[kind] };
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function fetchDashboardData(options?: {
  forceError?: DashboardLoadErrorKind;
}): Promise<DashboardPayload> {
  await wait(900);

  const forced = options?.forceError ?? readForcedError();
  if (forced) {
    throw new DashboardLoadFailure(forced);
  }

  return {
    climate: { ...MOCK_DASHBOARD_DATA.climate.current },
    soil: { ...MOCK_DASHBOARD_DATA.soil.current },
    water: { ...MOCK_DASHBOARD_DATA.water.current },
  };
}

function readForcedError(): DashboardLoadErrorKind | null {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem("dashboard-force-error");
  if (
    value === "network" ||
    value === "server" ||
    value === "timeout" ||
    value === "unauthorized"
  ) {
    return value;
  }
  return null;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function formatTodayPt(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}
