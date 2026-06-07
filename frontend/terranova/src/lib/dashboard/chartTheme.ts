export function climateMetricColor(
  metric: "temperature" | "humidity" | "wind",
  darkMode: boolean,
): string {
  if (darkMode) {
    return {
      temperature: "#F0AB4A",
      humidity: "#7BC896",
      wind: "#94A3B8",
    }[metric];
  }
  return {
    temperature: "#E59B3A",
    humidity: "#3F6B4B",
    wind: "#64748b",
  }[metric];
}

const DARK_SEGMENT_MAP: Record<string, string> = {
  "#3f6b4b": "#6BA87A",
  "#a8c7a1": "#8FD4A0",
  "#e59b3a": "#F0AB4A",
  "#94a3b8": "#A8B8C8",
};

export function chartSegmentColor(color: string, darkMode: boolean): string {
  if (!darkMode) return color;
  return DARK_SEGMENT_MAP[color.toLowerCase()] ?? color;
}
