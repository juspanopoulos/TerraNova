import { levelLabel, VISION_PAGE_TITLES } from "@/constants/dashboard";
import type { CompanyProfile } from "@/types/dashboard";
import type { TimeFilter } from "@/types/dashboard";
import {
  getVisionAlerts,
  getVisionClimateSnapshot,
  getVisionCrops,
  getVisionIrrigationRows,
  getVisionSoilSnapshot,
  getVisionSummaryKpis,
  getVisionWaterDistribution,
  getVisionWaterHistory,
} from "@/lib/dashboard/visionDetail";
import { filterLabel } from "@/lib/dashboard/helpers";

const PERIOD_SLUG: Record<TimeFilter, string> = {
  daily: "visao-do-dia",
  weekly: "visao-semanal",
  monthly: "visao-do-mes",
  yearly: "visao-anual",
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
    avgMaturity: number;
    criticalAlerts: number;
    totalAlerts: number;
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
    consumptionLiters: number;
    savingsLiters: number;
    efficiency: number;
    distribution: { label: string; value: number; detail: string }[];
    history: { labels: string[]; values: number[] };
    irrigation: { sector: string; used: number; target: number; efficiency: number }[];
  };
  soil: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    moisture: number;
    ph: number;
    sectors: { sector: string; moisture: number; ph: number; status: string }[];
  };
  crops: {
    name: string;
    zone: string;
    maturity: number;
    week: string;
    estimate: string;
    status: string;
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
  company: CompanyProfile,
): VisionReportData {
  const kpis = getVisionSummaryKpis(timeFilter);
  const climate = getVisionClimateSnapshot(timeFilter);
  const water = kpis.water;
  const waterHistory = getVisionWaterHistory(timeFilter);
  const waterDistribution = getVisionWaterDistribution(timeFilter);
  const soil = getVisionSoilSnapshot(timeFilter);
  const crops = getVisionCrops(timeFilter);
  const alerts = getVisionAlerts(timeFilter);
  const irrigation = getVisionIrrigationRows(timeFilter);
  const periodLabel = filterLabel(timeFilter);

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
    farmName: company.farmName,
    farmRegion: company.farmRegion,
    responsibleName: company.responsibleName,
    totalAreaHa: company.totalAreaHa,
    activeSectors: company.activeSectors,
    kpis: {
      temperature: climate.temperature,
      soilMoisture: soil.moisture,
      avgMaturity: kpis.avgMaturity,
      criticalAlerts: kpis.criticalCount,
      totalAlerts: kpis.alertTotal,
    },
    climate: {
      temperature: climate.temperature,
      humidity: climate.humidity,
      wind: climate.wind,
      history: climate.history,
    },
    water: {
      consumptionLiters: water.consumptionLiters,
      savingsLiters: water.savingsLiters,
      efficiency: water.efficiency,
      distribution: waterDistribution.map((d) => ({
        label: d.label,
        value: d.value,
        detail: d.detail,
      })),
      history: waterHistory,
      irrigation,
    },
    soil: {
      nitrogen: soil.nitrogen,
      phosphorus: soil.phosphorus,
      potassium: soil.potassium,
      moisture: soil.moisture,
      ph: soil.ph,
      sectors: soil.sectors,
    },
    crops: crops.map((c) => ({
      name: c.name,
      zone: c.zone,
      maturity: c.maturity,
      week: c.week,
      estimate: c.estimate,
      status: c.status,
    })),
    alerts: alerts.map((a) => ({
      level: a.level,
      levelLabel: levelLabel[a.level],
      title: a.title,
      type: a.type,
      sector: a.sector,
      time: a.time,
      summary: a.summary,
    })),
  };
}

export function visionReportFilename(data: VisionReportData) {
  const date = new Date().toISOString().slice(0, 10);
  const farm = data.farmName.replace(/\s+/g, "-").replace(/[^\w-]/g, "");
  return `TerraNova-${data.periodSlug}-${farm}-${date}.pdf`;
}
