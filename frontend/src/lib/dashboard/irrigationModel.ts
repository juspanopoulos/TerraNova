export const IRRIGATION_CROP_OPTIONS = [
  { value: "Wheat", label: "Trigo" },
  { value: "Maize", label: "Milho" },
  { value: "Cotton", label: "Algodão" },
  { value: "Rice", label: "Arroz" },
  { value: "Sugarcane", label: "Cana-de-açúcar" },
  { value: "Potato", label: "Batata" },
];

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function inferIrrigationCrop(value: string | null | undefined) {
  const text = normalize(value);
  if (text.includes("trigo") || text.includes("wheat")) return "Wheat";
  if (text.includes("milho") || text.includes("maize") || text.includes("corn")) return "Maize";
  if (text.includes("algod")) return "Cotton";
  if (text.includes("arroz") || text.includes("rice")) return "Rice";
  if (text.includes("cana") || text.includes("sugar")) return "Sugarcane";
  if (text.includes("batata") || text.includes("potato")) return "Potato";
  return "";
}

export function isIrrigationCropSupported(cropName: string | null | undefined) {
  return Boolean(inferIrrigationCrop(cropName));
}

export function irrigationCropLabel(value: string) {
  return IRRIGATION_CROP_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function irrigationSituationLabel(value: string | null | undefined) {
  const text = normalize(value).replace(/[_-]+/g, " ");
  if (!text) return "Não informada";
  const labels: Record<string, string> = {
    "ainda pode regar": "Pode irrigar mais",
    "esta perfeito": "Irrigação adequada",
    "esta gastando mais agua do que o necessario": "Está gastando mais água do que o necessário",
    "deficit moderado": "Déficit moderado",
  };
  return labels[text] ?? value ?? "Não informada";
}
