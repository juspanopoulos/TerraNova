import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Droplets,
  Home,
  LayoutDashboard,
  Leaf,
  LogOut,
  Sprout,
  Thermometer,
  TrendingUp,
  Wind,
} from "lucide-react";
import logoColorido from "@/assets/logos/logo-colorido.png";
import { eyebrow } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";

const LOGO_SRC = "/logos/logo-colorido.png";

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK — substituir por fetch/axios quando a API estiver pronta
   ═══════════════════════════════════════════════════════════════════════════ */

const MOCK_DASHBOARD_DATA = {
  property: { name: "Fazenda Terra Nova", region: "Sul de Minas" },
  climate: {
    current: { temperature: 24.6, humidity: 68, wind: 12.4 },
    history: {
      daily: {
        labels: ["00h", "04h", "08h", "12h", "16h", "20h", "Agora"],
        temperature: [19, 20, 22, 25, 24.6, 21, 20],
        humidity: [72, 70, 65, 62, 68, 71, 68],
        wind: [8, 9, 11, 14, 12.4, 10, 9],
      },
      weekly: {
        labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        temperature: [22, 23, 24, 25, 24, 23, 22],
        humidity: [65, 67, 68, 70, 69, 66, 64],
        wind: [10, 11, 12, 13, 12, 11, 10],
      },
      monthly: {
        labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
        temperature: [23, 24, 25, 24.6],
        humidity: [66, 67, 68, 68],
        wind: [11, 12, 12, 12.4],
      },
      yearly: {
        labels: ["Jan", "Mar", "Mai", "Jul", "Set", "Nov"],
        temperature: [26, 24, 22, 20, 23, 25],
        humidity: [70, 68, 65, 62, 66, 69],
        wind: [9, 10, 11, 12, 11, 10],
      },
    },
  },
  soil: {
    current: { nitrogen: 42, phosphorus: 28, potassium: 55, moisture: 61, ph: 6.4 },
    sectors: [
      { sector: "Talhão A", moisture: 64, ph: 6.5, status: "Normal" },
      { sector: "Talhão B", moisture: 58, ph: 6.3, status: "Normal" },
      { sector: "Estufa", moisture: 71, ph: 6.8, status: "Úmido" },
      { sector: "Serra Norte", moisture: 52, ph: 6.1, status: "Atenção" },
      { sector: "Reserva", moisture: 49, ph: 5.9, status: "Seco" },
    ],
    nutrients: [
      { id: "n", value: 42, color: "#3F6B4B", label: "Nitrogênio (N)", detail: "Nível adequado para fase vegetativa." },
      { id: "p", value: 28, color: "#A8C7A1", label: "Fósforo (P)", detail: "Reforço leve recomendado em 10 dias." },
      { id: "k", value: 55, color: "#E59B3A", label: "Potássio (K)", detail: "Excelente reserva para floração." },
    ],
  },
  crops: [
    { id: "soja", name: "Soja", zone: "Talhão A", maturity: 72, week: "Sem. 12", estimate: "18–22 Out", status: "Em maturação" },
    { id: "milho", name: "Milho", zone: "Talhão B", maturity: 45, week: "Sem. 8", estimate: "05–12 Nov", status: "Crescimento" },
    { id: "cafe", name: "Café", zone: "Serra Norte", maturity: 88, week: "Sem. 22", estimate: "Mar/2027", status: "Pré-colheita" },
    { id: "horta", name: "Hortaliças", zone: "Estufa", maturity: 34, week: "Sem. 5", estimate: "Contínuo", status: "Inicial" },
  ],
  water: {
    current: { consumptionLiters: 1840, savingsLiters: 32000, efficiency: 91 },
    distribution: [
      { id: "gotejamento", value: 45, color: "#3F6B4B", label: "Gotejamento", detail: "828 L — maior eficiência por zona." },
      { id: "aspersao", value: 30, color: "#A8C7A1", label: "Aspersão", detail: "552 L — Talhões A e B." },
      { id: "reservatorio", value: 15, color: "#E59B3A", label: "Reservatório", detail: "276 L — reserva estratégica." },
      { id: "recuperacao", value: 10, color: "#94a3b8", label: "Recuperação", detail: "184 L — reuso de drenagem." },
    ],
    irrigationBySector: [
      { sector: "Talhão A", used: 620, target: 700, save: "11%", efficiency: 94 },
      { sector: "Talhão B", used: 480, target: 550, save: "13%", efficiency: 92 },
      { sector: "Estufa", used: 410, target: 480, save: "15%", efficiency: 89 },
      { sector: "Serra Norte", used: 330, target: 400, save: "18%", efficiency: 87 },
    ],
    history: {
      daily: { labels: ["6h", "9h", "12h", "15h", "18h", "21h", "Agora"], values: [320, 410, 520, 480, 390, 280, 1840] },
      weekly: { labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"], values: [2100, 1950, 1880, 1920, 1840, 1760, 1800] },
      monthly: { labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"], values: [8200, 7900, 7600, 7400] },
      yearly: { labels: ["Jan", "Mar", "Mai", "Jul", "Set", "Nov"], values: [28000, 26500, 25000, 24000, 25500, 27000] },
    },
  },
  alerts: [
    { id: "1", level: "critical" as AlertLevel, title: "Risco de geada", type: "Temperatura", time: "04/06 · 05:48", summary: "Temp. < 2°C entre 04h–06h" },
    { id: "2", level: "warning" as AlertLevel, title: "Onda de calor", type: "UV / Calor", time: "04/06 · 04:30", summary: "UV alto por 3 dias" },
    { id: "3", level: "normal" as AlertLevel, title: "Chuva moderada", type: "Precipitação", time: "04/06 · 02:15", summary: "8–12 mm previstos" },
    { id: "4", level: "warning" as AlertLevel, title: "Vento forte", type: "Vento", time: "03/06 · 22:00", summary: "Rajadas > 40 km/h" },
    { id: "5", level: "normal" as AlertLevel, title: "Umidade estável", type: "Umidade", time: "03/06 · 18:40", summary: "Faixa ideal mantida" },
    { id: "6", level: "critical" as AlertLevel, title: "Solo seco — Reserva", type: "Solo", time: "03/06 · 14:20", summary: "Umidade 49% no setor" },
  ],
};

/* ─── Types ─── */

type AuthMode = "login" | "register";
type ViewId = "overview" | "alerts" | "climate" | "soil" | "growth" | "water";
type TimeFilter = "daily" | "weekly" | "monthly" | "yearly";
type AlertLevel = "critical" | "warning" | "normal";

type ChartSegment = {
  id: string;
  value: number;
  color: string;
  label: string;
  detail: string;
};

type NavItem = { id: ViewId; label: string; icon: typeof LayoutDashboard };

/* ─── UI tokens ─── */

const shellBg = "bg-neutral-100";
const cardBase =
  "rounded-xl border border-neutral-300 bg-white p-4 shadow-sm sm:p-5 md:p-6";
const cardInset = "rounded-lg border border-neutral-300 bg-neutral-50/90 p-4";
const labelMuted =
  "text-xs font-semibold uppercase tracking-[0.14em] text-preto-suave/50";
const pageTitle =
  "text-2xl font-bold tracking-tight text-preto-suave sm:text-3xl md:text-4xl";
const chartMotion = "transition-all duration-300 ease-out";
const tooltipSurface =
  "rounded-lg border border-verde-floresta/20 bg-bege-natural px-3 py-2 text-xs text-preto-suave shadow-[0_6px_20px_rgba(63,107,75,0.14)] backdrop-blur-sm";
const btnClick =
  `cursor-pointer ${chartMotion} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-floresta/40`;
const thClass =
  "whitespace-nowrap border-b border-neutral-300 bg-neutral-50 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-preto-suave/55 sm:px-4";
const tdClass =
  "border-b border-neutral-200 px-3 py-3 text-sm text-preto-suave sm:px-4";

const TIME_FILTERS: { id: TimeFilter; label: string }[] = [
  { id: "daily", label: "Diário" },
  { id: "weekly", label: "Semanal" },
  { id: "monthly", label: "Mensal" },
  { id: "yearly", label: "Anual" },
];

const PAGE_TITLES: Record<ViewId, string> = {
  overview: "Visão Geral",
  alerts: "Alertas",
  climate: "Controle Climático",
  soil: "Controle do Solo",
  growth: "Previsão de Colheitas",
  water: "Consumo Hídrico",
};

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { id: "alerts", label: "Alertas", icon: Bell },
  { id: "climate", label: "Controle Climático", icon: Cloud },
  { id: "soil", label: "Controle do Solo", icon: Leaf },
  { id: "growth", label: "Previsão de Colheitas", icon: Sprout },
  { id: "water", label: "Consumo Hídrico", icon: Droplets },
];

const levelLabel: Record<AlertLevel, string> = {
  critical: "Crítico",
  warning: "Atenção",
  normal: "Normal",
};

const levelAccent: Record<
  AlertLevel,
  { bar: string; chip: string; chipText: string; glow: string }
> = {
  critical: {
    bar: "bg-red-400/85",
    chip: "bg-red-50",
    chipText: "text-red-800/90",
    glow: "hover:shadow-[0_8px_24px_rgba(220,90,90,0.12)]",
  },
  warning: {
    bar: "bg-laranja-solar/90",
    chip: "bg-amber-50",
    chipText: "text-amber-900/85",
    glow: "hover:shadow-[0_8px_24px_rgba(229,155,58,0.14)]",
  },
  normal: {
    bar: "bg-verde-floresta/80",
    chip: "bg-verde-floresta/10",
    chipText: "text-verde-floresta",
    glow: "hover:shadow-[0_8px_24px_rgba(63,107,75,0.12)]",
  },
};

const contentPad =
  "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16";

/* ─── Helpers ─── */

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function getClimateHistory(filter: TimeFilter) {
  return MOCK_DASHBOARD_DATA.climate.history[filter];
}

function getWaterHistory(filter: TimeFilter) {
  return MOCK_DASHBOARD_DATA.water.history[filter];
}

function filterLabel(filter: TimeFilter) {
  return TIME_FILTERS.find((f) => f.id === filter)?.label ?? "";
}

/* ─── Primitives ─── */

function DashboardCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <article className={`${cardBase} ${className}`.trim()}>{children}</article>;
}

function PageToolbar({
  view,
  timeFilter,
  onTimeFilterChange,
}: {
  view: ViewId;
  timeFilter: TimeFilter;
  onTimeFilterChange: (f: TimeFilter) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:mb-8">
      <h1 className={`min-w-0 ${pageTitle}`}>{PAGE_TITLES[view]}</h1>
      <TimeFilterBar value={timeFilter} onChange={onTimeFilterChange} />
    </div>
  );
}

function TimeFilterBar({
  value,
  onChange,
}: {
  value: TimeFilter;
  onChange: (f: TimeFilter) => void;
}) {
  return (
    <div
      className="inline-flex flex-wrap gap-1 rounded-lg border border-neutral-300 bg-white p-1 shadow-sm"
      role="group"
      aria-label="Período"
    >
      {TIME_FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onChange(f.id)}
          className={[
            btnClick,
            "rounded-md px-3 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm",
            value === f.id
              ? "bg-verde-floresta text-bege-natural"
              : "text-preto-suave/60 hover:bg-slate-50",
          ].join(" ")}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

function ChartTooltip({
  x,
  y,
  label,
  value,
}: {
  x: number;
  y: number;
  label: string;
  value: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute z-20 ${tooltipSurface} ${chartMotion}`}
      style={{ left: x, top: y, transform: "translate(-50%, -125%)" }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-verde-floresta/75">
        {label}
      </p>
      <p className="mt-0.5 font-bold tabular-nums text-preto-suave">{value}</p>
    </div>
  );
}

function InlineChartTooltip({
  children,
  className = "right-2 top-1/2 -translate-y-1/2",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`pointer-events-none absolute z-10 ${className} ${tooltipSurface} ${chartMotion} whitespace-nowrap`}
    >
      {children}
    </span>
  );
}

function ChartDetailPanel({ title, detail }: { title: string; detail: string }) {
  return (
    <div
      className={`mt-4 rounded-xl border border-verde-floresta/15 bg-bege-natural/50 p-4 shadow-sm ${chartMotion}`}
    >
      <p className="text-sm font-bold text-verde-floresta">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-preto-suave/65">{detail}</p>
    </div>
  );
}

function MetricTile({
  label,
  value,
  unit,
  icon: Icon,
}: {
  label: string;
  value: string;
  unit?: string;
  icon: typeof Thermometer;
}) {
  return (
    <div className={cardInset}>
      <div className="flex items-start justify-between gap-2">
        <p className={labelMuted}>{label}</p>
        <Icon className="size-4 shrink-0 text-verde-floresta/50 sm:size-5" aria-hidden />
      </div>
      <p className="mt-2 text-xl font-bold tabular-nums text-preto-suave sm:text-2xl md:text-3xl">
        {value}
        {unit && <span className="ml-1 text-sm font-semibold text-preto-suave/45">{unit}</span>}
      </p>
    </div>
  );
}

function DonutChart({
  segments,
  size = 200,
  strokeWidth = 24,
  centerValue,
  centerLabel,
  selectedId,
  onSelect,
}: {
  segments: ChartSegment[];
  size?: number;
  strokeWidth?: number;
  centerValue: string;
  centerLabel: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [hovered, setHovered] = useState<{ id: string; x: number; y: number } | null>(null);
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let accumulated = 0;
  const selected = segments.find((s) => s.id === selectedId);

  return (
    <div>
      <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle
              cx={cx}
              cy={cx}
              r={r}
              fill="none"
              stroke="#E8E4DC"
              strokeWidth={strokeWidth}
              className={chartMotion}
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
                  stroke={seg.color}
                  strokeWidth={active ? strokeWidth + 5 : strokeWidth}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                  className={`${btnClick} ${chartMotion}`}
                  style={{
                    opacity: dimmed ? 0.38 : active ? 1 : 0.82,
                    filter: active ? "saturate(1.12) brightness(1.06)" : "saturate(0.95)",
                  }}
                  onMouseEnter={(e) => {
                    const rect = (e.target as SVGElement).getBoundingClientRect();
                    const parent = (e.currentTarget as SVGElement)
                      .closest(".relative")
                      ?.getBoundingClientRect();
                    if (parent) {
                      setHovered({
                        id: seg.id,
                        x: rect.left - parent.left + rect.width / 2,
                        y: rect.top - parent.top,
                      });
                    }
                  }}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onSelect(selectedId === seg.id ? null : seg.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${seg.label}: ${((seg.value / total) * 100).toFixed(0)}%`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(selectedId === seg.id ? null : seg.id);
                    }
                  }}
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold tabular-nums text-preto-suave">{centerValue}</span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-preto-suave/45 sm:text-xs">
              {centerLabel}
            </span>
          </div>
          {hovered && (
            <ChartTooltip
              x={hovered.x}
              y={hovered.y}
              label={segments.find((s) => s.id === hovered.id)?.label ?? ""}
              value={`${(
                ((segments.find((s) => s.id === hovered.id)?.value ?? 0) / total) *
                100
              ).toFixed(0)}%`}
            />
          )}
        </div>
        <ul className="grid w-full gap-2 sm:max-w-xs">
          {segments.map((seg) => {
            const pct = ((seg.value / total) * 100).toFixed(0);
            return (
              <li key={seg.id}>
                <button
                  type="button"
                  onClick={() => onSelect(selectedId === seg.id ? null : seg.id)}
                  className={[
                    btnClick,
                    "flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm",
                    selectedId === seg.id ? "bg-verde-floresta/10" : "hover:bg-slate-50",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                    <span className="text-preto-suave/75">{seg.label}</span>
                  </span>
                  <span className="font-bold tabular-nums">{pct}%</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {selected && <ChartDetailPanel title={selected.label} detail={selected.detail} />}
    </div>
  );
}

function HorizontalHistoryBars({
  label,
  values,
  labels,
  unit,
  timeFilter,
  color = "#3F6B4B",
  selectedIndex,
  onSelect,
}: {
  label: string;
  values: readonly number[];
  labels: readonly string[];
  unit: string;
  timeFilter: TimeFilter;
  color?: string;
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
}) {
  const max = Math.max(...values, 1);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div>
      <p className={`${labelMuted} mb-4`}>{label}</p>
      <div className="space-y-3">
        {values.map((v, i) => (
          <button
            key={labels[i]}
            type="button"
            className={`${btnClick} flex w-full items-center gap-3 text-left`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(selectedIndex === i ? null : i)}
          >
            <span className="w-12 shrink-0 text-xs font-medium text-preto-suave/55 sm:w-14">
              {labels[i]}
            </span>
            <div className="relative h-7 flex-1 overflow-hidden rounded-full bg-bege-natural/60 ring-1 ring-inset ring-verde-floresta/10">
              <div
                className={`h-full rounded-full ${chartMotion}`}
                style={{
                  width: `${(v / max) * 100}%`,
                  background: `linear-gradient(90deg, ${color}dd, ${color})`,
                  opacity:
                    selectedIndex !== null && selectedIndex !== i
                      ? 0.35
                      : hovered === i
                        ? 1
                        : 0.78,
                  transform: hovered === i || selectedIndex === i ? "scaleY(1.04)" : "scaleY(1)",
                  transformOrigin: "left center",
                  boxShadow:
                    hovered === i || selectedIndex === i
                      ? "0 2px 10px rgba(63,107,75,0.2)"
                      : undefined,
                }}
              />
              {hovered === i && (
                <InlineChartTooltip>
                  <span className="font-bold tabular-nums">
                    {v}
                    {unit}
                  </span>
                </InlineChartTooltip>
              )}
            </div>
            <span className="w-14 shrink-0 text-right text-xs font-bold tabular-nums">
              {v}
              {unit}
            </span>
          </button>
        ))}
      </div>
      {selectedIndex !== null && (
        <ChartDetailPanel
          title={`${label} — ${labels[selectedIndex]}`}
          detail={`Valor: ${values[selectedIndex]}${unit}. Período: ${filterLabel(timeFilter)}.`}
        />
      )}
    </div>
  );
}

function MaturityHorizontalChart({
  crops,
  selectedId,
  onSelect,
}: {
  crops: typeof MOCK_DASHBOARD_DATA.crops;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const selected = crops.find((c) => c.id === selectedId);

  return (
    <div>
      <p className={`${labelMuted} mb-5`}>Maturidade por cultura</p>
      <div className="space-y-4">
        {crops.map((crop) => (
          <button
            key={crop.id}
            type="button"
            className={`${btnClick} w-full text-left`}
            onClick={() => onSelect(selectedId === crop.id ? null : crop.id)}
            onMouseEnter={() => setHovered(crop.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-preto-suave">
                {crop.name} — {crop.zone}
              </span>
              <span className="text-sm font-bold tabular-nums text-verde-floresta">
                {crop.maturity}%
              </span>
            </div>
            <div className="relative h-8 overflow-hidden rounded-full bg-bege-natural/60 ring-1 ring-inset ring-verde-floresta/10">
              <div
                className={`flex h-full items-center rounded-full bg-linear-to-r from-verde-floresta to-verde-claro px-3 ${chartMotion}`}
                style={{
                  width: `${crop.maturity}%`,
                  opacity: selectedId && selectedId !== crop.id ? 0.45 : hovered === crop.id ? 1 : 0.8,
                  filter:
                    hovered === crop.id || selectedId === crop.id
                      ? "saturate(1.1) brightness(1.04)"
                      : "saturate(0.92)",
                  boxShadow:
                    hovered === crop.id || selectedId === crop.id
                      ? "0 2px 12px rgba(63,107,75,0.22)"
                      : undefined,
                }}
              >
                {(hovered === crop.id || selectedId === crop.id) && (
                  <span className="text-[10px] font-semibold text-bege-natural sm:text-xs">
                    {crop.status}
                  </span>
                )}
              </div>
              {hovered === crop.id && (
                <InlineChartTooltip>
                  <span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-verde-floresta/75">
                      Colheita
                    </span>
                    <span className="mt-0.5 block font-bold">{crop.estimate}</span>
                  </span>
                </InlineChartTooltip>
              )}
            </div>
          </button>
        ))}
      </div>
      {selected && (
        <ChartDetailPanel
          title={`${selected.name} — ${selected.zone}`}
          detail={`Maturidade ${selected.maturity}% · ${selected.week} · Previsão: ${selected.estimate}.`}
        />
      )}
    </div>
  );
}

function DataTable({ children, caption }: { children: ReactNode; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-300">
      <table className="w-full min-w-[280px] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

function WaterBarChart({
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
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex items-end justify-between gap-2">
      {values.map((v, i) => (
        <button
          key={labels[i]}
          type="button"
          className={`${btnClick} relative flex min-w-0 flex-1 flex-col items-center gap-1`}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSelect(selectedIndex === i ? null : i)}
        >
          {hovered === i && (
            <InlineChartTooltip className="bottom-full left-1/2 mb-1.5 -translate-x-1/2">
              <span className="font-bold tabular-nums">{v.toLocaleString("pt-BR")} L</span>
            </InlineChartTooltip>
          )}
          <div
            className={`w-full max-w-12 rounded-t-md bg-linear-to-t from-verde-floresta/75 to-verde-floresta ${chartMotion}`}
            style={{
              height: `${(v / max) * 120}px`,
              minHeight: 8,
              opacity:
                selectedIndex !== null && selectedIndex !== i
                  ? 0.4
                  : hovered === i
                    ? 1
                    : 0.78,
              transform: hovered === i || selectedIndex === i ? "scaleX(1.05)" : "scaleX(1)",
              transformOrigin: "bottom center",
              boxShadow:
                hovered === i || selectedIndex === i
                  ? "0 -2px 12px rgba(63,107,75,0.2)"
                  : undefined,
            }}
          />
          <span className="text-[10px] text-preto-suave/45">{labels[i]}</span>
        </button>
      ))}
    </div>
  );
}

/* ─── Login ─── */

function LoginScreen({
  mode,
  onModeChange,
  onSubmit,
}: {
  mode: AuthMode;
  onModeChange: (m: AuthMode) => void;
  onSubmit: () => void;
}) {
  const inputClass =
    "mt-1.5 w-full rounded-lg border border-neutral-200/80 bg-white px-4 py-3 text-preto-suave outline-none transition placeholder:text-preto-suave/35 focus:border-verde-floresta/40 focus:ring-2 focus:ring-verde-floresta/10";

  return (
    <div className={`${shellBg} flex min-h-screen items-center justify-center px-4 py-12`}>
      <div className="w-full max-w-md rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 text-center">
          <img src={logoColorido} alt="TerraNova" className="mx-auto mb-4 h-16 w-auto object-contain" />
          <p className={eyebrow}>TerraNova</p>
          <h1 className="mt-2 text-2xl font-bold text-preto-suave">
            {mode === "login" ? "Acesse sua propriedade" : "Crie sua conta"}
          </h1>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4"
        >
          {mode === "register" && (
            <label className="block">
              <span className={labelMuted}>Propriedade</span>
              <input type="text" required className={inputClass} placeholder="Fazenda Exemplo" />
            </label>
          )}
          <label className="block">
            <span className={labelMuted}>E-mail</span>
            <input type="email" required className={inputClass} placeholder="produtor@terranova.app" />
          </label>
          <label className="block">
            <span className={labelMuted}>Senha</span>
            <input type="password" required className={inputClass} placeholder="••••••••" />
          </label>
          <button
            type="submit"
            className={`${btnClick} w-full rounded-lg bg-verde-floresta px-4 py-3 text-sm font-semibold text-bege-natural hover:bg-verde-floresta/90`}
          >
            {mode === "login" ? "Entrar no dashboard" : "Registrar e acessar"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-preto-suave/55">
          {mode === "login" ? "Ainda não tem conta?" : "Já possui conta?"}{" "}
          <button
            type="button"
            onClick={() => onModeChange(mode === "login" ? "register" : "login")}
            className={`${btnClick} font-semibold text-verde-floresta hover:underline`}
          >
            {mode === "login" ? "Criar conta" : "Fazer login"}
          </button>
        </p>
        <Link
          to={ROUTES.home}
          className={`${btnClick} mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-preto-suave/50 hover:text-verde-floresta`}
        >
          <ArrowLeft className="size-4" />
          Voltar ao site
        </Link>
      </div>
    </div>
  );
}

/* ─── Sidebar fixa ─── */

function Sidebar({
  isSidebarOpen,
  onToggle,
  currentView,
  onNavigate,
  onLogout,
}: {
  isSidebarOpen: boolean;
  onToggle: () => void;
  currentView: ViewId;
  onNavigate: (v: ViewId) => void;
  onLogout: () => void;
}) {
  return (
    <aside
      className={[
        "flex h-full max-h-[100dvh] shrink-0 flex-col border-r border-neutral-300 bg-white transition-[width] duration-300 ease-in-out",
        isSidebarOpen ? "w-64" : "w-[4.5rem]",
      ].join(" ")}
      aria-label="Navegação"
    >
      <div
        className={[
          "flex shrink-0 flex-col gap-2 border-b border-neutral-200/80 py-4",
          isSidebarOpen ? "px-4" : "items-center px-2",
        ].join(" ")}
      >
        <div
          className={[
            "flex w-full items-center",
            isSidebarOpen ? "justify-between gap-2" : "justify-center",
          ].join(" ")}
        >
          <Link to={ROUTES.home} className={`${btnClick} shrink-0`} title="TerraNova">
            <img
              src={LOGO_SRC}
              alt="TerraNova"
              className={isSidebarOpen ? "h-10 w-auto object-contain" : "h-9 w-9 object-contain"}
              onError={(e) => {
                (e.target as HTMLImageElement).src = logoColorido;
              }}
            />
          </Link>
          {isSidebarOpen && (
            <button
              type="button"
              onClick={onToggle}
              className={`${btnClick} rounded-lg border border-neutral-200/80 p-2 text-preto-suave/55 hover:bg-slate-50 hover:text-verde-floresta`}
              aria-label="Recolher menu"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
        </div>
        {!isSidebarOpen && (
          <button
            type="button"
            onClick={onToggle}
            className={`${btnClick} rounded-lg border border-neutral-200/80 p-2 text-preto-suave/55 hover:bg-slate-50`}
            aria-label="Expandir menu"
          >
            <ChevronRight className="size-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2 sm:p-3">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            title={!isSidebarOpen ? label : undefined}
            className={[
              btnClick,
              "flex w-full items-center rounded-lg text-sm font-semibold",
              isSidebarOpen ? "gap-3 px-3 py-2.5" : "justify-center p-2.5",
              currentView === id
                ? "bg-verde-floresta/10 text-verde-floresta"
                : "text-preto-suave/60 hover:bg-slate-50",
            ].join(" ")}
          >
            <Icon className="size-4 shrink-0" />
            {isSidebarOpen && <span className="truncate">{label}</span>}
          </button>
        ))}
      </nav>

      <div className="shrink-0 space-y-1 border-t border-neutral-200/80 p-2 sm:p-3">
        <Link
          to={ROUTES.home}
          title="Voltar ao Início"
          className={[
            btnClick,
            "flex w-full items-center rounded-lg text-sm font-semibold text-preto-suave/60 hover:bg-slate-50",
            isSidebarOpen ? "gap-3 px-3 py-2.5" : "justify-center p-2.5",
          ].join(" ")}
        >
          <Home className="size-4 shrink-0" />
          {isSidebarOpen && <span>Voltar ao Início</span>}
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className={[
            btnClick,
            "flex w-full items-center rounded-lg text-sm font-semibold text-preto-suave/50 hover:bg-laranja-solar/10 hover:text-laranja-solar",
            isSidebarOpen ? "gap-3 px-3 py-2.5" : "justify-center p-2.5",
          ].join(" ")}
        >
          <LogOut className="size-4 shrink-0" />
          {isSidebarOpen && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}

/* ─── Views ─── */

function OverviewView({
  climate,
  soil,
  water,
  timeFilter,
}: {
  climate: typeof MOCK_DASHBOARD_DATA.climate.current;
  soil: typeof MOCK_DASHBOARD_DATA.soil.current;
  water: typeof MOCK_DASHBOARD_DATA.water.current;
  timeFilter: TimeFilter;
}) {
  const crops = MOCK_DASHBOARD_DATA.crops;
  const avgMaturity = crops.reduce((s, c) => s + c.maturity, 0) / crops.length;
  const criticalCount = MOCK_DASHBOARD_DATA.alerts.filter((a) => a.level === "critical").length;
  const [selectedWater, setSelectedWater] = useState<string | null>(null);
  const waterSegments: ChartSegment[] = MOCK_DASHBOARD_DATA.water.distribution.map((d) => ({ ...d }));

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile label="Temperatura" value={climate.temperature.toFixed(1)} unit="°C" icon={Thermometer} />
        <MetricTile label="Umidade solo" value={Math.round(soil.moisture).toString()} unit="%" icon={Leaf} />
        <MetricTile label="Maturidade média" value={avgMaturity.toFixed(0)} unit="%" icon={Sprout} />
        <MetricTile label="Alertas críticos" value={String(criticalCount)} icon={AlertTriangle} />
      </div>
      <DashboardCard>
        <p className={`${labelMuted} mb-4`}>Distribuição hídrica — {filterLabel(timeFilter)}</p>
        <DonutChart
          segments={waterSegments}
          centerValue={`${water.efficiency}%`}
          centerLabel="Eficiência"
          selectedId={selectedWater}
          onSelect={setSelectedWater}
        />
      </DashboardCard>
    </div>
  );
}

type AlertItem = (typeof MOCK_DASHBOARD_DATA.alerts)[number];

function AlertStatPill({
  label,
  count,
  level,
}: {
  label: string;
  count: number;
  level: AlertLevel;
}) {
  const accent = levelAccent[level];
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-neutral-300/80 bg-white px-4 py-3 shadow-sm ${chartMotion}`}
    >
      <span className={`h-10 w-1 shrink-0 rounded-full ${accent.bar}`} aria-hidden />
      <div>
        <p className="text-2xl font-bold tabular-nums text-preto-suave">{count}</p>
        <p className="text-xs font-medium text-preto-suave/50">{label}</p>
      </div>
    </div>
  );
}

function AlertMonitorCard({ alert }: { alert: AlertItem }) {
  const accent = levelAccent[alert.level];
  return (
    <article
      className={[
        "group relative flex overflow-hidden rounded-xl border border-neutral-300/90 bg-white shadow-sm",
        chartMotion,
        accent.glow,
        "hover:-translate-y-0.5 hover:border-verde-floresta/25",
      ].join(" ")}
    >
      <span
        className={`w-1 shrink-0 ${accent.bar} ${chartMotion} group-hover:w-1.5`}
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${accent.chip} ${accent.chipText}`}
            >
              {levelLabel[alert.level]}
            </span>
            <span className="rounded-full bg-bege-natural/80 px-2.5 py-0.5 text-[11px] font-medium text-verde-floresta/80">
              {alert.type}
            </span>
          </div>
          <h3 className="text-base font-bold leading-snug text-preto-suave sm:text-lg">
            {alert.title}
          </h3>
          <p className="text-sm leading-relaxed text-preto-suave/60">{alert.summary}</p>
        </div>
        <time className="shrink-0 text-xs font-medium tabular-nums text-preto-suave/40 sm:text-right">
          {alert.time}
        </time>
      </div>
    </article>
  );
}

function AlertsView() {
  const alerts = MOCK_DASHBOARD_DATA.alerts;
  const counts = useMemo(
    () => ({
      critical: alerts.filter((a) => a.level === "critical").length,
      warning: alerts.filter((a) => a.level === "warning").length,
      normal: alerts.filter((a) => a.level === "normal").length,
    }),
    [alerts],
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="overflow-hidden rounded-xl border border-neutral-300/90 bg-linear-to-br from-white via-white to-bege-natural/40 p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-verde-floresta/10 text-verde-floresta">
              <Bell className="size-5" aria-hidden />
            </div>
            <div>
              <p className={`${labelMuted} mb-1`}>Central de Monitoramento</p>
              <p className="max-w-xl text-sm leading-relaxed text-preto-suave/60">
                Feed climático e operacional da {MOCK_DASHBOARD_DATA.property.name} —{" "}
                {MOCK_DASHBOARD_DATA.property.region}.
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold tabular-nums text-preto-suave/45">
            {alerts.length} eventos
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <AlertStatPill label="Críticos" count={counts.critical} level="critical" />
        <AlertStatPill label="Atenção" count={counts.warning} level="warning" />
        <AlertStatPill label="Normais" count={counts.normal} level="normal" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {alerts.map((alert) => (
          <AlertMonitorCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}

function ClimateView({
  climate,
  timeFilter,
}: {
  climate: typeof MOCK_DASHBOARD_DATA.climate.current;
  timeFilter: TimeFilter;
}) {
  const history = getClimateHistory(timeFilter);
  const [metric, setMetric] = useState<"temperature" | "humidity" | "wind">("temperature");
  const [barIndex, setBarIndex] = useState<number | null>(null);

  const metrics = [
    {
      key: "temperature" as const,
      label: "Temperatura",
      value: `${climate.temperature.toFixed(1)}°C`,
      icon: Thermometer,
      data: history.temperature,
      unit: "°C",
      color: "#E59B3A",
    },
    {
      key: "humidity" as const,
      label: "Umidade",
      value: `${Math.round(climate.humidity)}%`,
      icon: Droplets,
      data: history.humidity,
      unit: "%",
      color: "#3F6B4B",
    },
    {
      key: "wind" as const,
      label: "Vento",
      value: `${climate.wind.toFixed(1)} km/h`,
      icon: Wind,
      data: history.wind,
      unit: " km/h",
      color: "#64748b",
    },
  ];

  const active = metrics.find((m) => m.key === metric) ?? metrics[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
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
                <p className={labelMuted}>{m.label}</p>
                <Icon className="size-4 text-verde-floresta/50" />
              </div>
              <p className="mt-2 text-2xl font-bold tabular-nums">{m.value}</p>
            </button>
          );
        })}
      </div>
      <DashboardCard>
        <HorizontalHistoryBars
          label={`Histórico de ${active.label} — ${filterLabel(timeFilter)}`}
          values={active.data}
          labels={history.labels}
          unit={active.unit}
          timeFilter={timeFilter}
          color={active.color}
          selectedIndex={barIndex}
          onSelect={setBarIndex}
        />
      </DashboardCard>
    </div>
  );
}

function SoilView({
  soil,
  selectedNutrient,
  onSelectNutrient,
}: {
  soil: typeof MOCK_DASHBOARD_DATA.soil.current;
  selectedNutrient: string | null;
  onSelectNutrient: (id: string | null) => void;
}) {
  const segments: ChartSegment[] = MOCK_DASHBOARD_DATA.soil.nutrients.map((n) => ({ ...n }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardCard>
          <p className={`${labelMuted} mb-4`}>Composição NPK</p>
          <DonutChart
            segments={segments}
            centerValue={soil.ph.toFixed(1)}
            centerLabel="pH médio"
            selectedId={selectedNutrient}
            onSelect={onSelectNutrient}
          />
        </DashboardCard>
        <DashboardCard>
          <p className={`${labelMuted} mb-4`}>Indicadores</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: "N", v: `${soil.nitrogen}%` },
              { l: "P", v: `${soil.phosphorus}%` },
              { l: "K", v: `${soil.potassium}%` },
              { l: "Umidade", v: `${Math.round(soil.moisture)}%` },
            ].map((item) => (
              <div key={item.l} className={cardInset}>
                <p className={labelMuted}>{item.l}</p>
                <p className="mt-1 text-2xl font-bold text-verde-floresta">{item.v}</p>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
      <DashboardCard>
        <p className={`${labelMuted} mb-4`}>Umidade por setor</p>
        <DataTable caption="Setores">
          <thead>
            <tr>
              <th className={thClass}>Setor</th>
              <th className={thClass}>Umidade</th>
              <th className={thClass}>pH</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DASHBOARD_DATA.soil.sectors.map((row) => (
              <tr key={row.sector} className="hover:bg-slate-50">
                <td className={`${tdClass} font-medium`}>{row.sector}</td>
                <td className={tdClass}>
                  <div className="flex items-center gap-2">
                    <div className="h-2 max-w-28 flex-1 overflow-hidden rounded-full bg-neutral-200">
                      <div
                        className="h-full rounded-full bg-verde-floresta"
                        style={{ width: `${row.moisture}%` }}
                      />
                    </div>
                    <span className="font-semibold tabular-nums">{row.moisture}%</span>
                  </div>
                </td>
                <td className={`${tdClass} tabular-nums`}>{row.ph.toFixed(1)}</td>
                <td className={tdClass}>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </DashboardCard>
    </div>
  );
}

function GrowthView({
  selectedCrop,
  onSelectCrop,
}: {
  selectedCrop: string | null;
  onSelectCrop: (id: string | null) => void;
}) {
  const crops = MOCK_DASHBOARD_DATA.crops;

  return (
    <div className="space-y-6">
      <DashboardCard>
        <MaturityHorizontalChart crops={crops} selectedId={selectedCrop} onSelect={onSelectCrop} />
      </DashboardCard>
      <DashboardCard>
        <p className={`${labelMuted} mb-4`}>Cronograma</p>
        <DataTable caption="Colheitas">
          <thead>
            <tr>
              <th className={thClass}>Cultura</th>
              <th className={thClass}>Zona</th>
              <th className={thClass}>Maturidade</th>
              <th className={thClass}>Semana</th>
              <th className={thClass}>Colheita</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className={`${tdClass} font-medium`}>{c.name}</td>
                <td className={`${tdClass} text-preto-suave/65`}>{c.zone}</td>
                <td className={tdClass}>
                  <span className="font-bold text-verde-floresta">{c.maturity}%</span>
                </td>
                <td className={tdClass}>{c.week}</td>
                <td className={tdClass}>{c.estimate}</td>
                <td className={tdClass}>
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-semibold">
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </DashboardCard>
    </div>
  );
}

function WaterView({
  water,
  timeFilter,
  selectedSegment,
  onSelectSegment,
}: {
  water: typeof MOCK_DASHBOARD_DATA.water.current;
  timeFilter: TimeFilter;
  selectedSegment: string | null;
  onSelectSegment: (id: string | null) => void;
}) {
  const history = getWaterHistory(timeFilter);
  const segments: ChartSegment[] = MOCK_DASHBOARD_DATA.water.distribution.map((d) => ({ ...d }));
  const [barIndex, setBarIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricTile label="Consumo" value={water.consumptionLiters.toLocaleString("pt-BR")} unit="L" icon={Droplets} />
        <MetricTile label="Economia" value={`${(water.savingsLiters / 1000).toFixed(0)} mil`} unit="L" icon={TrendingUp} />
        <MetricTile label="Eficiência" value={String(water.efficiency)} unit="%" icon={Droplets} />
      </div>
      <DashboardCard>
        <p className={`${labelMuted} mb-4`}>Distribuição do consumo</p>
        <DonutChart
          segments={segments}
          centerValue={`${water.efficiency}%`}
          centerLabel="Eficiência"
          selectedId={selectedSegment}
          onSelect={onSelectSegment}
        />
      </DashboardCard>
      <DashboardCard>
        <p className={`${labelMuted} mb-4`}>Histórico — {filterLabel(timeFilter)}</p>
        <WaterBarChart
          values={history.values}
          labels={history.labels}
          selectedIndex={barIndex}
          onSelect={setBarIndex}
        />
        {barIndex !== null && (
          <ChartDetailPanel
            title={`${history.labels[barIndex]} — consumo`}
            detail={`${history.values[barIndex].toLocaleString("pt-BR")} litros no período ${filterLabel(timeFilter).toLowerCase()}.`}
          />
        )}
      </DashboardCard>
      <DashboardCard>
        <p className={`${labelMuted} mb-4`}>Irrigação por setor</p>
        <DataTable caption="Irrigação">
          <thead>
            <tr>
              <th className={thClass}>Setor</th>
              <th className={thClass}>Consumo</th>
              <th className={thClass}>Meta</th>
              <th className={thClass}>Economia</th>
              <th className={thClass}>Eficiência</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DASHBOARD_DATA.water.irrigationBySector.map((row) => (
              <tr key={row.sector} className="hover:bg-slate-50">
                <td className={`${tdClass} font-medium`}>{row.sector}</td>
                <td className={`${tdClass} tabular-nums`}>{row.used} L</td>
                <td className={`${tdClass} tabular-nums text-preto-suave/55`}>{row.target} L</td>
                <td className={`${tdClass} font-semibold text-verde-floresta`}>{row.save}</td>
                <td className={`${tdClass} font-bold tabular-nums`}>{row.efficiency}%</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </DashboardCard>
    </div>
  );
}

/* ─── Main ─── */

const Plataform = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<ViewId>("overview");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("daily");

  const [climate, setClimate] = useState({ ...MOCK_DASHBOARD_DATA.climate.current });
  const [soil, setSoil] = useState({ ...MOCK_DASHBOARD_DATA.soil.current });
  const [water, setWater] = useState({ ...MOCK_DASHBOARD_DATA.water.current });

  const [selectedNutrient, setSelectedNutrient] = useState<string | null>(null);
  const [selectedWaterSeg, setSelectedWaterSeg] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const id = window.setInterval(() => {
      setClimate((p) => ({
        temperature: clamp(p.temperature + (Math.random() - 0.5) * 0.4, 18, 36),
        humidity: clamp(p.humidity + (Math.random() - 0.5) * 2, 40, 95),
        wind: clamp(p.wind + (Math.random() - 0.5) * 1.2, 4, 28),
      }));
      setSoil((p) => ({
        ...p,
        moisture: clamp(p.moisture + (Math.random() - 0.5) * 1.5, 35, 85),
      }));
      setWater((p) => ({
        ...p,
        consumptionLiters: Math.round(p.consumptionLiters + (Math.random() - 0.45) * 20),
      }));
    }, 8000);
    return () => window.clearInterval(id);
  }, [isAuthenticated]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const fn = () => {
      if (mq.matches) setIsSidebarOpen(false);
    };
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const renderView = useMemo(() => {
    switch (currentView) {
      case "overview":
        return <OverviewView climate={climate} soil={soil} water={water} timeFilter={timeFilter} />;
      case "alerts":
        return <AlertsView />;
      case "climate":
        return <ClimateView climate={climate} timeFilter={timeFilter} />;
      case "soil":
        return (
          <SoilView soil={soil} selectedNutrient={selectedNutrient} onSelectNutrient={setSelectedNutrient} />
        );
      case "growth":
        return <GrowthView selectedCrop={selectedCrop} onSelectCrop={setSelectedCrop} />;
      case "water":
        return (
          <WaterView
            water={water}
            timeFilter={timeFilter}
            selectedSegment={selectedWaterSeg}
            onSelectSegment={setSelectedWaterSeg}
          />
        );
      default:
        return null;
    }
  }, [currentView, climate, soil, water, timeFilter, selectedNutrient, selectedWaterSeg, selectedCrop]);

  if (!isAuthenticated) {
    return (
      <LoginScreen
        mode={authMode}
        onModeChange={setAuthMode}
        onSubmit={() => setIsAuthenticated(true)}
      />
    );
  }

  return (
    <div className={`flex h-full min-h-0 w-full overflow-hidden ${shellBg}`}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((o) => !o)}
        currentView={currentView}
        onNavigate={(v) => {
          setCurrentView(v);
          setSelectedNutrient(null);
          setSelectedWaterSeg(null);
          setSelectedCrop(null);
        }}
        onLogout={() => {
          setIsAuthenticated(false);
          setCurrentView("overview");
        }}
      />

      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain ${shellBg}`}
        role="main"
      >
        <div className={`mx-auto w-full max-w-7xl py-6 sm:py-8 ${contentPad}`}>
          <PageToolbar view={currentView} timeFilter={timeFilter} onTimeFilterChange={setTimeFilter} />
          {renderView}
        </div>
      </div>
    </div>
  );
};

export default Plataform;
