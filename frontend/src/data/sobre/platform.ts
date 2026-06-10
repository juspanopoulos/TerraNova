import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Cloud,
  Droplets,
  LayoutDashboard,
  Leaf,
  Sprout,
  Waypoints,
} from "lucide-react";
import decidirComCalmaImg from "@/assets/images/sobre/decidir-com-calma.png";
import noSeuTempoImg from "@/assets/images/sobre/no-seu-tempo.png";
import verOQueImportaImg from "@/assets/images/sobre/ver-o-que-importa.png";
import alertasPreviewImg from "@/assets/images/sobre/painel/alertas.png";
import consumoHidricoPreviewImg from "@/assets/images/sobre/painel/consumo-hidrico.png";
import controleClimaticoPreviewImg from "@/assets/images/sobre/painel/controle-climatico.png";
import controleSoloPreviewImg from "@/assets/images/sobre/painel/controle-solo.png";
import previsaoColheitasPreviewImg from "@/assets/images/sobre/painel/previsao-colheitas.png";
import visaoGeralPreviewImg from "@/assets/images/sobre/painel/visao-geral.png";

export type PlatformModule = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  previewImage?: string | null;
};

export const platformModules: PlatformModule[] = [
  {
    id: "overview",
    title: "Visão Geral",
    description:
      "Painel unificado com indicadores da propriedade, clima, solo, água e alertas em um só lugar.",
    icon: LayoutDashboard,
    previewImage: visaoGeralPreviewImg,
  },
  {
    id: "alerts",
    title: "Alertas",
    description:
      "Antecipe riscos como seca, calor extremo e enchente com sinais claros e priorização por criticidade.",
    icon: Bell,
    previewImage: alertasPreviewImg,
  },
  {
    id: "climate",
    title: "Controle Climático",
    description:
      "Temperatura, umidade, vento e previsões reunidos para reduzir incertezas antes da safra sofrer.",
    icon: Cloud,
    previewImage: controleClimaticoPreviewImg,
  },
  {
    id: "soil",
    title: "Controle do Solo",
    description:
      "Monitore umidade e saúde do solo por setor, com leituras que orientam irrigação e manejo.",
    icon: Leaf,
    previewImage: controleSoloPreviewImg,
  },
  {
    id: "growth",
    title: "Previsão de Colheitas",
    description:
      "Acompanhe maturação das culturas e janelas de colheita com base em dados históricos e atuais.",
    icon: Sprout,
    previewImage: previsaoColheitasPreviewImg,
  },
  {
    id: "water",
    title: "Consumo Hídrico",
    description:
      "Eficiência de irrigação, comparativos por setor e economia de água com metas visíveis.",
    icon: Droplets,
    previewImage: consumoHidricoPreviewImg,
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
    detail: "Compare hoje, esta semana, o mês passado ou o ano anterior sem montar relatório na mão.",
  },
  {
    value: "6",
    label: "Ferramentas juntas",
    detail: "Cultivo, água, solo e alertas convivem na mesma tela, sem app extra.",
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
      "Quando algo muda no campo, a plataforma reflete isso, você não precisa caçar informação.",
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
    title: "Acompanhe e aprenda",
    description:
      "Compare os dados do campo e volte depois com mais segurança na próxima escolha.",
    icon: LayoutDashboard,
  },
];

export const missionCopy = {
  eyebrow: "Nossa proposta",
  title: "Cuidar da terra pode ser mais leve",
  body: "Queremos que você tenha o que importa em um só lugar, de um jeito claro e tranquilo, para viver o dia a dia na propriedade com mais calma e menos preocupação.",
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
    "A TerraNova nasce com uma identidade natural, acolhedora e preparada para crescer em páginas institucionais, conteúdos e experiências interativas.",
    "A plataforma reúne monitoramento climático, gestão hídrica, saúde do solo, previsão de colheitas e alertas ambientais em um fluxo contínuo, do sensor ao gestor, do dado a decisão.",
  ],
};
