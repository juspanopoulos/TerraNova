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
  Waypoints,
} from "lucide-react";
import decidirComCalmaImg from "@/assets/images/sobre/decidir-com-calma.png";
import noSeuTempoImg from "@/assets/images/sobre/no-seu-tempo.png";
import verOQueImportaImg from "@/assets/images/sobre/ver-o-que-importa.png";

export type PlatformModule = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Substituir pela captura do dashboard quando disponível */
  previewImage?: string | null;
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

export const platformHighlights: {
  value: string;
  label: string;
  detail: string;
}[] = [
  {
    value: "4",
    label: "Recortes de tempo",
    detail: "Compare hoje, esta semana ou o mês passado sem montar relatório na mão.",
  },
  {
    value: "8+",
    label: "Ferramentas juntas",
    detail: "Cultivo, água, alertas e anotações convivem na mesma tela — sem app extra.",
  },
  {
    value: "1",
    label: "Porta de entrada",
    detail: "Abra o dia pela visão geral e veja onde merece atenção primeiro.",
  },
];

export const howItWorksCopy = {
  eyebrow: "Como funciona",
  title: "O que muda no seu dia a dia",
  description:
    "Depois de entrar na plataforma, estes são os momentos que mais aparecem na rotina de quem cuida da propriedade.",
};

export type HowItWorksStep = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: "collect",
    title: "Chega atualizado",
    description:
      "Quando algo muda no campo, a plataforma reflete isso — você não precisa caçar informação.",
    icon: Waypoints,
  },
  {
    id: "unify",
    title: "O urgente vem primeiro",
    description:
      "Alertas importantes ganham destaque. O restante fica disponível, sem poluir a tela.",
    icon: Bell,
  },
  {
    id: "read",
    title: "Entenda num relance",
    description:
      "Gráficos e resumos pensados para quem tem pouco tempo entre uma tarefa e outra.",
    icon: LayoutDashboard,
  },
  {
    id: "decide",
    title: "Anote e aprenda",
    description:
      "Registre o que fez e volte depois com mais segurança na próxima escolha.",
    icon: NotebookPen,
  },
];

export const missionCopy = {
  eyebrow: "Nossa proposta",
  title: "Cuidar da terra pode ser mais leve",
  body: "Queremos que você tenha o que importa em um só lugar, de um jeito claro e tranquilo — para viver o dia a dia na propriedade com mais calma e menos preocupação.",
};

export const missionPillars: {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
}[] = [
  {
    id: "territory",
    title: "Ver o que importa",
    image: decidirComCalmaImg,
    imageAlt: "Vista ampla de plantação verde",
  },
  {
    id: "clarity",
    title: "Decidir com calma",
    image: verOQueImportaImg,
    imageAlt: "Campo dourado ao entardecer",
  },
  {
    id: "rhythm",
    title: "No seu tempo",
    image: noSeuTempoImg,
    imageAlt: "Paisagem rural tranquila",
  },
];

export const introCopy = {
  paragraphs: [
    "A TerraNova nasce com uma identidade natural, acolhedora e preparada para crescer em paginas institucionais, conteudo e experiencias interativas.",
    "A plataforma reune monitoramento climatico, gestao hidrica, saude do solo, previsao de colheitas e alertas ambientais em um fluxo continuo — do sensor ao gestor, do dado a decisao.",
  ],
};
