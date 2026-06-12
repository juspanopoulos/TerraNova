import { useMemo, useState } from "react";
import { BrainCircuit, Droplets, Loader2, Sprout } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/ui";
import {
  btnClick,
  cardInset,
  inputField,
  labelMuted,
  textMuted,
  textPrimary,
} from "@/constants/dashboard";
import { ApiRequestError } from "@/lib/api/client";
import { predizerIrrigacao, predizerProdutividade } from "@/lib/api/iaApi";
import {
  inferIrrigationCrop,
  irrigationCropLabel,
  irrigationSituationLabel,
} from "@/lib/dashboard/irrigationModel";
import type {
  DashboardAreaResumoResponse,
  IaIrrigacaoResponse,
  IaProdutividadeResponse,
} from "@/lib/api/types";
import type {
  CompanyProfile,
  CropPlantingItem,
  IrrigationRow,
  PredictionItem,
  SoilSectorState,
  SoilState,
} from "@/types/dashboard";

const REGION_OPTIONS = [
  { value: "North", label: "Norte" },
  { value: "South", label: "Sul" },
  { value: "East", label: "Leste" },
  { value: "West", label: "Oeste" },
];

const PRODUCTIVITY_SOIL_OPTIONS = [
  { value: "Sandy", label: "Arenoso" },
  { value: "Clay", label: "Argiloso" },
  { value: "Loam", label: "Franco" },
  { value: "Silt", label: "Siltoso" },
  { value: "Peaty", label: "Orgânico" },
  { value: "Chalky", label: "Calcário" },
];

const IRRIGATION_SOIL_OPTIONS = [
  { value: "Clay", label: "Argiloso" },
  { value: "Silt", label: "Siltoso" },
  { value: "Sandy", label: "Arenoso" },
  { value: "Loamy", label: "Franco" },
];

const PRODUCTIVITY_CROP_OPTIONS = [
  { value: "Cotton", label: "Algodão" },
  { value: "Rice", label: "Arroz" },
  { value: "Barley", label: "Cevada" },
  { value: "Soybean", label: "Soja" },
  { value: "Wheat", label: "Trigo" },
  { value: "Maize", label: "Milho" },
];

const WEATHER_OPTIONS = [
  { value: "Sunny", label: "Ensolarado" },
  { value: "Rainy", label: "Chuvoso" },
  { value: "Cloudy", label: "Nublado" },
];

const GROWTH_STAGE_OPTIONS = [
  { value: "Vegetative", label: "Vegetativo" },
  { value: "Flowering", label: "Florescimento" },
  { value: "Harvest", label: "Colheita" },
  { value: "Sowing", label: "Semeadura" },
];

const IRRIGATION_TYPE_OPTIONS = [
  { value: "Rainfed", label: "Sequeiro" },
  { value: "Canal", label: "Canal/Sulco" },
  { value: "Drip", label: "Gotejamento" },
  { value: "Sprinkler", label: "Aspersão" },
];

type PredictionStatus = "idle" | "loading" | "success" | "error";

type ProductivityDraft = {
  rainfall_mm: string;
  temperature_celsius: string;
  fertilizer_used: "0" | "1";
  irrigation_used: "0" | "1";
  days_to_harvest: string;
  region: string;
  soil_type: string;
  crop: string;
  weather_condition: string;
};

type IrrigationDraft = {
  soil_type: string;
  soil_moisture: string;
  crop_type: string;
  crop_growth_stage: string;
  irrigation_type: string;
  field_area_hectare: string;
  mulching_used: "No" | "Yes";
  previous_irrigation_mm: string;
  current_water_usage: string;
};

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function productivityClassificationLabel(value: string | null | undefined) {
  const normalized = normalize(value).replace(/[_-]+/g, " ");
  if (!normalized) return "Sem classificação";
  if (["alta", "alto"].includes(normalized)) return "Alta";
  if (["media", "medio", "moderada", "moderado"].includes(normalized)) return "Média";
  if (["baixa", "baixo"].includes(normalized)) return "Baixa";
  if (["boa", "bom"].includes(normalized)) return "Boa";
  return normalized
    .split(" ")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function productivityGuidance(classification: string | null | undefined, productivity: number | null | undefined) {
  const normalized = normalize(classification);
  if (normalized === "alta" || normalized === "boa") {
    return "Manter o manejo atual e acompanhar clima, solo e irrigação até a colheita.";
  }
  if (normalized === "media") {
    return "Revisar irrigação e adubação para tentar elevar a produtividade prevista.";
  }
  if (normalized === "baixa") {
    return "Priorizar diagnóstico de solo, água e clima antes da colheita.";
  }
  if (productivity !== null && productivity !== undefined) {
    return "Acompanhar a lavoura e gerar nova previsão quando houver dados climáticos mais recentes.";
  }
  return "Gere uma nova previsão com dados completos para obter uma orientação.";
}

function formatNumber(value: number | null | undefined, unit = "") {
  if (value === null || value === undefined || Number.isNaN(value)) return "Não informado";
  return `${value.toLocaleString("pt-BR")}${unit ? ` ${unit}` : ""}`;
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiRequestError) return error.message;
  return fallback;
}

function daysUntilHarvest(value: string | null | undefined) {
  if (!value) return 1;
  const harvest = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (Number.isNaN(harvest.getTime())) return 1;
  return Math.max(1, Math.ceil((harvest.getTime() - today.getTime()) / 86_400_000));
}

function inferRegion(location: string) {
  const text = normalize(location);
  if (text.includes("norte") || text.includes("north")) return "North";
  if (text.includes("sul") || text.includes("south")) return "South";
  if (text.includes("leste") || text.includes("east")) return "East";
  if (text.includes("oeste") || text.includes("west")) return "West";
  return "";
}

function inferProductivitySoil(value: string) {
  const text = normalize(value);
  if (text.includes("aren") || text.includes("quartz")) return "Sandy";
  if (text.includes("argil") || text.includes("argissolo")) return "Clay";
  if (text.includes("silt")) return "Silt";
  if (text.includes("organ") || text.includes("peat")) return "Peaty";
  if (text.includes("calc") || text.includes("chalk")) return "Chalky";
  return "Loam";
}

function inferIrrigationSoil(value: string) {
  const soil = inferProductivitySoil(value);
  return soil === "Loam" ? "Loamy" : soil === "Peaty" || soil === "Chalky" ? "Loamy" : soil;
}

function inferProductivityCrop(value: string) {
  const text = normalize(value);
  if (text.includes("algod")) return "Cotton";
  if (text.includes("arroz") || text.includes("rice")) return "Rice";
  if (text.includes("cevada") || text.includes("barley")) return "Barley";
  if (text.includes("soja") || text.includes("soy")) return "Soybean";
  if (text.includes("trigo") || text.includes("wheat")) return "Wheat";
  if (text.includes("milho") || text.includes("maize") || text.includes("corn")) return "Maize";
  return "";
}

function inferGrowthStage(value: string) {
  const text = normalize(value);
  if (text.includes("flor")) return "Flowering";
  if (text.includes("colhe") || text.includes("matura") || text.includes("harvest")) return "Harvest";
  if (text.includes("seme") || text.includes("plant") || text.includes("emerg")) return "Sowing";
  return "Vegetative";
}

function inferIrrigationType(value: string, hasWaterUsage: boolean) {
  const text = normalize(value);
  if (!hasWaterUsage) return "Rainfed";
  if (text.includes("gotej") || text.includes("drip")) return "Drip";
  if (text.includes("aspers") || text.includes("sprink")) return "Sprinkler";
  return "Canal";
}

function inferWeather(rainfall: number) {
  if (rainfall > 1) return "Rainy";
  if (rainfall > 0) return "Cloudy";
  return "Sunny";
}

function latestClimateForArea(
  areaId: number | null,
  areaSummary: DashboardAreaResumoResponse | null,
  selectedArea: DashboardAreaResumoResponse | null,
) {
  if (areaSummary?.ultimoDadoClimatico) return areaSummary.ultimoDadoClimatico;
  if (selectedArea?.idArea === areaId) return selectedArea.ultimoDadoClimatico;
  return null;
}

function fieldId(prefix: string, name: string) {
  return `${prefix}-${name}`;
}

function SmallField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelMuted}>{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function createProductivityDraft({
  crop,
  climate,
  areaSummary,
  selectedArea,
  company,
  irrigation,
}: {
  crop: CropPlantingItem | null;
  climate: { temperature: number };
  areaSummary: DashboardAreaResumoResponse | null;
  selectedArea: DashboardAreaResumoResponse | null;
  company: CompanyProfile;
  irrigation: IrrigationRow | null;
}): ProductivityDraft {
  const climateSource = latestClimateForArea(crop?.idArea ?? null, areaSummary, selectedArea);
  const rainfall = Number(climateSource?.precipitacao ?? 0);
  const temperature = Number(climateSource?.temperatura ?? climate.temperature);
  const irrigationUsed = (irrigation?.currentMm ?? 0) > 0 || (irrigation?.previousMm ?? 0) > 0;

  return {
    rainfall_mm: String(rainfall),
    temperature_celsius: String(temperature),
    fertilizer_used: "0",
    irrigation_used: irrigationUsed ? "1" : "0",
    days_to_harvest: String(daysUntilHarvest(crop?.harvestAtIso)),
    region: inferRegion(company.localizacao),
    soil_type: inferProductivitySoil(areaSummary?.tipoSolo ?? ""),
    crop: inferProductivityCrop(crop?.name ?? ""),
    weather_condition: inferWeather(rainfall),
  };
}

function createIrrigationDraft({
  crop,
  soil,
  soilSector,
  irrigation,
}: {
  crop: CropPlantingItem | null;
  soil: SoilState;
  soilSector: SoilSectorState | null;
  irrigation: IrrigationRow | null;
}): IrrigationDraft {
  const currentWater = irrigation?.currentMm ?? 0;
  const previousWater = irrigation?.previousMm ?? 0;

  return {
    soil_type: inferIrrigationSoil(soilSector?.soilType ?? soil.current.soilType),
    soil_moisture: String(soilSector?.moisture ?? soil.current.moisture),
    crop_type: inferIrrigationCrop(crop?.name ?? ""),
    crop_growth_stage: inferGrowthStage(crop?.stage ?? ""),
    irrigation_type: inferIrrigationType(irrigation?.type ?? "", currentWater > 0 || previousWater > 0),
    field_area_hectare: String(irrigation?.areaHa ?? 0),
    mulching_used: normalize(irrigation?.coverage).includes("sim") ? "Yes" : "No",
    previous_irrigation_mm: String(previousWater),
    current_water_usage: String(currentWater),
  };
}

function CardStatus({
  status,
  message,
}: {
  status: PredictionStatus;
  message: string | null;
}) {
  if (!message) return null;
  return (
    <p
      className={[
        "mt-4 rounded-lg border px-3 py-2 text-sm font-semibold",
        status === "error"
          ? "border-red-500/25 bg-red-500/10 text-red-600"
          : "border-verde-floresta/25 bg-verde-floresta/10 text-verde-floresta",
      ].join(" ")}
      role={status === "error" ? "alert" : "status"}
    >
      {message}
    </p>
  );
}

export function ProductivityPredictionCard({
  crop,
  climate,
  areaSummary,
  selectedArea,
  company,
  irrigation,
  onPredicted,
}: {
  crop: CropPlantingItem | null;
  climate: { temperature: number };
  areaSummary: DashboardAreaResumoResponse | null;
  selectedArea: DashboardAreaResumoResponse | null;
  company: CompanyProfile;
  irrigation: IrrigationRow | null;
  onPredicted: () => Promise<void>;
}) {
  const initialDraft = useMemo(
    () => createProductivityDraft({ crop, climate, areaSummary, selectedArea, company, irrigation }),
    [areaSummary, climate, company, crop, irrigation, selectedArea],
  );
  const [draft, setDraft] = useState<ProductivityDraft>(initialDraft);
  const [status, setStatus] = useState<PredictionStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<IaProdutividadeResponse | null>(null);

  const canPredict = Boolean(crop && draft.region && draft.soil_type && draft.crop && draft.weather_condition);

  const handlePredict = async () => {
    if (!crop || !canPredict) {
      setStatus("error");
      setMessage("Selecione uma cultura e complete os campos necessários para gerar a previsão.");
      return;
    }

    setStatus("loading");
    setMessage(null);
    try {
      const response = await predizerProdutividade({
        idArea: crop.idArea,
        idAreaCultura: crop.idAreaCultura,
        idUsuario: company.idUsuario,
        rainfall_mm: toNumber(draft.rainfall_mm),
        temperature_celsius: toNumber(draft.temperature_celsius),
        fertilizer_used: Number(draft.fertilizer_used),
        irrigation_used: Number(draft.irrigation_used),
        days_to_harvest: Math.max(1, Math.round(toNumber(draft.days_to_harvest))),
        region: draft.region,
        soil_type: draft.soil_type,
        crop: draft.crop,
        weather_condition: draft.weather_condition,
      });
      setResult(response);
      setStatus("success");
      setMessage("Previsão de produtividade gerada com sucesso.");
      await onPredicted();
    } catch (error) {
      setResult(null);
      setStatus("error");
      setMessage(errorMessage(error, "Não foi possível gerar a previsão de produtividade."));
    }
  };
  const resultClassification = result ? productivityClassificationLabel(result.classificacao) : null;
  const resultGuidance = result
    ? productivityGuidance(resultClassification, result.produtividade)
    : null;

  return (
    <DashboardCard className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={labelMuted}>Previsão de Produtividade (IA)</p>
          <h2 className={`mt-1 text-lg font-bold ${textPrimary}`}>
            {result ? `${formatNumber(result.produtividade, "t/ha")}` : crop?.name ?? "Sem plantio selecionado"}
          </h2>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-verde-floresta/10 text-verde-floresta">
          <Sprout className="size-5" aria-hidden />
        </span>
      </div>

      <p className={`mt-3 text-sm leading-relaxed ${textMuted}`}>
        Usa clima, solo, cultura e dias até a colheita para chamar o modelo preditivo e salvar o resultado no histórico.
      </p>

      {result ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className={cardInset}>
            <p className={labelMuted}>Classificação</p>
            <p className={`mt-1 text-lg font-bold ${textPrimary}`}>{resultClassification}</p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>Modelo</p>
            <p className={`mt-1 text-lg font-bold ${textPrimary}`}>GS-M1</p>
          </div>
          <div className={`${cardInset} col-span-2`}>
            <p className={labelMuted}>Orientação</p>
            <p className={`mt-1 text-sm leading-relaxed ${textPrimary}`}>{resultGuidance}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SmallField label="Chuva (mm)">
          <input
            id={fieldId("prod", "rainfall")}
            className={inputField}
            type="number"
            min="0"
            step="0.01"
            value={draft.rainfall_mm}
            onChange={(event) => setDraft({ ...draft, rainfall_mm: event.target.value })}
          />
        </SmallField>
        <SmallField label="Temperatura (C)">
          <input
            id={fieldId("prod", "temperature")}
            className={inputField}
            type="number"
            step="0.01"
            value={draft.temperature_celsius}
            onChange={(event) => setDraft({ ...draft, temperature_celsius: event.target.value })}
          />
        </SmallField>
        <SmallField label="Região">
          <select
            className={inputField}
            value={draft.region}
            onChange={(event) => setDraft({ ...draft, region: event.target.value })}
          >
            <option value="">Selecione</option>
            {REGION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </SmallField>
        <SmallField label="Condição climática">
          <select
            className={inputField}
            value={draft.weather_condition}
            onChange={(event) => setDraft({ ...draft, weather_condition: event.target.value })}
          >
            {WEATHER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </SmallField>
        <SmallField label="Tipo de solo">
          <select
            className={inputField}
            value={draft.soil_type}
            onChange={(event) => setDraft({ ...draft, soil_type: event.target.value })}
          >
            {PRODUCTIVITY_SOIL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </SmallField>
        <SmallField label="Cultura">
          <select
            className={inputField}
            value={draft.crop}
            onChange={(event) => setDraft({ ...draft, crop: event.target.value })}
          >
            <option value="">Selecione</option>
            {PRODUCTIVITY_CROP_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </SmallField>
        <SmallField label="Fertilizante">
          <select
            className={inputField}
            value={draft.fertilizer_used}
            onChange={(event) => setDraft({ ...draft, fertilizer_used: event.target.value as "0" | "1" })}
          >
            <option value="0">Não</option>
            <option value="1">Sim</option>
          </select>
        </SmallField>
        <SmallField label="Irrigação">
          <select
            className={inputField}
            value={draft.irrigation_used}
            onChange={(event) => setDraft({ ...draft, irrigation_used: event.target.value as "0" | "1" })}
          >
            <option value="0">Não</option>
            <option value="1">Sim</option>
          </select>
        </SmallField>
        <div className="sm:col-span-2">
          <SmallField label="Dias até colheita">
            <input
              className={inputField}
              type="number"
              min="1"
              step="1"
              value={draft.days_to_harvest}
              onChange={(event) => setDraft({ ...draft, days_to_harvest: event.target.value })}
            />
          </SmallField>
        </div>
      </div>

      <CardStatus status={status} message={message} />

      <button
        type="button"
        disabled={status === "loading" || !canPredict}
        onClick={() => void handlePredict()}
        className={`${btnClick} mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-verde-floresta px-4 py-2 text-sm font-semibold text-bege-natural hover:bg-verde-floresta/90 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {status === "loading" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <BrainCircuit className="size-4" aria-hidden />}
        {status === "loading" ? "Gerando previsão..." : "Gerar previsão"}
      </button>
    </DashboardCard>
  );
}

export function IrrigationPredictionCard({
  crop,
  selectedCropName,
  company,
  soil,
  soilSector,
  irrigation,
  latestPrediction,
  onPredicted,
}: {
  crop: CropPlantingItem | null;
  selectedCropName?: string | null;
  company: CompanyProfile;
  soil: SoilState;
  soilSector: SoilSectorState | null;
  irrigation: IrrigationRow | null;
  latestPrediction: PredictionItem | null;
  onPredicted: () => Promise<void>;
}) {
  const initialDraft = useMemo(
    () => createIrrigationDraft({ crop, soil, soilSector, irrigation }),
    [crop, irrigation, soil, soilSector],
  );
  const [draft, setDraft] = useState<IrrigationDraft>(initialDraft);
  const [status, setStatus] = useState<PredictionStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<IaIrrigacaoResponse | null>(null);

  const missingCoordinates = company.latitude === null || company.longitude === null;
  const unsupportedSelectedCrop = Boolean(selectedCropName && !crop);
  const selectedModelCrop = crop ? inferIrrigationCrop(crop.name) : "";
  const canPredict = Boolean(
    crop &&
    irrigation &&
    !missingCoordinates &&
    selectedModelCrop &&
    draft.soil_type &&
    draft.crop_type &&
    draft.crop_growth_stage &&
    draft.irrigation_type,
  );

  const handlePredict = async () => {
    if (!crop || !irrigation || missingCoordinates || !canPredict) {
      setStatus("error");
      setMessage("Complete área, coordenadas, plantio e dados de irrigação antes de gerar a recomendação.");
      return;
    }

    setStatus("loading");
    setMessage(null);
    try {
      const latitude = company.latitude;
      const longitude = company.longitude;
      if (latitude === null || longitude === null) {
        throw new Error("Coordenadas da propriedade não informadas.");
      }

      const response = await predizerIrrigacao({
        idArea: crop.idArea,
        idAreaCultura: crop.idAreaCultura,
        idUsuario: company.idUsuario,
        latitude,
        longitude,
        soil_type: draft.soil_type,
        soil_moisture: toNumber(draft.soil_moisture),
        crop_type: draft.crop_type,
        crop_growth_stage: draft.crop_growth_stage,
        irrigation_type: draft.irrigation_type,
        field_area_hectare: toNumber(draft.field_area_hectare),
        mulching_used: draft.mulching_used,
        previous_irrigation_mm: toNumber(draft.previous_irrigation_mm),
        current_water_usage: toNumber(draft.current_water_usage),
      });
      setResult(response);
      setStatus("success");
      setMessage("Predição de irrigação gerada com sucesso.");
      await onPredicted();
    } catch (error) {
      setResult(null);
      setStatus("error");
      setMessage(errorMessage(error, "Não foi possível gerar a predição de irrigação."));
    }
  };
  const visibleRecommendation = result?.recomendado ?? latestPrediction?.waterVolumeMm ?? null;
  const visibleSituation = result
    ? irrigationSituationLabel(result.situacao)
    : latestPrediction?.situation ?? null;
  const hasVisiblePrediction = visibleRecommendation !== null || Boolean(visibleSituation);

  return (
    <DashboardCard className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={labelMuted}>Predição de irrigação</p>
          <h2 className={`mt-1 text-lg font-bold ${textPrimary}`}>
            {visibleRecommendation !== null
              ? formatNumber(visibleRecommendation, "mm")
              : crop?.name ?? (unsupportedSelectedCrop ? "Cultura incompatível" : "Sem plantio selecionado")}
          </h2>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-verde-floresta/10 text-verde-floresta">
          <Droplets className="size-5" aria-hidden />
        </span>
      </div>

      <p className={`mt-3 text-sm leading-relaxed ${textMuted}`}>
        Recomenda água usando solo, plantio, irrigação, área e coordenadas da propriedade.
      </p>

      {hasVisiblePrediction ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className={cardInset}>
            <p className={labelMuted}>Água recomendada</p>
            <p className={`mt-1 text-lg font-bold ${textPrimary}`}>
              {formatNumber(visibleRecommendation, "mm")}
            </p>
          </div>
          <div className={cardInset}>
            <p className={labelMuted}>{result ? "Consumo atual" : "Última predição"}</p>
            <p className={`mt-1 text-lg font-bold ${textPrimary}`}>
              {result ? formatNumber(result.consumo_atual, "mm") : latestPrediction?.date || "Salva"}
            </p>
          </div>
          <div className={`${cardInset} col-span-2`}>
            <p className={labelMuted}>Situação</p>
            <p className={`mt-1 text-sm font-bold ${textPrimary}`}>{visibleSituation ?? "Não informada"}</p>
          </div>
        </div>
      ) : null}
      {hasVisiblePrediction ? (
        <p className={`mt-3 text-xs leading-relaxed ${textMuted}`}>
          {result
            ? "Resultado salvo no histórico de predições de irrigação abaixo."
            : "Exibindo a última predição de irrigação salva para esta área."}
        </p>
      ) : null}

      {missingCoordinates ? (
        <p className={`mt-4 text-sm ${textMuted}`}>
          Informe latitude e longitude da propriedade para habilitar a predição.
        </p>
      ) : null}
      {unsupportedSelectedCrop ? (
        <p
          className="mt-4 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-600"
          role="alert"
        >
          A cultura {selectedCropName} não é aceita pelo modelo de irrigação. Selecione um plantio de
          trigo, milho, algodão, arroz, cana-de-açúcar ou batata para gerar a predição.
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SmallField label="Tipo de solo">
          <select
            className={inputField}
            value={draft.soil_type}
            onChange={(event) => setDraft({ ...draft, soil_type: event.target.value })}
          >
            {IRRIGATION_SOIL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </SmallField>
        <SmallField label="Umidade do solo (%)">
          <input
            className={inputField}
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={draft.soil_moisture}
            onChange={(event) => setDraft({ ...draft, soil_moisture: event.target.value })}
          />
        </SmallField>
        <SmallField label="Cultura usada pelo modelo">
          <input
            className={`${inputField} cursor-not-allowed opacity-80`}
            type="text"
            readOnly
            value={draft.crop_type ? irrigationCropLabel(draft.crop_type) : "Não compatível"}
          />
        </SmallField>
        <SmallField label="Estágio">
          <select
            className={inputField}
            value={draft.crop_growth_stage}
            onChange={(event) => setDraft({ ...draft, crop_growth_stage: event.target.value })}
          >
            {GROWTH_STAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </SmallField>
        <SmallField label="Irrigação">
          <select
            className={inputField}
            value={draft.irrigation_type}
            onChange={(event) => setDraft({ ...draft, irrigation_type: event.target.value })}
          >
            {IRRIGATION_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </SmallField>
        <SmallField label="Cobertura de solo">
          <select
            className={inputField}
            value={draft.mulching_used}
            onChange={(event) => setDraft({ ...draft, mulching_used: event.target.value as "No" | "Yes" })}
          >
            <option value="No">Não</option>
            <option value="Yes">Sim</option>
          </select>
        </SmallField>
        <SmallField label="Área (ha)">
          <input
            className={inputField}
            type="number"
            min="0"
            step="0.01"
            value={draft.field_area_hectare}
            onChange={(event) => setDraft({ ...draft, field_area_hectare: event.target.value })}
          />
        </SmallField>
        <SmallField label="Irrigação anterior (mm)">
          <input
            className={inputField}
            type="number"
            min="0"
            step="0.01"
            value={draft.previous_irrigation_mm}
            onChange={(event) => setDraft({ ...draft, previous_irrigation_mm: event.target.value })}
          />
        </SmallField>
        <div className="sm:col-span-2">
          <SmallField label="Consumo atual (mm)">
            <input
              className={inputField}
              type="number"
              min="0"
              step="0.01"
              value={draft.current_water_usage}
              onChange={(event) => setDraft({ ...draft, current_water_usage: event.target.value })}
            />
          </SmallField>
        </div>
      </div>

      <CardStatus status={status} message={message} />

      <button
        type="button"
        disabled={status === "loading" || !canPredict}
        onClick={() => void handlePredict()}
        className={`${btnClick} mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-verde-floresta px-4 py-2 text-sm font-semibold text-bege-natural hover:bg-verde-floresta/90 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {status === "loading" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <BrainCircuit className="size-4" aria-hidden />}
        {status === "loading" ? "Gerando predição..." : "Gerar predição"}
      </button>
    </DashboardCard>
  );
}
