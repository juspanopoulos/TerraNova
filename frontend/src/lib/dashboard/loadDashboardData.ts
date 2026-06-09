import { ApiRequestError } from "@/lib/api/client";
import { listAlertasAbertos } from "@/lib/api/alertsApi";
import { listAreasMonitoradas } from "@/lib/api/areasApi";
import {
  listDadosClimaticos,
  listHistoricoClimaticoPorArea,
} from "@/lib/api/climateApi";
import { getDashboardArea, getDashboardResumo } from "@/lib/api/dashboardApi";
import type {
  AlertaResponse,
  AreaMonitoradaResponse,
  DadoClimaticoResponse,
  DashboardAreaResumoResponse,
  DashboardResumoResponse,
  LeituraSoloResponse,
} from "@/lib/api/types";
import { MOCK_DASHBOARD_DATA, type AlertItem } from "@/data/mockDashboard";
import type { DashboardLoadError, DashboardLoadErrorKind } from "@/types/dashboard";

type ClimateState = typeof MOCK_DASHBOARD_DATA.climate.current;
type SoilState = typeof MOCK_DASHBOARD_DATA.soil.current;
type WaterState = typeof MOCK_DASHBOARD_DATA.water.current;
type ClimateHistoryState = typeof MOCK_DASHBOARD_DATA.climate.history;

export type DashboardPayload = {
  summary: DashboardResumoResponse;
  areas: AreaMonitoradaResponse[];
  selectedArea: DashboardAreaResumoResponse | null;
  alerts: AlertItem[];
  climate: ClimateState;
  climateHistory: ClimateHistoryState;
  soil: SoilState;
  water: WaterState;
};

const ERROR_MESSAGES: Record<DashboardLoadErrorKind, string> = {
  network: "Nao foi possivel conectar. Verifique sua internet e tente novamente.",
  server: "O servidor encontrou um problema ao buscar os dados. Tente novamente em instantes.",
  timeout: "A requisicao demorou demais para responder. Verifique sua conexao e tente outra vez.",
  unauthorized: "Sua sessao expirou ou voce nao tem permissao. Faca login novamente.",
};

const ALERT_TYPE_LABELS: Record<string, string> = {
  SECA: "Seca",
  ENCHENTE: "Enchente",
  GEADA: "Geada",
  GRANIZO: "Granizo",
  EXCESSO_IRRIGACAO: "Excesso de irrigacao",
  DEFICIT_HIDRICO: "Deficit hidrico",
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

export async function fetchDashboardData(): Promise<DashboardPayload> {
  try {
    const summary = await getDashboardResumo();
    const selectedAreaId = summary.areas[0]?.idArea;

    const [areas, alerts, climateData, selectedArea, areaClimateHistory] = await Promise.all([
      listAreasMonitoradas(),
      listAlertasAbertos(),
      listDadosClimaticos(),
      selectedAreaId ? getDashboardArea(selectedAreaId) : Promise.resolve(null),
      selectedAreaId ? listHistoricoClimaticoPorArea(selectedAreaId) : Promise.resolve([]),
    ]);

    const climateSource = areaClimateHistory.length > 0 ? areaClimateHistory : climateData;
    const climate = mapClimateCurrent(climateSource, summary, selectedArea);

    return {
      summary,
      areas,
      selectedArea,
      alerts: mapAlerts(alerts, areas, summary),
      climate,
      climateHistory: mapClimateHistory(climateSource, climate),
      soil: mapSoilCurrent(summary, selectedArea),
      water: { ...MOCK_DASHBOARD_DATA.water.current },
    };
  } catch (error) {
    throw toDashboardFailure(error);
  }
}

function toDashboardFailure(error: unknown): DashboardLoadFailure {
  if (error instanceof DashboardLoadFailure) return error;

  if (error instanceof ApiRequestError) {
    if (error.status === 0) return new DashboardLoadFailure("network");
    if (error.status === 401 || error.status === 403) return new DashboardLoadFailure("unauthorized");
    if (error.status === 408) return new DashboardLoadFailure("timeout");
    return new DashboardLoadFailure("server");
  }

  return new DashboardLoadFailure("server");
}

function toNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const normalized = value.includes("T") ? value : `${value}T00:00:00`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateTimeMs(value: string | null | undefined) {
  return parseDate(value)?.getTime() ?? 0;
}

function latestClimate(data: DadoClimaticoResponse[]) {
  return [...data].sort((a, b) => dateTimeMs(b.dataColeta) - dateTimeMs(a.dataColeta))[0] ?? null;
}

function latestSoilFromAreas(areas: DashboardAreaResumoResponse[]) {
  return areas
    .map((area) => area.ultimaLeituraSolo)
    .filter((soil): soil is LeituraSoloResponse => Boolean(soil))
    .sort((a, b) => dateTimeMs(b.dataColeta) - dateTimeMs(a.dataColeta))[0] ?? null;
}

function mapClimateCurrent(
  climateData: DadoClimaticoResponse[],
  summary: DashboardResumoResponse,
  selectedArea: DashboardAreaResumoResponse | null,
): ClimateState {
  const latest = selectedArea?.ultimoDadoClimatico ?? latestClimate(climateData);

  return {
    temperature: toNumber(latest?.temperatura, toNumber(summary.indicadores.mediaTemperatura)),
    humidity: toNumber(latest?.umidade),
    wind: toNumber(latest?.velocidadeVentoKmh),
  };
}

function mapSoilCurrent(
  summary: DashboardResumoResponse,
  selectedArea: DashboardAreaResumoResponse | null,
): SoilState {
  const latest = selectedArea?.ultimaLeituraSolo ?? latestSoilFromAreas(summary.areas);

  return {
    ...MOCK_DASHBOARD_DATA.soil.current,
    moisture: toNumber(latest?.umidadeSolo, toNumber(summary.indicadores.mediaUmidadeSolo)),
  };
}

function areaLookup(
  areas: AreaMonitoradaResponse[],
  summary: DashboardResumoResponse,
) {
  const entries = [
    ...summary.areas.map((area) => [area.idArea, area.nomeArea] as const),
    ...areas.map((area) => [area.idArea, area.nomeArea] as const),
  ];
  return new Map(entries);
}

function mapAlertLevel(severidade: string): AlertItem["level"] {
  if (severidade === "CRITICA") return "critical";
  if (severidade === "ALTA" || severidade === "MEDIA") return "warning";
  return "normal";
}

function labelFromAlertType(tipoAlerta: string) {
  return ALERT_TYPE_LABELS[tipoAlerta] ?? tipoAlerta.replace(/_/g, " ").toLowerCase();
}

function formatAlertTime(value: string) {
  const date = parseDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(date)
    .replace(",", " -");
}

function mapAlerts(
  alerts: AlertaResponse[],
  areas: AreaMonitoradaResponse[],
  summary: DashboardResumoResponse,
): AlertItem[] {
  const namesByArea = areaLookup(areas, summary);

  return alerts.map((alert) => {
    const type = labelFromAlertType(alert.tipoAlerta);
    return {
      id: String(alert.idAlerta),
      level: mapAlertLevel(alert.severidade),
      title: type,
      type,
      sector: namesByArea.get(alert.idArea) ?? `Area ${alert.idArea}`,
      time: formatAlertTime(alert.dataAlerta),
      summary: alert.descricao,
    };
  });
}

type ClimateSample = {
  key: string;
  label: string;
  temperature: number;
  humidity: number;
  wind: number;
};

type ClimateSeries = {
  labels: string[];
  temperature: number[];
  humidity: number[];
  wind: number[];
};

function dateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

function formatDateTimeLabel(date: Date) {
  const dateLabel = formatDateLabel(date);
  const hourLabel = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return `${dateLabel} ${hourLabel}`;
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
  }).format(date);
}

function weekOfMonth(date: Date) {
  return Math.floor((date.getDate() - 1) / 7) + 1;
}

function sampleFromClimate(dado: DadoClimaticoResponse): ClimateSample | null {
  const date = parseDate(dado.dataReferencia ?? dado.dataColeta);
  if (!date) return null;

  return {
    key: dado.dataColeta,
    label: formatDateTimeLabel(parseDate(dado.dataColeta) ?? date),
    temperature: toNumber(dado.temperatura),
    humidity: toNumber(dado.umidade),
    wind: toNumber(dado.velocidadeVentoKmh),
  };
}

function toSeries(samples: ClimateSample[]): ClimateSeries {
  return {
    labels: samples.map((sample) => sample.label),
    temperature: samples.map((sample) => sample.temperature),
    humidity: samples.map((sample) => sample.humidity),
    wind: samples.map((sample) => sample.wind),
  };
}

function averageSamples(samples: ClimateSample[], key: string, label: string): ClimateSample {
  const count = Math.max(samples.length, 1);
  return {
    key,
    label,
    temperature: Number((samples.reduce((sum, item) => sum + item.temperature, 0) / count).toFixed(2)),
    humidity: Number((samples.reduce((sum, item) => sum + item.humidity, 0) / count).toFixed(2)),
    wind: Number((samples.reduce((sum, item) => sum + item.wind, 0) / count).toFixed(2)),
  };
}

function groupSamples(
  data: DadoClimaticoResponse[],
  keyForDate: (date: Date) => string,
  labelForDate: (date: Date) => string,
): ClimateSample[] {
  const groups = new Map<string, { label: string; samples: ClimateSample[] }>();

  data.forEach((dado) => {
    const date = parseDate(dado.dataReferencia ?? dado.dataColeta);
    const sample = sampleFromClimate(dado);
    if (!date || !sample) return;

    const key = keyForDate(date);
    const current = groups.get(key) ?? { label: labelForDate(date), samples: [] };
    current.samples.push(sample);
    groups.set(key, current);
  });

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, group]) => averageSamples(group.samples, key, group.label));
}

function singleClimatePoint(current: ClimateState): ClimateSeries {
  return {
    labels: ["Atual"],
    temperature: [current.temperature],
    humidity: [current.humidity],
    wind: [current.wind],
  };
}

function ensureSeries(series: ClimateSeries, current: ClimateState): ClimateSeries {
  return series.labels.length > 0 ? series : singleClimatePoint(current);
}

function mapClimateHistory(
  data: DadoClimaticoResponse[],
  current: ClimateState,
): ClimateHistoryState {
  const sorted = [...data].sort((a, b) => dateTimeMs(a.dataColeta) - dateTimeMs(b.dataColeta));
  const samples = sorted
    .map(sampleFromClimate)
    .filter((sample): sample is ClimateSample => Boolean(sample));

  const daily = toSeries(samples.slice(-13));
  const weekly = toSeries(
    groupSamples(sorted, dateKey, formatDateLabel).slice(-7),
  );
  const monthly = toSeries(
    groupSamples(
      sorted,
      (date) => `${monthKey(date)}-${weekOfMonth(date)}`,
      (date) => `Sem ${weekOfMonth(date)}`,
    ).slice(-6),
  );
  const yearly = toSeries(
    groupSamples(sorted, monthKey, formatMonthLabel).slice(-12),
  );

  return {
    daily: ensureSeries(daily, current),
    weekly: ensureSeries(weekly, current),
    monthly: ensureSeries(monthly, current),
    yearly: ensureSeries(yearly, current),
  };
}

export { getGreeting, formatTodayPt } from "@/utils/format/date";
