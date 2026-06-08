import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { tooltipSurface, textMuted, textPrimary } from "@/constants/dashboard";

export type CursorPoint = { x: number; y: number };

export function cursorPointIn(container: HTMLElement, event: ReactMouseEvent): CursorPoint {
  const rect = container.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

const CURSOR_OFFSET = 12;

export function ChartTooltip({
  x,
  y,
  label,
  value,
  detail,
}: {
  x: number;
  y: number;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute z-20 max-w-[220px] ${tooltipSurface} dashboard-tooltip-in`}
      style={{ left: x, top: y, transform: `translate(${CURSOR_OFFSET}px, ${CURSOR_OFFSET}px)` }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-verde-floresta/75">
        {label}
      </p>
      <p className={`mt-0.5 font-bold tabular-nums ${textPrimary}`}>{value}</p>
      {detail && (
        <p className={`mt-1 text-[11px] leading-snug ${textMuted}`}>{detail}</p>
      )}
    </div>
  );
}

export function CursorTooltip({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <div
      className={`pointer-events-none absolute z-20 ${tooltipSurface} dashboard-tooltip-in whitespace-nowrap`}
      style={{ left: x, top: y, transform: `translate(${CURSOR_OFFSET}px, ${CURSOR_OFFSET}px)` }}
    >
      {children}
    </div>
  );
}
