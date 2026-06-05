import {
  AlertTriangle,
  Loader2,
  RefreshCw,
  ShieldAlert,
  WifiOff,
} from "lucide-react";
import { btnClick, cardBase, textMuted, textPrimary } from "@/constants/dashboard";
import { dashboardErrorFromKind } from "@/lib/dashboard/loadDashboardData";
import type { DashboardLoadError, DashboardLoadErrorKind } from "@/types/dashboard";

const ERROR_ICONS: Record<DashboardLoadErrorKind, typeof WifiOff> = {
  network: WifiOff,
  server: AlertTriangle,
  timeout: RefreshCw,
  unauthorized: ShieldAlert,
};

export function DashboardLoadingState() {
  return (
    <div
      className={`${cardBase} dashboard-fade-up flex min-h-[320px] flex-col items-center justify-center gap-4 text-center sm:min-h-[400px]`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className="size-10 animate-spin text-verde-floresta" aria-hidden />
      <div>
        <p className={`text-base font-bold sm:text-lg ${textPrimary}`}>Carregando dados</p>
        <p className={`mt-1 text-sm ${textMuted}`}>
          Sincronizando sensores, alertas e indicadores da fazenda…
        </p>
      </div>
    </div>
  );
}

export function DashboardErrorState({
  error,
  onRetry,
  onLogout,
}: {
  error: DashboardLoadError;
  onRetry: () => void;
  onLogout?: () => void;
}) {
  const Icon = ERROR_ICONS[error.kind];
  const isUnauthorized = error.kind === "unauthorized";

  return (
    <div
      className={`${cardBase} dashboard-fade-up flex min-h-[320px] flex-col items-center justify-center gap-5 text-center sm:min-h-[400px]`}
      role="alert"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <Icon className="size-7" aria-hidden />
      </span>
      <div className="max-w-md">
        <p className={`text-base font-bold sm:text-lg ${textPrimary}`}>
          {isUnauthorized ? "Sessão expirada" : "Não foi possível carregar os dados"}
        </p>
        <p className={`mt-2 text-sm leading-relaxed ${textMuted}`}>{error.message}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {!isUnauthorized && (
          <button
            type="button"
            onClick={onRetry}
            className={`${btnClick} inline-flex items-center gap-2 rounded-lg bg-verde-floresta px-4 py-2.5 text-sm font-semibold text-bege-natural hover:bg-verde-floresta/90`}
          >
            <RefreshCw className="size-4" aria-hidden />
            Tentar novamente
          </button>
        )}
        {isUnauthorized && onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className={`${btnClick} inline-flex items-center gap-2 rounded-lg bg-verde-floresta px-4 py-2.5 text-sm font-semibold text-bege-natural hover:bg-verde-floresta/90`}
          >
            Voltar ao login
          </button>
        )}
      </div>
    </div>
  );
}

export function toDashboardLoadError(err: unknown): DashboardLoadError {
  if (err && typeof err === "object" && "kind" in err) {
    const kind = (err as { kind: DashboardLoadErrorKind }).kind;
    return dashboardErrorFromKind(kind);
  }
  return dashboardErrorFromKind("server");
}
