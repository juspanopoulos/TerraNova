import { useState } from "react";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { btnClick } from "@/constants/dashboard";
import { useDashboard } from "@/context/DashboardContext";
import { filterLabel } from "@/lib/dashboard/helpers";
import type { TimeFilter } from "@/types/dashboard";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function table(title: string, headers: string[], rows: Array<Array<unknown>>) {
  const head = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("");
  const body = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("");
  return `
    <h2>${escapeHtml(title)}</h2>
    <table>
      <thead><tr>${head}</tr></thead>
      <tbody>${body}</tbody>
    </table>
  `;
}

function downloadWorkbook(filename: string, html: string) {
  const blob = new Blob(["\ufeff", html], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function todaySlug() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

export function VisionExcelExportButton({ timeFilter }: { timeFilter: TimeFilter }) {
  const [loading, setLoading] = useState(false);
  const {
    company,
    dashboardSummary,
    climate,
    climateHistory,
    soil,
    water,
    crops,
    predictions,
    alerts,
  } = useDashboard();

  const handleExport = () => {
    setLoading(true);
    const period = filterLabel(timeFilter);
    const climateSeries = climateHistory[timeFilter];
    const waterSeries = water.history[timeFilter];
    const indicators = dashboardSummary?.indicadores;

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; color: #1f2933; }
            h1 { font-size: 18px; }
            h2 { margin-top: 22px; font-size: 14px; }
            table { border-collapse: collapse; margin-bottom: 16px; width: 100%; }
            th, td { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 12px; }
            th { background: #eef2f7; font-weight: 700; }
          </style>
        </head>
        <body>
          <h1>TerraNova - ${escapeHtml(period)}</h1>
          ${table("Empresa e propriedade", ["Campo", "Valor"], [
            ["Empresa", company.nomeEmpresa],
            ["CNPJ", company.cnpj],
            ["Propriedade", company.nomePropriedade],
            ["Localizacao", company.localizacao],
            ["Area total (ha)", company.areaTotalHectares],
            ["Usuario", company.nomeUsuario],
            ["E-mail do usuario", company.emailUsuario],
          ])}
          ${table("Indicadores", ["Indicador", "Valor"], [
            ["Total de propriedades", indicators?.totalPropriedades ?? ""],
            ["Total de areas", indicators?.totalAreas ?? ""],
            ["Culturas", indicators?.totalCulturas ?? ""],
            ["Plantios ativos", indicators?.totalPlantiosAtivos ?? ""],
            ["Alertas abertos", indicators?.totalAlertasAbertos ?? ""],
            ["Predicoes IA", indicators?.totalPredicoesIa ?? ""],
            ["Media temperatura", indicators?.mediaTemperatura ?? ""],
            ["Media umidade solo", indicators?.mediaUmidadeSolo ?? ""],
            ["Agua sugerida pendente (mm)", indicators?.aguaSugeridaPendenteMm ?? ""],
          ])}
          ${table("Clima atual", ["Temperatura", "Umidade", "Vento"], [[
            climate.temperature,
            climate.humidity,
            climate.wind,
          ]])}
          ${table("Historico climatico", ["Periodo", "Temperatura", "Umidade", "Vento"], climateSeries.labels.map((label, index) => [
            label,
            climateSeries.temperature[index],
            climateSeries.humidity[index],
            climateSeries.wind[index],
          ]))}
          ${table("Solo por setor", ["Setor", "Umidade", "Tipo de solo", "Fonte", "Coleta"], soil.sectors.map((sector) => [
            sector.sector,
            sector.moisture,
            sector.soilType,
            sector.source,
            sector.collectedAt,
          ]))}
          ${table("Historico hidrico", ["Periodo", "Consumo (mm)"], waterSeries.labels.map((label, index) => [
            label,
            waterSeries.values[index],
          ]))}
          ${table("Irrigacao por setor", ["Setor", "Tipo", "Consumo atual (mm)", "Irrigacao anterior (mm)", "Cobertura", "Origem"], water.irrigation.map((row) => [
            row.sector,
            row.type,
            row.currentMm,
            row.previousMm,
            row.coverage,
            row.origin,
          ]))}
          ${table("Culturas e plantios", ["Cultura", "Area", "Estagio", "Plantio", "Colheita prevista", "Necessidade hidrica", "Status"], crops.map((crop) => [
            crop.name,
            crop.zone,
            crop.stage,
            crop.plantedAt,
            crop.harvestAt,
            crop.waterNeedMm ?? "",
            crop.status,
          ]))}
          ${table("Predicoes IA", ["Data", "Area", "Cultura", "Modelo", "Produtividade", "Classificacao", "Agua sugerida", "Situacao"], predictions.map((prediction) => [
            prediction.date,
            prediction.sector,
            prediction.cropName ?? "",
            prediction.type,
            prediction.productivity ?? "",
            prediction.classification,
            prediction.waterVolumeMm ?? "",
            prediction.situation,
          ]))}
          ${table("Alertas", ["Nivel", "Titulo", "Tipo", "Setor", "Data", "Descricao"], alerts.map((alert) => [
            alert.level,
            alert.title,
            alert.type,
            alert.sector,
            alert.time,
            alert.summary,
          ]))}
        </body>
      </html>
    `;

    downloadWorkbook(`terranova-${timeFilter}-${todaySlug()}.xls`, html);
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className={`${btnClick} inline-flex items-center gap-2 rounded-md border border-[var(--db-border)] bg-[var(--db-surface)] px-3 py-2 text-sm font-semibold text-[var(--db-text)] shadow-sm hover:border-verde-floresta/30 hover:text-verde-floresta disabled:cursor-not-allowed disabled:opacity-60 sm:px-4`}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <FileSpreadsheet className="size-4" aria-hidden />}
      {loading ? "Exportando" : "Exportar Excel"}
    </button>
  );
}
