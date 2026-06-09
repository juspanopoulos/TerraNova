import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { downloadVisionReport } from "@/lib/pdf/downloadVisionReport";
import type { TimeFilter } from "@/types/dashboard";

export function VisionPdfDownloadButton({ timeFilter }: { timeFilter: TimeFilter }) {
  const {
    company,
    dashboardSummary,
    dashboardAreas,
    climate,
    climateHistory,
    soil,
    water,
    crops,
    predictions,
    alerts,
  } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await downloadVisionReport(timeFilter, {
        company,
        dashboardSummary,
        dashboardAreas,
        climate,
        climateHistory,
        soil,
        water,
        crops,
        predictions,
        alerts,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível gerar o PDF. Tente novamente.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => void handleDownload()}
        disabled={loading}
        className="dashboard-soft inline-flex cursor-pointer items-center gap-2 rounded-md border border-[var(--db-border)] bg-[var(--db-surface)] px-3 py-2 text-sm font-semibold text-[var(--db-text)] shadow-sm hover:border-verde-floresta/30 hover:text-verde-floresta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-floresta/40 disabled:cursor-wait disabled:opacity-70 sm:px-4"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Download className="size-4" aria-hidden />
        )}
        {loading ? "Gerando PDF…" : "Baixar PDF"}
      </button>
      {error && (
        <p className="max-w-xs text-right text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
