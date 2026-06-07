import { useState, type MouseEvent as ReactMouseEvent } from "react";
import {
  ChartTooltip,
  CursorTooltip,
  cursorPointIn,
} from "@/components/dashboard/chartTooltips";
import {
  btnClick,
  chartDetailPanel,
  chartMotion,
  labelMuted,
  textFaint,
  textMuted,
  textPrimary,
  tooltipSurface,
} from "@/constants/dashboard";
import { MOCK_DASHBOARD_DATA } from "@/data/mockDashboard";
import { useDashboard } from "@/context/DashboardContext";
import { chartSegmentColor } from "@/lib/dashboard/chartTheme";
import type { ChartSegment, DonutLegendLayout } from "@/types/dashboard";

export function ChartDetailPanel({ title, detail }: { title: string; detail: string }) {
  return (
    <div className={`${chartDetailPanel} ${chartMotion}`}>
      <p className="text-sm font-bold text-verde-floresta">{title}</p>
      <p className={`mt-1.5 text-sm leading-relaxed ${textMuted}`}>{detail}</p>
    </div>
  );
}

export function DonutChart({
  segments,
  size = 200,
  strokeWidth = 24,
  centerValue,
  centerLabel,
  selectedId,
  onSelect,
  legendLayout = "vertical",
}: {
  segments: ChartSegment[];
  size?: number;
  strokeWidth?: number;
  centerValue: string;
  centerLabel: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  legendLayout?: DonutLegendLayout;
}) {
  const { preferences } = useDashboard();
  const darkMode = preferences.darkMode;
  const [hovered, setHovered] = useState<{ id: string; x: number; y: number } | null>(null);
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let accumulated = 0;
  const selected = segments.find((s) => s.id === selectedId);
  const hoveredSeg = hovered ? segments.find((s) => s.id === hovered.id) : null;

  const handleSegmentHover = (segId: string, event: ReactMouseEvent<SVGCircleElement>) => {
    const root = event.currentTarget.closest("[data-chart-root]") as HTMLElement | null;
    if (!root) return;
    const point = cursorPointIn(root, event);
    setHovered({ id: segId, x: point.x, y: point.y });
  };

  const renderLegendButton = (seg: ChartSegment, showPctInline: boolean) => {
    const pct = ((seg.value / total) * 100).toFixed(0);
    return (
      <button
        key={seg.id}
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onSelect(selectedId === seg.id ? null : seg.id)}
        className={[
          btnClick,
          "outline-none focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-floresta/40",
          legendLayout === "horizontal"
            ? "flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-center"
            : "flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm",
          selectedId === seg.id ? "bg-verde-floresta/10" : "hover:bg-[var(--db-hover)]",
        ].join(" ")}
      >
        <span
          className={[
            "flex items-center gap-2",
            legendLayout === "horizontal" ? "justify-center" : "",
          ].join(" ")}
        >
          <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: chartSegmentColor(seg.color, darkMode) }} />
          <span className={`text-xs sm:text-sm ${textMuted}`}>{seg.label}</span>
        </span>
        {showPctInline && (
          <span className={`font-bold tabular-nums ${textPrimary}`}>{pct}%</span>
        )}
      </button>
    );
  };

  return (
    <div>
      <div
        className={[
          "relative flex flex-col items-center gap-4",
          legendLayout === "vertical" ? "sm:flex-row sm:items-center sm:gap-8" : "",
        ].join(" ")}
      >
        <div
          className="relative shrink-0 select-none"
          style={{ width: size, height: size }}
          data-chart-root
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90 outline-none [&_*]:outline-none"
          >
            <circle
              cx={cx}
              cy={cx}
              r={r}
              fill="none"
              stroke="var(--db-chart-track)"
              strokeWidth={strokeWidth}
            />
            {segments.map((seg) => {
              const dash = (seg.value / total) * circumference;
              const offset = accumulated;
              accumulated += dash;
              const active = selectedId === seg.id || hovered?.id === seg.id;
              const dimmed = selectedId !== null && selectedId !== seg.id;
              return (
                <circle
                  key={seg.id}
                  cx={cx}
                  cy={cx}
                  r={r}
                  fill="none"
                  stroke={chartSegmentColor(seg.color, darkMode)}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                  className="cursor-pointer transition-opacity duration-200 ease-out"
                  style={{
                    opacity: dimmed ? 0.38 : active ? 1 : 0.82,
                  }}
                  onMouseMove={(e) => handleSegmentHover(seg.id, e)}
                  onMouseLeave={() => setHovered(null)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelect(selectedId === seg.id ? null : seg.id)}
                  aria-hidden
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-2xl font-bold tabular-nums ${textPrimary}`}>{centerValue}</span>
            <span className={`mt-0.5 text-[10px] font-semibold uppercase tracking-wide sm:text-xs ${textFaint}`}>
              {centerLabel}
            </span>
          </div>
          {hovered && hoveredSeg && (
            <ChartTooltip
              x={hovered.x}
              y={hovered.y}
              label={hoveredSeg.label}
              value={`${((hoveredSeg.value / total) * 100).toFixed(0)}%`}
              detail={hoveredSeg.detail}
            />
          )}
        </div>

        {legendLayout === "vertical" ? (
          <ul className="grid w-full gap-2 sm:max-w-xs">
            {segments.map((seg) => (
              <li key={seg.id}>{renderLegendButton(seg, true)}</li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-wrap items-start justify-center gap-x-4 gap-y-3">
            {segments.map((seg) => {
              const pct = ((seg.value / total) * 100).toFixed(0);
              return (
                <div key={seg.id} className="flex flex-col items-center gap-1">
                  {renderLegendButton(seg, false)}
                  <span className={`text-sm font-bold tabular-nums ${textMuted}`}>{pct}%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {selected && <ChartDetailPanel title={selected.label} detail={selected.detail} />}
    </div>
  );
}

export function MaturityHorizontalChart({
  crops,
  selectedId,
  onSelect,
}: {
  crops: typeof MOCK_DASHBOARD_DATA.crops;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [hovered, setHovered] = useState<{ id: string; x: number; y: number } | null>(null);
  const selected = crops.find((c) => c.id === selectedId);
  const hoveredCrop = hovered ? crops.find((c) => c.id === hovered.id) : null;

  const handleMove = (cropId: string, event: ReactMouseEvent<HTMLButtonElement>) => {
    const root = event.currentTarget.closest("[data-chart-root]") as HTMLElement | null;
    if (!root) return;
    const point = cursorPointIn(root, event);
    setHovered({ id: cropId, x: point.x, y: point.y });
  };

  return (
    <div data-chart-root className="relative">
      <p className={`${labelMuted} mb-5`}>Maturidade por cultura</p>
      <div className="space-y-4">
        {crops.map((crop) => (
          <button
            key={crop.id}
            type="button"
            className={`${btnClick} relative w-full text-left`}
            onClick={() => onSelect(selectedId === crop.id ? null : crop.id)}
            onMouseMove={(e) => handleMove(crop.id, e)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className={`text-sm font-semibold ${textPrimary}`}>
                {crop.name} — {crop.zone}
              </span>
              <span className="text-sm font-bold tabular-nums text-verde-floresta">
                {crop.maturity}%
              </span>
            </div>
            <div className="relative h-8 overflow-hidden rounded-full bg-[var(--db-chart-bar-bg)] ring-1 ring-inset ring-verde-floresta/15">
              <div
                className="flex h-full items-center rounded-full bg-linear-to-r from-verde-floresta to-verde-claro px-3 transition-opacity duration-200 ease-out"
                style={{
                  width: `${crop.maturity}%`,
                  opacity: selectedId && selectedId !== crop.id ? 0.45 : hovered?.id === crop.id ? 1 : 0.8,
                }}
              >
                {(hovered?.id === crop.id || selectedId === crop.id) && (
                  <span className="text-[10px] font-semibold text-bege-natural sm:text-xs">
                    {crop.status}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      {hovered && hoveredCrop && (
        <CursorTooltip x={hovered.x} y={hovered.y}>
          <span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-verde-floresta/75">
              Colheita
            </span>
            <span className="mt-0.5 block font-bold">{hoveredCrop.estimate}</span>
          </span>
        </CursorTooltip>
      )}
      {selected && (
        <ChartDetailPanel
          title={`${selected.name} — ${selected.zone}`}
          detail={`Maturidade ${selected.maturity}% · ${selected.week} · Previsão: ${selected.estimate}.`}
        />
      )}
    </div>
  );
}

export function ClimateAreaChart({
  labels,
  values,
  unit,
  color,
  label,
}: {
  labels: readonly string[];
  values: readonly number[];
  unit: string;
  color: string;
  label: string;
}) {
  const [hovered, setHovered] = useState<{ index: number; x: number; y: number } | null>(null);
  const width = 640;
  const height = 240;
  const padX = 44;
  const padY = 32;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;
  const min = Math.min(...values) - 2;
  const max = Math.max(...values) + 2;
  const range = max - min || 1;
  const yTickCount = 7;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => i / yTickCount);
  const xLabelStep = labels.length > 12 ? 2 : 1;

  const points = values.map((v, i) => ({
    x: padX + (i / Math.max(values.length - 1, 1)) * chartW,
    y: padY + chartH - ((v - min) / range) * chartH,
    v,
    label: labels[i],
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(padY + chartH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padY + chartH).toFixed(1)} Z`;

  const gradientId = `climate-gradient-${color.replace("#", "")}`;

  const handlePointMove = (index: number, event: ReactMouseEvent<SVGCircleElement>) => {
    const root = event.currentTarget.closest("[data-chart-root]") as HTMLElement | null;
    if (!root) return;
    const point = cursorPointIn(root, event);
    setHovered({ index, x: point.x, y: point.y });
  };

  const hoveredPoint = hovered !== null ? points[hovered.index] : null;

  return (
    <div>
      <p className={`${labelMuted} mb-5`}>{label}</p>
      <div className="relative w-full overflow-x-auto" data-chart-root>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[320px]"
          role="img"
          aria-label={label}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {yTicks.map((t) => {
            const y = padY + chartH * (1 - t);
            const val = min + range * t;
            return (
              <g key={t}>
                <line
                  x1={padX}
                  y1={y}
                  x2={width - padX}
                  y2={y}
                  stroke="var(--db-chart-track)"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                />
                <text
                  x={padX - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="chart-axis-text"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill={`url(#${gradientId})`} className={chartMotion} />
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={chartMotion}
            style={{ filter: "drop-shadow(0 2px 8px color-mix(in srgb, var(--db-text) 12%, transparent))" }}
          />

          {points.map((p, i) => (
            <g key={labels[i]}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hovered?.index === i ? 6 : 4}
                fill="var(--db-chart-point)"
                stroke={color}
                strokeWidth="2"
                className={`${btnClick} ${chartMotion}`}
                onMouseMove={(e) => handlePointMove(i, e)}
                onMouseLeave={() => setHovered(null)}
              />
              {(i % xLabelStep === 0 || i === labels.length - 1) && (
                <text
                  x={p.x}
                  y={height - 6}
                  textAnchor="middle"
                  className="chart-label-text"
                  style={{ fontFamily: "inherit" }}
                >
                  {labels[i]}
                </text>
              )}
            </g>
          ))}
        </svg>

        {hovered !== null && hoveredPoint && (
          <div
            className={`pointer-events-none absolute z-10 ${tooltipSurface} dashboard-tooltip-in`}
            style={{
              left: hovered.x,
              top: hovered.y,
              transform: "translate(12px, 12px)",
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-verde-floresta/75">
              {hoveredPoint.label}
            </p>
            <p className={`mt-0.5 font-bold tabular-nums ${textPrimary}`}>
              {hoveredPoint.v}
              {unit}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function WaterBarChart({
  values,
  labels,
  selectedIndex,
  onSelect,
}: {
  values: readonly number[];
  labels: readonly string[];
  selectedIndex: number | null;
  onSelect: (i: number | null) => void;
}) {
  const max = Math.max(...values, 1);
  const [hovered, setHovered] = useState<{ index: number; x: number; y: number } | null>(null);

  const handleMove = (index: number, event: ReactMouseEvent<HTMLButtonElement>) => {
    const root = event.currentTarget.closest("[data-chart-root]") as HTMLElement | null;
    if (!root) return;
    const point = cursorPointIn(root, event);
    setHovered({ index, x: point.x, y: point.y });
  };

  return (
    <div className="relative flex items-end justify-between gap-2" data-chart-root>
      {values.map((v, i) => (
        <button
          key={labels[i]}
          type="button"
          className={`${btnClick} relative flex min-w-0 flex-1 flex-col items-center gap-1`}
          onMouseMove={(e) => handleMove(i, e)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSelect(selectedIndex === i ? null : i)}
        >
          <div
            className={`w-full max-w-12 rounded-t-md bg-linear-to-t from-verde-floresta/75 to-verde-floresta ${chartMotion}`}
            style={{
              height: `${(v / max) * 120}px`,
              minHeight: 8,
              opacity:
                selectedIndex !== null && selectedIndex !== i
                  ? 0.4
                  : hovered?.index === i
                    ? 1
                    : 0.78,
              transform: hovered?.index === i || selectedIndex === i ? "scaleX(1.05)" : "scaleX(1)",
              transformOrigin: "bottom center",
              boxShadow:
                hovered?.index === i || selectedIndex === i
                  ? "0 -2px 12px rgba(63,107,75,0.2)"
                  : undefined,
            }}
          />
          <span className={`text-[10px] ${textFaint}`}>{labels[i]}</span>
        </button>
      ))}
      {hovered !== null && (
        <CursorTooltip x={hovered.x} y={hovered.y}>
          <span className="font-bold tabular-nums">
            {values[hovered.index].toLocaleString("pt-BR")} L
          </span>
        </CursorTooltip>
      )}
    </div>
  );
}
