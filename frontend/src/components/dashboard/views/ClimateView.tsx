import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, CloudSun, Droplets, Loader2, Thermometer, Wind } from "lucide-react";
import { ClimateAreaChart } from "@/components/dashboard/charts";
import { DashboardCard } from "@/components/dashboard/ui";
import { btnClick, cardBase, gridCols3, labelMuted, textMuted, textPrimary } from "@/constants/dashboard";
import { useDashboard } from "@/context/DashboardContext";
import { ApiRequestError } from "@/lib/api/client";
import { coletarClimaNasa } from "@/lib/api/climateApi";
import { climateMetricColor } from "@/lib/dashboard/chartTheme";
import type { DadoClimaticoResponse } from "@/lib/api/types";

const NASA_COLLECTION_TIME_ZONE = "America/Sao_Paulo";
const DATE_TIME_WITH_OFFSET_PATTERN = /(?:Z|[+-]\d{2}:?\d{2})$/i;

function toUtcIsoDate(date: Date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function datePartsInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(date);
  const valueByType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    day: Number(valueByType.day),
    month: Number(valueByType.month),
    year: Number(valueByType.year),
  };
}

function parseCalendarDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseCollectionDate(value: string | null | undefined, source?: string | null) {
  if (!value) return null;
  if (!value.includes("T")) return parseCalendarDate(value);

  const normalized =
    source === "NASA" && !DATE_TIME_WITH_OFFSET_PATTERN.test(value) ? `${value}Z` : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value: string | null | undefined, source?: string | null) {
  const date = parseCollectionDate(value, source);
  if (!date) return "Não informada";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(source === "NASA" && value?.includes("T") ? { timeZone: NASA_COLLECTION_TIME_ZONE } : {}),
  }).format(date);
}

function formatTime(value: string | null | undefined, source?: string | null) {
  if (!value || !value.includes("T")) return "Não informado";
  const date = parseCollectionDate(value, source);
  if (!date) return "Não informado";
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    ...(source === "NASA" ? { timeZone: NASA_COLLECTION_TIME_ZONE } : {}),
  }).format(date);
}

function formatOptionalNumber(value: number | null | undefined, unit: string) {
  if (value === null || value === undefined) return "Não informado";
  return `${Number(value).toLocaleString("pt-BR")} ${unit}`;
}

function sourceLabel(source: string | null | undefined) {
  if (source === "NASA") return "NASA POWER";
  if (!source) return "Não informada";
  return source
    .toLowerCase()
    .split("_")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function nasaReferenceDate() {
  const { day, month, year } = datePartsInTimeZone(new Date(), NASA_COLLECTION_TIME_ZONE);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - 5);
  return toUtcIsoDate(date);
}

function isSameDate(value: string | null | undefined, isoDate: string) {
  return Boolean(value && value.slice(0, 10) === isoDate);
}

function errorMessageFromApi(error: unknown) {
  if (error instanceof ApiRequestError) return error.message;
  return "Não foi possível consultar a NASA POWER agora.";
}

function ClimateDataCard({
  latestClimate,
  collecting,
  collectionError,
  missingCoordinates,
  hasArea,
}: {
  latestClimate: DadoClimaticoResponse | null;
  collecting: boolean;
  collectionError: string | null;
  missingCoordinates: boolean;
  hasArea: boolean;
}) {
  const status = collecting
    ? "Atualizando"
    : collectionError || missingCoordinates || !hasArea
      ? "Atenção"
      : latestClimate
        ? "Atualizado"
        : "Sem dados";
  const StatusIcon = collecting ? Loader2 : status === "Atualizado" ? CheckCircle2 : AlertCircle;

  return (
    <DashboardCard className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={labelMuted}>Dados climáticos</p>
          <h2 className={`mt-1 text-lg font-bold ${textPrimary}`}>{status}</h2>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-verde-floresta/10 text-verde-floresta">
          <CloudSun className="size-5" aria-hidden />
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[var(--db-text)]">
        <StatusIcon className={`size-4 ${collecting ? "animate-spin" : ""}`} aria-hidden />
        <span>{collecting ? "Buscando dados na NASA POWER..." : `Fonte: ${sourceLabel(latestClimate?.fonteApi)}`}</span>
      </div>

      {missingCoordinates ? (
        <p className={`mt-4 text-sm leading-relaxed ${textMuted}`}>
          Informe latitude e longitude da propriedade para consultar a NASA POWER.
        </p>
      ) : null}
      {!hasArea ? (
        <p className={`mt-4 text-sm leading-relaxed ${textMuted}`}>
          Cadastre uma área monitorada para habilitar a coleta climática.
        </p>
      ) : null}
      {collectionError ? (
        <p className="mt-4 text-sm font-semibold text-red-600" role="alert">
          {collectionError}
        </p>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <p className={labelMuted}>Dados referentes a</p>
          <p className={`mt-1 font-semibold ${textPrimary}`}>{formatDate(latestClimate?.dataReferencia)}</p>
        </div>
        <div>
          <p className={labelMuted}>Última coleta</p>
          <p className={`mt-1 font-semibold ${textPrimary}`}>
            {formatDate(latestClimate?.dataColeta, latestClimate?.fonteApi)}
          </p>
        </div>
        <div>
          <p className={labelMuted}>Horário da coleta</p>
          <p className={`mt-1 font-semibold ${textPrimary}`}>
            {formatTime(latestClimate?.dataColeta, latestClimate?.fonteApi)}
          </p>
        </div>
        <div>
          <p className={labelMuted}>Temperatura</p>
          <p className={`mt-1 font-semibold ${textPrimary}`}>{formatOptionalNumber(latestClimate?.temperatura, "°C")}</p>
        </div>
        <div>
          <p className={labelMuted}>Umidade</p>
          <p className={`mt-1 font-semibold ${textPrimary}`}>{formatOptionalNumber(latestClimate?.umidade, "%")}</p>
        </div>
        <div>
          <p className={labelMuted}>Precipitação</p>
          <p className={`mt-1 font-semibold ${textPrimary}`}>{formatOptionalNumber(latestClimate?.precipitacao, "mm")}</p>
        </div>
        <div>
          <p className={labelMuted}>Vento</p>
          <p className={`mt-1 font-semibold ${textPrimary}`}>
            {formatOptionalNumber(latestClimate?.velocidadeVentoKmh, "km/h")}
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}

export function ClimateView() {
  const {
    climate,
    climateHistory,
    preferences,
    pageTimeFilter,
    selectedArea,
    dashboardAreas,
    company,
    reloadDashboard,
  } = useDashboard();
  const history = climateHistory[pageTimeFilter];
  const [metric, setMetric] = useState<"temperature" | "humidity" | "wind">("temperature");
  const [collecting, setCollecting] = useState(false);
  const [collectionError, setCollectionError] = useState<string | null>(null);
  const attemptedCollectionsRef = useRef(new Set<string>());

  const areaId = selectedArea?.idArea ?? dashboardAreas[0]?.idArea ?? null;
  const latestClimate = selectedArea?.ultimoDadoClimatico ?? null;
  const referenceDate = useMemo(() => nasaReferenceDate(), []);
  const missingCoordinates = company.latitude === null || company.longitude === null;
  const hasTargetNasaData =
    latestClimate?.fonteApi === "NASA" && isSameDate(latestClimate.dataReferencia, referenceDate);
  const visibleCollectionError = areaId && !missingCoordinates ? collectionError : null;

  useEffect(() => {
    if (!areaId || missingCoordinates || hasTargetNasaData) return;

    const attemptKey = `${areaId}-${referenceDate}`;
    if (attemptedCollectionsRef.current.has(attemptKey)) return;
    attemptedCollectionsRef.current.add(attemptKey);

    let cancelled = false;

    void Promise.resolve()
      .then(() => {
        if (cancelled) return null;
        setCollecting(true);
        setCollectionError(null);
        return coletarClimaNasa(areaId, referenceDate);
      })
      .then(async () => {
        if (cancelled) return;
        await reloadDashboard();
      })
      .catch((error) => {
        if (cancelled) return;
        setCollectionError(errorMessageFromApi(error));
      })
      .finally(() => {
        if (cancelled) return;
        setCollecting(false);
      });

    return () => {
      cancelled = true;
    };
  }, [areaId, hasTargetNasaData, missingCoordinates, referenceDate, reloadDashboard]);

  const metrics = useMemo(
    () => [
      {
        key: "temperature" as const,
        label: "Temperatura",
        cardLabel: "Temperatura Hoje",
        value: `${climate.temperature.toFixed(1)}°C`,
        icon: Thermometer,
        data: history.temperature,
        unit: "°C",
        color: climateMetricColor("temperature", preferences.darkMode),
      },
      {
        key: "humidity" as const,
        label: "Umidade",
        cardLabel: "Umidade Hoje",
        value: `${Math.round(climate.humidity)}%`,
        icon: Droplets,
        data: history.humidity,
        unit: "%",
        color: climateMetricColor("humidity", preferences.darkMode),
      },
      {
        key: "wind" as const,
        label: "Vento",
        cardLabel: "Vento Hoje",
        value: `${climate.wind.toFixed(1)} km/h`,
        icon: Wind,
        data: history.wind,
        unit: " km/h",
        color: climateMetricColor("wind", preferences.darkMode),
      },
    ],
    [climate, history, preferences.darkMode],
  );

  const active = metrics.find((m) => m.key === metric) ?? metrics[0];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className={gridCols3}>
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setMetric(m.key)}
              className={[
                btnClick,
                cardBase,
                "text-left",
                metric === m.key && "ring-2 ring-verde-floresta/25",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <p className={labelMuted}>{m.cardLabel}</p>
                <Icon className="size-4 text-verde-floresta/50" />
              </div>
              <p className={`mt-2 text-2xl font-bold tabular-nums ${textPrimary}`}>{m.value}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
        <DashboardCard>
          <ClimateAreaChart
            label={`Histórico de ${active.label}`}
            values={active.data}
            labels={history.labels}
            unit={active.unit}
            color={active.color}
          />
        </DashboardCard>
        <ClimateDataCard
          latestClimate={latestClimate}
          collecting={collecting}
          collectionError={visibleCollectionError}
          missingCoordinates={missingCoordinates}
          hasArea={Boolean(areaId)}
        />
      </div>
    </div>
  );
}
