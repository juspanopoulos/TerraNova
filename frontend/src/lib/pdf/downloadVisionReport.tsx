import { pdf } from "@react-pdf/renderer";
import {
  buildVisionReportData,
  visionReportFilename,
  type VisionReportData,
} from "@/lib/dashboard/visionReportData";
import { VisionReportDocument } from "@/lib/pdf/VisionReportDocument";
import type { CompanyProfile, TimeFilter } from "@/types/dashboard";

const LOGO_PATH = "/logos/logo-colorido.png";

let cachedLogo: string | null = null;

async function loadLogoDataUrl(): Promise<string> {
  if (cachedLogo) return cachedLogo;
  const response = await fetch(LOGO_PATH);
  if (!response.ok) {
    throw new Error("Não foi possível carregar o logo TerraNova para o PDF.");
  }
  const blob = await response.blob();
  cachedLogo = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Falha ao converter o logo."));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Falha ao ler o logo."));
    reader.readAsDataURL(blob);
  });
  return cachedLogo;
}

export async function downloadVisionReport(
  timeFilter: TimeFilter,
  company: CompanyProfile,
): Promise<void> {
  const data = buildVisionReportData(timeFilter, company);
  const logoSrc = await loadLogoDataUrl();
  const blob = await pdf(<VisionReportDocument data={data} logoSrc={logoSrc} />).toBlob();
  triggerDownload(blob, visionReportFilename(data));
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export type { VisionReportData };
