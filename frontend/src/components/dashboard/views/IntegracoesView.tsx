import { Cloud, Cpu, Radio, Wifi } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/ui";
import {
  badgeMuted,
  btnClick,
  btnDisabled,
  gridCols2,
  labelMuted,
  sectionTitle,
  textMuted,
  textPrimary,
} from "@/constants/dashboard";

const INTEGRATIONS = [
  {
    id: "sensores",
    title: "Sensores de campo",
    description: "Conecte estações meteorológicas, sensores de solo e medidores de umidade.",
    icon: Radio,
    status: "Em breve",
  },
  {
    id: "irrigacao",
    title: "Sistemas de irrigação",
    description: "Integre controladores de gotejamento e aspersão para automação hídrica.",
    icon: Wifi,
    status: "Em breve",
  },
  {
    id: "clima",
    title: "APIs climáticas",
    description: "Importe previsões e alertas de serviços meteorológicos externos.",
    icon: Cloud,
    status: "Em breve",
  },
  {
    id: "erp",
    title: "ERP e gestão",
    description: "Sincronize dados de produção, estoque e financeiro com seu ERP.",
    icon: Cpu,
    status: "Em breve",
  },
] as const;

export function IntegracoesView() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardCard>
        <p className={labelMuted}>Conectividade</p>
        <h2 className={`mt-1 ${sectionTitle}`}>Integrações</h2>
        <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${textMuted}`}>
          Centralize conexões com sensores, APIs e sistemas externos. Esta área será o ponto de
          configuração de todas as integrações da plataforma TerraNova.
        </p>
      </DashboardCard>

      <div className={gridCols2}>
        {INTEGRATIONS.map(({ id, title, description, icon: Icon, status }) => (
          <DashboardCard key={id} className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-verde-floresta/10 text-verde-floresta">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className={badgeMuted}>{status}</span>
            </div>
            <h3 className={`mt-4 text-base font-bold ${textPrimary}`}>{title}</h3>
            <p className={`mt-2 flex-1 text-sm leading-relaxed ${textMuted}`}>{description}</p>
            <button type="button" disabled className={`${btnClick} mt-4 ${btnDisabled}`}>
              Configurar
            </button>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
