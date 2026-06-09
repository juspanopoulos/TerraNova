import { ApiRequestError } from "@/lib/api/client";
import { listAlertasAbertos } from "@/lib/api/alertsApi";
import { listAreasMonitoradas } from "@/lib/api/areasApi";
import { listDadosClimaticos, listHistoricoClimaticoPorArea } from "@/lib/api/climateApi";
import { listEmpresas } from "@/lib/api/companiesApi";
import { listAreasCulturasAtivas, listCulturas } from "@/lib/api/cropsApi";
import { getDashboardArea, getDashboardResumo } from "@/lib/api/dashboardApi";
import { listHistoricoIrrigacaoPorArea, listIrrigacoes } from "@/lib/api/irrigationApi";
import { listPredicoesIa, listPredicoesIaPorArea } from "@/lib/api/predictionsApi";
import { listPropriedades } from "@/lib/api/propertiesApi";
import {
  getUltimaLeituraSoloPorArea,
  listHistoricoSoloPorArea,
  listLeiturasSolo,
} from "@/lib/api/soilApi";
import { EMPTY_COMPANY_PROFILE } from "@/lib/dashboard/companyFields";
import type {
  AlertaResponse,
  AreaCulturaResponse,
  AreaMonitoradaResponse,
  CulturaResponse,
  DadoClimaticoResponse,
  DashboardAreaResumoResponse,
  DashboardResumoResponse,
  EmpresaResponse,
  IrrigacaoResponse,
  LeituraSoloResponse,
  PredicaoIaResponse,
  PropriedadeResponse,
  RecomendacaoResponse,
  UsuarioResponse,
} from "@/lib/api/types";
import type {
  AlertItem,
  ClimateHistoryState,
  ClimateSeries,
  ClimateState,
  CompanyProfile,
  CropPlantingItem,
  IrrigationRow,
  PredictionItem,
  SoilHistoryState,
  SoilSeries,
  SoilState,
  WaterHistoryState,
  WaterSeries,
  WaterState,
} from "@/types/dashboard";
import type { DashboardLoadError, DashboardLoadErrorKind } from "@/types/dashboard";

export type DashboardPayload = {
  company: CompanyProfile;
  summary: DashboardResumoResponse;
  areas: AreaMonitoradaResponse[];
  selectedArea: DashboardAreaResumoResponse | null;
  alerts: AlertItem[];
  climate: ClimateState;
  climateHistory: ClimateHistoryState;
  soil: SoilState;
  water: WaterState;
  crops: CropPlantingItem[];
  predictions: PredictionItem[];
};

const ERROR_MESSAGES: Record<DashboardLoadErrorKind, string> = {
  network: "Não foi possível conectar. Verifique sua internet e tente novamente.",
  server: "O servidor encontrou um problema ao buscar os dados. Tente novamente em instantes.",
  timeout: "A requisição demorou demais para responder. Verifique sua conexão e tente outra vez.",
  unauthorized: "Sua sessão expirou ou você não tem permissão. Faça login novamente.",
};

const ALERT_TYPE_LABELS: Record<string, string> = {
  SECA: "Seca",
  ENCHENTE: "Enchente",
  GEADA: "Geada",
  GRANIZO: "Granizo",
  EXCESSO_IRRIGACAO: "Excesso de irrigação",
  DEFICIT_HIDRICO: "Déficit hídrico",
};

export const EMPTY_CLIMATE: ClimateState = {
  temperature: 0,
  humidity: 0,
  wind: 0,
};

const EMPTY_CLIMATE_SERIES: ClimateSeries = {
  labels: ["Atual"],
  temperature: [0],
  humidity: [0],
  wind: [0],
};

export const EMPTY_CLIMATE_HISTORY: ClimateHistoryState = {
  daily: { ...EMPTY_CLIMATE_SERIES },
  weekly: { ...EMPTY_CLIMATE_SERIES },
  monthly: { ...EMPTY_CLIMATE_SERIES },
  yearly: { ...EMPTY_CLIMATE_SERIES },
};

const EMPTY_SOIL_SERIES: SoilSeries = {
  labels: ["Atual"],
  moisture: [0],
};

export const EMPTY_SOIL: SoilState = {
  current: {
    moisture: 0,
    soilType: "Não informado",
    source: "Não informado",
    collectedAt: "",
  },
  sectors: [],
  history: {
    daily: { ...EMPTY_SOIL_SERIES },
    weekly: { ...EMPTY_SOIL_SERIES },
    monthly: { ...EMPTY_SOIL_SERIES },
    yearly: { ...EMPTY_SOIL_SERIES },
  },
};

const EMPTY_WATER_SERIES: WaterSeries = {
  labels: ["Atual"],
  values: [0],
};

export const EMPTY_WATER: WaterState = {
  current: {
    consumptionMm: 0,
    previousMm: 0,
    areaHa: null,
    type: "Não informado",
    coverage: "Não informado",
    origin: "Não informado",
    date: "",
  },
  history: {
    daily: { ...EMPTY_WATER_SERIES },
    weekly: { ...EMPTY_WATER_SERIES },
    monthly: { ...EMPTY_WATER_SERIES },
    yearly: { ...EMPTY_WATER_SERIES },
  },
  irrigation: [],
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

export async function fetchDashboardData(usuario: UsuarioResponse): Promise<DashboardPayload> {
  try {
    const [summary, areas, propriedades, empresas] = await Promise.all([
      getDashboardResumo(),
      listAreasMonitoradas(),
      listPropriedades(),
      listEmpresas(),
    ]);

    const scopedProperties = propriedades.filter(
      (propriedade) => propriedade.idEmpresa === usuario.idEmpresa,
    );
    const scopedPropertyIds = new Set(scopedProperties.map((propriedade) => propriedade.idPropriedade));
    const scopedAreas = areas.filter((area) => scopedPropertyIds.has(area.idPropriedade));
    const scopedAreaIds = new Set(scopedAreas.map((area) => area.idArea));
    const selectedAreaId =
      summary.areas.find((area) => scopedAreaIds.has(area.idArea))?.idArea ??
      scopedAreas[0]?.idArea;

    const [
      alerts,
      climateData,
      selectedArea,
      areaClimateHistory,
      soilData,
      areaSoilHistory,
      latestAreaSoil,
      irrigationData,
      areaIrrigationHistory,
      culturas,
      activePlantings,
      predictions,
      areaPredictions,
    ] = await Promise.all([
      listAlertasAbertos(),
      listDadosClimaticos(),
      selectedAreaId ? getDashboardArea(selectedAreaId) : Promise.resolve(null),
      selectedAreaId ? listHistoricoClimaticoPorArea(selectedAreaId) : Promise.resolve([]),
      listLeiturasSolo(),
      selectedAreaId ? listHistoricoSoloPorArea(selectedAreaId) : Promise.resolve([]),
      selectedAreaId ? optionalApi(getUltimaLeituraSoloPorArea(selectedAreaId)) : Promise.resolve(null),
      listIrrigacoes(),
      selectedAreaId ? listHistoricoIrrigacaoPorArea(selectedAreaId) : Promise.resolve([]),
      listCulturas(),
      listAreasCulturasAtivas(),
      listPredicoesIa(),
      selectedAreaId ? listPredicoesIaPorArea(selectedAreaId) : Promise.resolve([]),
    ]);

    const scopedAlerts = alerts.filter((alert) => scopedAreaIds.has(alert.idArea));
    const scopedClimateData = climateData.filter((item) => scopedAreaIds.has(item.idArea));
    const scopedAreaClimateHistory = areaClimateHistory.filter((item) => scopedAreaIds.has(item.idArea));
    const scopedSoilData = soilData.filter((item) => scopedAreaIds.has(item.idArea));
    const scopedAreaSoilHistory = areaSoilHistory.filter((item) => scopedAreaIds.has(item.idArea));
    const scopedIrrigationData = irrigationData.filter((item) => scopedAreaIds.has(item.idArea));
    const scopedAreaIrrigationHistory = areaIrrigationHistory.filter((item) => scopedAreaIds.has(item.idArea));
    const scopedActivePlantings = activePlantings.filter((item) => scopedAreaIds.has(item.idArea));
    const scopedPredictions = predictions.filter((item) => scopedAreaIds.has(item.idArea));
    const scopedAreaPredictions = areaPredictions.filter((item) => scopedAreaIds.has(item.idArea));
    const scopedRecommendations = summary.recomendacoesPendentes.filter((item) =>
      scopedAreaIds.has(item.idArea),
    );
    const scopedSummaryAreas = summary.areas.filter((area) => scopedAreaIds.has(area.idArea));
    const scopedSummary = mapScopedSummary(
      scopedProperties,
      scopedAreas,
      scopedSummaryAreas,
      scopedAlerts,
      scopedRecommendations,
      scopedPredictions,
      scopedClimateData,
      scopedSoilData,
      scopedActivePlantings,
    );

    const climateSource =
      scopedAreaClimateHistory.length > 0 ? scopedAreaClimateHistory : scopedClimateData;
    const climate = mapClimateCurrent(climateSource, scopedSummary, selectedArea);
    const crops = mapCrops(scopedActivePlantings, culturas, scopedAreas, scopedSummary);

    return {
      company: mapCompanyProfile(usuario, empresas, scopedProperties),
      summary: scopedSummary,
      areas: scopedAreas,
      selectedArea,
      alerts: mapAlerts(scopedAlerts, scopedAreas, scopedSummary),
      climate,
      climateHistory: mapClimateHistory(climateSource, climate),
      soil: mapSoilData(
        scopedSummary,
        selectedArea,
        scopedAreas,
        scopedSoilData,
        scopedAreaSoilHistory,
        latestAreaSoil,
      ),
      water: mapWaterData(
        scopedSummary,
        selectedArea,
        scopedAreas,
        scopedIrrigationData,
        scopedAreaIrrigationHistory,
      ),
      crops,
      predictions: mapPredictions(
        scopedAreaPredictions.length > 0 ? scopedAreaPredictions : scopedPredictions,
        scopedAreas,
        scopedSummary,
        crops,
      ),
    };
  } catch (error) {
    throw toDashboardFailure(error);
  }
}

function mapScopedSummary(
  propriedades: PropriedadeResponse[],
  areas: AreaMonitoradaResponse[],
  summaryAreas: DashboardAreaResumoResponse[],
  alertas: AlertaResponse[],
  recomendacoes: RecomendacaoResponse[],
  predicoes: PredicaoIaResponse[],
  dadosClimaticos: DadoClimaticoResponse[],
  leiturasSolo: LeituraSoloResponse[],
  plantiosAtivos: AreaCulturaResponse[],
): DashboardResumoResponse {
  return {
    indicadores: {
      totalEmpresas: propriedades.length > 0 ? 1 : 0,
      totalPropriedades: propriedades.length,
      totalAreas: areas.length,
      totalCulturas: new Set(plantiosAtivos.map((plantio) => plantio.idCultura)).size,
      totalPlantiosAtivos: plantiosAtivos.length,
      totalAlertasAbertos: alertas.length,
      totalRecomendacoesPendentes: recomendacoes.length,
      totalPredicoesIa: predicoes.length,
      mediaTemperatura: averageValues(dadosClimaticos.map((item) => item.temperatura)),
      mediaUmidadeSolo: averageValues(leiturasSolo.map((item) => item.umidadeSolo)),
      aguaSugeridaPendenteMm: sumValues(
        recomendacoes.map((item) => item.volumeAguaSugeridoMm),
      ),
    },
    areas: summaryAreas,
    alertasAbertos: alertas,
    recomendacoesPendentes: recomendacoes,
    ultimasPredicoesIa: latestPredictions(predicoes, 5),
  };
}

export function companyProfileFromApi(
  usuario: UsuarioResponse,
  empresa: EmpresaResponse | null,
  propriedade: PropriedadeResponse | null,
): CompanyProfile {
  return {
    ...EMPTY_COMPANY_PROFILE,
    idEmpresa: empresa?.idEmpresa ?? usuario.idEmpresa,
    idPropriedade: propriedade?.idPropriedade ?? null,
    idUsuario: usuario.idUsuario,
    nomeEmpresa: empresa?.nomeEmpresa ?? "",
    cnpj: empresa?.cnpj ?? "",
    emailEmpresa: empresa?.email ?? "",
    telefoneEmpresa: empresa?.telefone ?? "",
    nomePropriedade: propriedade?.nomePropriedade ?? "",
    localizacao: propriedade?.localizacao ?? "",
    latitude: propriedade?.latitude ?? null,
    longitude: propriedade?.longitude ?? null,
    areaTotalHectares: propriedade?.areaTotalHectares ?? 0,
    nomeUsuario: usuario.nomeUsuario,
    emailUsuario: usuario.email,
    cpf: usuario.cpf ?? "",
    perfil: usuario.perfil,
    status: usuario.status,
  };
}

function mapCompanyProfile(
  usuario: UsuarioResponse,
  empresas: EmpresaResponse[],
  propriedades: PropriedadeResponse[],
): CompanyProfile {
  const empresa = empresas.find((item) => item.idEmpresa === usuario.idEmpresa) ?? null;
  return companyProfileFromApi(usuario, empresa, propriedades[0] ?? null);
}

function sumValues(values: Array<number | null | undefined>) {
  return Number(
    values
      .map((value) => Number(value))
      .filter(Number.isFinite)
      .reduce((sum, value) => sum + value, 0)
      .toFixed(2),
  );
}

function averageValues(values: Array<number | null | undefined>) {
  const validValues = values.map((value) => Number(value)).filter(Number.isFinite);
  if (validValues.length === 0) return 0;
  return Number(
    (validValues.reduce((sum, value) => sum + value, 0) / validValues.length).toFixed(2),
  );
}

function latestPredictions(predictions: PredicaoIaResponse[], limit: number) {
  return [...predictions]
    .sort((a, b) => dateTimeMs(b.dataPredicao) - dateTimeMs(a.dataPredicao))
    .slice(0, limit);
}

async function optionalApi<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) return null;
    throw error;
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

function latestByDate<T>(data: T[], dateOf: (item: T) => string | null | undefined) {
  return [...data].sort((a, b) => dateTimeMs(dateOf(b)) - dateTimeMs(dateOf(a)))[0] ?? null;
}

function latestClimate(data: DadoClimaticoResponse[]) {
  return latestByDate(data, (item) => item.dataColeta);
}

function latestSoil(data: LeituraSoloResponse[]) {
  return latestByDate(data, (item) => item.dataColeta);
}

function latestIrrigation(data: IrrigacaoResponse[]) {
  return latestByDate(data, (item) => item.dataRegistro);
}

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

function formatDateOnly(value: string | null | undefined) {
  const date = parseDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
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

function weekOfMonth(date: Date) {
  return Math.floor((date.getDate() - 1) / 7) + 1;
}

function humanizeEnum(value: string | null | undefined, fallback = "Não informado") {
  if (!value) return fallback;
  return value
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function areaLookup(areas: AreaMonitoradaResponse[], summary: DashboardResumoResponse) {
  const entries = [
    ...summary.areas.map((area) => [area.idArea, area.nomeArea] as const),
    ...areas.map((area) => [area.idArea, area.nomeArea] as const),
  ];
  return new Map(entries);
}

function knownAreas(areas: AreaMonitoradaResponse[], summary: DashboardResumoResponse) {
  const map = new Map<number, { idArea: number; nomeArea: string; tipoSolo: string | null; areaHectares: number | null }>();

  summary.areas.forEach((area) => {
    map.set(area.idArea, {
      idArea: area.idArea,
      nomeArea: area.nomeArea,
      tipoSolo: area.tipoSolo,
      areaHectares: area.areaHectares,
    });
  });

  areas.forEach((area) => {
    map.set(area.idArea, {
      idArea: area.idArea,
      nomeArea: area.nomeArea,
      tipoSolo: area.tipoSolo,
      areaHectares: area.areaHectares,
    });
  });

  return [...map.values()].sort((a, b) => a.nomeArea.localeCompare(b.nomeArea));
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

function mapAlertLevel(severidade: string): AlertItem["level"] {
  if (severidade === "CRITICA") return "critical";
  if (severidade === "ALTA" || severidade === "MEDIA") return "warning";
  return "normal";
}

function labelFromAlertType(tipoAlerta: string) {
  return ALERT_TYPE_LABELS[tipoAlerta] ?? humanizeEnum(tipoAlerta);
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
      sector: namesByArea.get(alert.idArea) ?? `Área ${alert.idArea}`,
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

function toClimateSeries(samples: ClimateSample[]): ClimateSeries {
  return {
    labels: samples.map((sample) => sample.label),
    temperature: samples.map((sample) => sample.temperature),
    humidity: samples.map((sample) => sample.humidity),
    wind: samples.map((sample) => sample.wind),
  };
}

function averageClimateSamples(samples: ClimateSample[], key: string, label: string): ClimateSample {
  const count = Math.max(samples.length, 1);
  return {
    key,
    label,
    temperature: Number((samples.reduce((sum, item) => sum + item.temperature, 0) / count).toFixed(2)),
    humidity: Number((samples.reduce((sum, item) => sum + item.humidity, 0) / count).toFixed(2)),
    wind: Number((samples.reduce((sum, item) => sum + item.wind, 0) / count).toFixed(2)),
  };
}

function groupClimateSamples(
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
    .map(([key, group]) => averageClimateSamples(group.samples, key, group.label));
}

function singleClimatePoint(current: ClimateState): ClimateSeries {
  return {
    labels: ["Atual"],
    temperature: [current.temperature],
    humidity: [current.humidity],
    wind: [current.wind],
  };
}

function ensureClimateSeries(series: ClimateSeries, current: ClimateState): ClimateSeries {
  return series.labels.length > 0 ? series : singleClimatePoint(current);
}

function mapClimateHistory(data: DadoClimaticoResponse[], current: ClimateState): ClimateHistoryState {
  const sorted = [...data].sort((a, b) => dateTimeMs(a.dataColeta) - dateTimeMs(b.dataColeta));
  const samples = sorted
    .map(sampleFromClimate)
    .filter((sample): sample is ClimateSample => Boolean(sample));

  return {
    daily: ensureClimateSeries(toClimateSeries(samples.slice(-13)), current),
    weekly: ensureClimateSeries(toClimateSeries(groupClimateSamples(sorted, dateKey, formatDateLabel).slice(-7)), current),
    monthly: ensureClimateSeries(
      toClimateSeries(
        groupClimateSamples(
          sorted,
          (date) => `${monthKey(date)}-${weekOfMonth(date)}`,
          (date) => `Sem ${weekOfMonth(date)}`,
        ).slice(-6),
      ),
      current,
    ),
    yearly: ensureClimateSeries(toClimateSeries(groupClimateSamples(sorted, monthKey, formatMonthLabel).slice(-12)), current),
  };
}

function latestSoilByArea(
  summary: DashboardResumoResponse,
  readings: LeituraSoloResponse[],
  selectedArea: DashboardAreaResumoResponse | null,
  latestAreaSoil: LeituraSoloResponse | null,
) {
  const items = [
    ...readings,
    ...summary.areas.map((area) => area.ultimaLeituraSolo).filter((soil): soil is LeituraSoloResponse => Boolean(soil)),
    selectedArea?.ultimaLeituraSolo,
    latestAreaSoil,
  ].filter((soil): soil is LeituraSoloResponse => Boolean(soil));

  const map = new Map<number, LeituraSoloResponse>();
  items.forEach((soil) => {
    const current = map.get(soil.idArea);
    if (!current || dateTimeMs(soil.dataColeta) > dateTimeMs(current.dataColeta)) {
      map.set(soil.idArea, soil);
    }
  });
  return map;
}

function mapSoilData(
  summary: DashboardResumoResponse,
  selectedArea: DashboardAreaResumoResponse | null,
  areas: AreaMonitoradaResponse[],
  soilData: LeituraSoloResponse[],
  areaSoilHistory: LeituraSoloResponse[],
  latestAreaSoil: LeituraSoloResponse | null,
): SoilState {
  const latestByArea = latestSoilByArea(summary, [...soilData, ...areaSoilHistory], selectedArea, latestAreaSoil);
  const latest =
    latestAreaSoil ??
    selectedArea?.ultimaLeituraSolo ??
    latestSoil(areaSoilHistory) ??
    latestSoil(soilData);

  const currentMoisture = toNumber(latest?.umidadeSolo, toNumber(summary.indicadores.mediaUmidadeSolo));
  const current = {
    moisture: currentMoisture,
    soilType: latest?.tipoSolo ?? selectedArea?.tipoSolo ?? "Não informado",
    source: humanizeEnum(latest?.fonte),
    collectedAt: formatDateOnly(latest?.dataColeta),
  };

  const sectors = knownAreas(areas, summary).map((area) => {
    const areaSoil = latestByArea.get(area.idArea);
    const moisture = toNumber(areaSoil?.umidadeSolo);
    return {
      id: String(area.idArea),
      idArea: area.idArea,
      sector: area.nomeArea,
      moisture,
      soilType: areaSoil?.tipoSolo ?? area.tipoSolo ?? "Não informado",
      source: humanizeEnum(areaSoil?.fonte),
      collectedAt: formatDateOnly(areaSoil?.dataColeta),
    };
  });

  return {
    current,
    sectors,
    history: mapSoilHistory(areaSoilHistory.length > 0 ? areaSoilHistory : soilData, current.moisture),
  };
}

type NumericSample = {
  key: string;
  label: string;
  value: number;
};

function groupNumericSamples<T>(
  data: T[],
  dateOf: (item: T) => string | null | undefined,
  valueOf: (item: T) => number,
  keyForDate: (date: Date) => string,
  labelForDate: (date: Date) => string,
): NumericSample[] {
  const groups = new Map<string, { label: string; values: number[] }>();

  data.forEach((item) => {
    const date = parseDate(dateOf(item));
    if (!date) return;

    const key = keyForDate(date);
    const current = groups.get(key) ?? { label: labelForDate(date), values: [] };
    current.values.push(valueOf(item));
    groups.set(key, current);
  });

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, group]) => ({
      key,
      label: group.label,
      value: Number((group.values.reduce((sum, value) => sum + value, 0) / Math.max(group.values.length, 1)).toFixed(2)),
    }));
}

function mapSoilHistory(data: LeituraSoloResponse[], currentMoisture: number): SoilHistoryState {
  const sorted = [...data].sort((a, b) => dateTimeMs(a.dataColeta) - dateTimeMs(b.dataColeta));
  const direct = sorted.map((item) => ({
    key: item.dataColeta,
    label: formatDateTimeLabel(parseDate(item.dataColeta) ?? new Date()),
    value: toNumber(item.umidadeSolo),
  }));

  return {
    daily: ensureSoilSeries(toSoilSeries(direct.slice(-13)), currentMoisture),
    weekly: ensureSoilSeries(
      toSoilSeries(groupNumericSamples(sorted, (item) => item.dataColeta, (item) => toNumber(item.umidadeSolo), dateKey, formatDateLabel).slice(-7)),
      currentMoisture,
    ),
    monthly: ensureSoilSeries(
      toSoilSeries(
        groupNumericSamples(
          sorted,
          (item) => item.dataColeta,
          (item) => toNumber(item.umidadeSolo),
          (date) => `${monthKey(date)}-${weekOfMonth(date)}`,
          (date) => `Sem ${weekOfMonth(date)}`,
        ).slice(-6),
      ),
      currentMoisture,
    ),
    yearly: ensureSoilSeries(
      toSoilSeries(groupNumericSamples(sorted, (item) => item.dataColeta, (item) => toNumber(item.umidadeSolo), monthKey, formatMonthLabel).slice(-12)),
      currentMoisture,
    ),
  };
}

function toSoilSeries(samples: NumericSample[]): SoilSeries {
  return {
    labels: samples.map((sample) => sample.label),
    moisture: samples.map((sample) => sample.value),
  };
}

function ensureSoilSeries(series: SoilSeries, currentMoisture: number): SoilSeries {
  return series.labels.length > 0 ? series : { labels: ["Atual"], moisture: [currentMoisture] };
}

function latestIrrigationByArea(
  summary: DashboardResumoResponse,
  data: IrrigacaoResponse[],
  selectedArea: DashboardAreaResumoResponse | null,
) {
  const items = [
    ...data,
    ...summary.areas.map((area) => area.ultimaIrrigacao).filter((item): item is IrrigacaoResponse => Boolean(item)),
    selectedArea?.ultimaIrrigacao,
  ].filter((item): item is IrrigacaoResponse => Boolean(item));

  const map = new Map<number, IrrigacaoResponse>();
  items.forEach((item) => {
    const current = map.get(item.idArea);
    if (!current || dateTimeMs(item.dataRegistro) > dateTimeMs(current.dataRegistro)) {
      map.set(item.idArea, item);
    }
  });
  return map;
}

function mapWaterData(
  summary: DashboardResumoResponse,
  selectedArea: DashboardAreaResumoResponse | null,
  areas: AreaMonitoradaResponse[],
  irrigationData: IrrigacaoResponse[],
  areaIrrigationHistory: IrrigacaoResponse[],
): WaterState {
  const source = areaIrrigationHistory.length > 0 ? areaIrrigationHistory : irrigationData;
  const latest = selectedArea?.ultimaIrrigacao ?? latestIrrigation(source);
  const latestByArea = latestIrrigationByArea(summary, [...irrigationData, ...areaIrrigationHistory], selectedArea);
  const namesByArea = areaLookup(areas, summary);

  return {
    current: {
      consumptionMm: toNumber(latest?.consumoAtualMm),
      previousMm: toNumber(latest?.irrigacaoAnteriorMm),
      areaHa: latest?.areaCampoHectare ?? null,
      type: humanizeEnum(latest?.tipoIrrigacao),
      coverage: humanizeEnum(latest?.usouCoberturaSolo),
      origin: humanizeEnum(latest?.origem),
      date: formatDateOnly(latest?.dataRegistro),
    },
    history: mapWaterHistory(source, toNumber(latest?.consumoAtualMm)),
    irrigation: knownAreas(areas, summary)
      .map((area): IrrigationRow | null => {
        const row = latestByArea.get(area.idArea);
        if (!row) return null;
        return {
          id: String(row.idIrrigacao),
          idArea: row.idArea,
          sector: namesByArea.get(row.idArea) ?? area.nomeArea,
          date: formatDateOnly(row.dataRegistro),
          type: humanizeEnum(row.tipoIrrigacao),
          previousMm: toNumber(row.irrigacaoAnteriorMm),
          currentMm: toNumber(row.consumoAtualMm),
          areaHa: row.areaCampoHectare,
          coverage: humanizeEnum(row.usouCoberturaSolo),
          origin: humanizeEnum(row.origem),
        };
      })
      .filter((row): row is IrrigationRow => Boolean(row)),
  };
}

function mapWaterHistory(data: IrrigacaoResponse[], currentValue: number): WaterHistoryState {
  const sorted = [...data].sort((a, b) => dateTimeMs(a.dataRegistro) - dateTimeMs(b.dataRegistro));
  const direct = sorted.map((item) => ({
    key: item.dataRegistro,
    label: formatDateTimeLabel(parseDate(item.dataRegistro) ?? new Date()),
    value: toNumber(item.consumoAtualMm),
  }));

  return {
    daily: ensureWaterSeries(toWaterSeries(direct.slice(-13)), currentValue),
    weekly: ensureWaterSeries(
      toWaterSeries(groupNumericSamples(sorted, (item) => item.dataRegistro, (item) => toNumber(item.consumoAtualMm), dateKey, formatDateLabel).slice(-7)),
      currentValue,
    ),
    monthly: ensureWaterSeries(
      toWaterSeries(
        groupNumericSamples(
          sorted,
          (item) => item.dataRegistro,
          (item) => toNumber(item.consumoAtualMm),
          (date) => `${monthKey(date)}-${weekOfMonth(date)}`,
          (date) => `Sem ${weekOfMonth(date)}`,
        ).slice(-6),
      ),
      currentValue,
    ),
    yearly: ensureWaterSeries(
      toWaterSeries(groupNumericSamples(sorted, (item) => item.dataRegistro, (item) => toNumber(item.consumoAtualMm), monthKey, formatMonthLabel).slice(-12)),
      currentValue,
    ),
  };
}

function toWaterSeries(samples: NumericSample[]): WaterSeries {
  return {
    labels: samples.map((sample) => sample.label),
    values: samples.map((sample) => sample.value),
  };
}

function ensureWaterSeries(series: WaterSeries, currentValue: number): WaterSeries {
  return series.labels.length > 0 ? series : { labels: ["Atual"], values: [currentValue] };
}

function mapCrops(
  activePlantings: AreaCulturaResponse[],
  culturas: CulturaResponse[],
  areas: AreaMonitoradaResponse[],
  summary: DashboardResumoResponse,
): CropPlantingItem[] {
  const cultureById = new Map(culturas.map((cultura) => [cultura.idCultura, cultura]));
  const namesByArea = areaLookup(areas, summary);

  return [...activePlantings]
    .sort((a, b) => dateTimeMs(a.dataColheitaPrevista) - dateTimeMs(b.dataColheitaPrevista))
    .map((planting) => {
      const cultura = cultureById.get(planting.idCultura);
      return {
        id: String(planting.idAreaCultura),
        idAreaCultura: planting.idAreaCultura,
        idArea: planting.idArea,
        idCultura: planting.idCultura,
        name: cultura?.nomeCultura ?? `Cultura ${planting.idCultura}`,
        zone: namesByArea.get(planting.idArea) ?? `Área ${planting.idArea}`,
        status: humanizeEnum(planting.status),
        stage: planting.estagioCrescimento ?? "Não informado",
        plantedAt: formatDateOnly(planting.dataPlantio),
        harvestAt: formatDateOnly(planting.dataColheitaPrevista),
        waterNeedMm: cultura?.necessidadeHidricaMm ?? null,
        plantingPeriod: cultura?.periodoPlantio ?? null,
        description: cultura?.descricao ?? null,
      };
    });
}

function mapPredictions(
  predictions: PredicaoIaResponse[],
  areas: AreaMonitoradaResponse[],
  summary: DashboardResumoResponse,
  crops: CropPlantingItem[],
): PredictionItem[] {
  const namesByArea = areaLookup(areas, summary);
  const cropByPlantingId = new Map(crops.map((crop) => [crop.idAreaCultura, crop.name]));

  return [...predictions]
    .sort((a, b) => dateTimeMs(b.dataPredicao) - dateTimeMs(a.dataPredicao))
    .map((prediction) => ({
      id: String(prediction.idPredicao),
      idArea: prediction.idArea,
      idAreaCultura: prediction.idAreaCultura,
      sector: namesByArea.get(prediction.idArea) ?? `Área ${prediction.idArea}`,
      cropName: prediction.idAreaCultura ? cropByPlantingId.get(prediction.idAreaCultura) ?? null : null,
      date: formatDateOnly(prediction.dataPredicao),
      type: humanizeEnum(prediction.tipoModelo),
      model: prediction.nomeModelo ?? "Não informado",
      version: prediction.versaoModelo ?? "Não informado",
      status: humanizeEnum(prediction.status),
      productivity: prediction.produtividadePrevista,
      classification: prediction.classificacao ?? "Não informado",
      waterVolumeMm: prediction.volumeAguaSugeridoMm,
      situation: prediction.situacao ?? "Não informado",
      error: prediction.erro,
    }));
}

export { getGreeting, formatTodayPt } from "@/utils/format/date";
