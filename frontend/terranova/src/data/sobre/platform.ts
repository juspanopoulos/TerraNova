import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Bot,
  Cloud,
  Droplets,
  LayoutDashboard,
  Leaf,
  NotebookPen,
  Sprout,
} from "lucide-react";

export type PlatformModule = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const platformModules: PlatformModule[] = [
  {
    id: "overview",
    title: "Visao Geral",
    description:
      "Painel unificado com indicadores da propriedade, clima, solo, agua e alertas em um so lugar.",
    icon: LayoutDashboard,
  },
  {
    id: "assistant",
    title: "Assistente TerraNova",
    description:
      "Converse com a plataforma para interpretar dados, tirar duvidas e apoiar decisoes no campo.",
    icon: Bot,
  },
  {
    id: "alerts",
    title: "Alertas",
    description:
      "Antecipe riscos como seca, calor extremo e enchente com sinais claros e priorizacao por criticidade.",
    icon: Bell,
  },
  {
    id: "climate",
    title: "Controle Climatico",
    description:
      "Temperatura, umidade, vento e previsoes reunidos para reduzir incertezas antes da safra sofrer.",
    icon: Cloud,
  },
  {
    id: "soil",
    title: "Controle do Solo",
    description:
      "Monitore umidade e saude do solo por setor, com leituras que orientam irrigacao e manejo.",
    icon: Leaf,
  },
  {
    id: "growth",
    title: "Previsao de Colheitas",
    description:
      "Acompanhe maturacao das culturas e janelas de colheita com base em dados historicos e atuais.",
    icon: Sprout,
  },
  {
    id: "water",
    title: "Consumo Hidrico",
    description:
      "Eficiencia de irrigacao, comparativos por setor e economia de agua com metas visiveis.",
    icon: Droplets,
  },
  {
    id: "notes",
    title: "Anotacoes",
    description:
      "Registre observacoes de campo, decisoes e aprendizados com editor rico e historico organizado.",
    icon: NotebookPen,
  },
];

export const platformHighlights = [
  {
    value: "4",
    label: "Visoes temporais",
    detail: "Dia, semana, mes e ano para ler o territorio em diferentes escalas.",
  },
  {
    value: "8+",
    label: "Modulos integrados",
    detail: "Clima, solo, agua, colheitas, alertas e assistente conectados entre si.",
  },
  {
    value: "1",
    label: "Painel central",
    detail: "Tudo converge na visao geral para decisao rapida e contexto completo.",
  },
] as const;

export const missionCopy = {
  eyebrow: "Nossa proposta",
  title: "Tecnologia que respeita o ritmo do territorio",
  body: "A TerraNova traduz sinais do ambiente em informacao acionavel. Menos planilhas soltas, mais clareza para quem cuida da terra todos os dias.",
};

export const introCopy = {
  paragraphs: [
    "A TerraNova nasce com uma identidade natural, acolhedora e preparada para crescer em paginas institucionais, conteudo e experiencias interativas.",
    "A plataforma reune monitoramento climatico, gestao hidrica, saude do solo, previsao de colheitas e alertas ambientais em um fluxo continuo — do sensor ao gestor, do dado a decisao.",
  ],
};
