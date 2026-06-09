import { levelLabel, VISION_PAGE_TITLES } from "@/constants/dashboard";
import { filterLabel } from "@/lib/dashboard/helpers";
import type { AreaMonitoradaResponse, DashboardResumoResponse } from "@/lib/api/types";
import type {
  AlertItem,
  ClimateHistoryState,
  ClimateState,
  CompanyProfile,
  CropPlantingItem,
  PredictionItem,
  SoilState,
  TimeFilter,
  WaterState,
} from "@/types/dashboard";

const PERIOD_SLUG: Record<TimeFilter, string> = {
  daily: "visao-do-dia",
  weekly: "visao-semanal",
  monthly: "visao-do-mes",
  yearly: "visao-anual",
};

export type VisionReportSource = {
  company: CompanyProfile;
  dashboardSummary: DashboardResumoResponse | null;
  dashboardAreas: AreaMonitoradaResponse[];
  climate: ClimateState;
  climateHistory: ClimateHistoryState;
  soil: SoilState;
  water: WaterState;
  crops: CropPlantingItem[];
  predictions: PredictionItem[];
  alerts: AlertItem[];
};

export type VisionReportData = {
  periodTitle: string;
  periodLabel: string;
  periodSlug: string;
  generatedAt: string;
  farmName: string;
  farmRegion: string;
  responsibleName: string;
  totalAreaHa: number;
  activeSectors: number;
  kpis: {
    temperature: number;
    soilMoisture: number;
    activePlantings: number;
    criticalAlerts: number;
    totalAlerts: number;
    predictions: number;
  };
  climate: {
    temperature: number;
    humidity: number;
    wind: number;
    history: {
      labels: string[];
      temperature: number[];
      humidity: number[];
      wind: number[];
    };
  };
  water: {
    consumptionMm: number;
    previousMm: number;
    type: string;
    origin: string;
    distribution: { label: string; value: number; detail: string }[];
    history: { labels: string[]; values: number[] };
    irrigation: {
      sector: string;
      type: string;
      currentMm: number;
      previousMm: number;
      origin: string;
    }[];
  };
  soil: {
    moisture: number;
    soilType: string;
    source: string;
    collectedAt: string;
    sectors: {
      sector: string;
      moisture: number;
      soilType: string;
      source: string;
      status: string;
    }[];
  };
  crops: {
    name: string;
    zone: string;
    stage: string;
    plantedAt: string;
    harvestAt: string;
    waterNeedMm: number | null;
    status: string;
  }[];
  predictions: {
    date: string;
    sector: string;
    cropName: string | null;
    type: string;
    productivity: number | null;
    classification: string;
    waterVolumeMm: number | null;
    situation: string;
  }[];
  alerts: {
    level: string;
    levelLabel: string;
    title: string;
    type: string;
    sector: string;
    time: string;
    summary: string;
  }[];
};

export function buildVisionReportData(
  timeFilter: TimeFilter,
  source: VisionReportSource,
): VisionReportData {
  const periodLabel = filterLabel(timeFilter);
  const totalAreaHa = Math.round(
    source.dashboardAreas.reduce((sum, area) => sum + Number(area.areaHectares ?? 0), 0),
  );
  const criticalAlerts = source.alerts.filter((alert) => alert.level === "critical").length;

  return {
    periodTitle: VISION_PAGE_TITLES[timeFilter],
    periodLabel,
    periodSlug: PERIOD_SLUG[timeFilter],
    generatedAt: new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    farmName: source.company.farmName,
    farmRegion: source.company.farmRegion,
    responsibleName: source.company.responsibleName,
    totalAreaHa: totalAreaHa > 0 ? totalAreaHa : source.company.totalAreaHa,
    activeSectors: source.dashboardSummary?.indicadores.totalAreas ?? source.company.activeSectors,
    kpis: {
      temperature: source.climate.temperature,
      soilMoisture: source.soil.current.moisture,
      activePlantings: source.crops.length,
      criticalAlerts,
      totalAlerts: source.alerts.length,
      predictions: source.predictions.length,
    },
    climate: {
      temperature: source.climate.temperature,
      humidity: source.climate.humidity,
      wind: source.climate.wind,
      history: source.climateHistory[timeFilter],
    },
    water: {
      consumptionMm: source.water.current.consumptionMm,
      previousMm: source.water.current.previousMm,
      type: source.water.current.type,
      origin: source.water.current.origin,
      distribution: source.water.distribution.map((d) => ({
        label: d.label,
        value: d.value,
        detail: d.detail,
      })),
      history: source.water.history[timeFilter],
      irrigation: source.water.irrigation.map((row) => ({
        sector: row.sector,
        type: row.type,
        currentMm: row.currentMm,
        previousMm: row.previousMm,
        origin: row.origin,
      })),
    },
    soil: {
      moisture: source.soil.current.moisture,
      soilType: source.soil.current.soilType,
      source: source.soil.current.source,
      collectedAt: source.soil.current.collectedAt,
      sectors: source.soil.sectors.map((sector) => ({
        sector: sector.sector,
        moisture: sector.moisture,
        soilType: sector.soilType,
        source: sector.source,
        status: sector.status,
      })),
    },
    crops: source.crops.map((crop) => ({
      name: crop.name,
      zone: crop.zone,
      stage: crop.stage,
      plantedAt: crop.plantedAt,
      harvestAt: crop.harvestAt,
      waterNeedMm: crop.waterNeedMm,
      status: crop.status,
    })),
    predictions: source.predictions.map((prediction) => ({
      date: prediction.date,
      sector: prediction.sector,
      cropName: prediction.cropName,
      type: prediction.type,
      productivity: prediction.productivity,
      classification: prediction.classification,
      waterVolumeMm: prediction.waterVolumeMm,
      situation: prediction.situation,
    })),
    alerts: source.alerts.map((alert) => ({
      level: alert.level,
      levelLabel: levelLabel[alert.level],
      title: alert.title,
      type: alert.type,
      sector: alert.sector,
      time: alert.time,
      summary: alert.summary,
    })),
  };
}

export function visionReportFilename(data: VisionReportData) {
  const date = new Date().toISOString().slice(0, 10);
  const farm = data.farmName.replace(/\s+/g, "-").replace(/[^\w-]/g, "");
  return `TerraNova-${data.periodSlug}-${farm}-${date}.pdf`;
}
