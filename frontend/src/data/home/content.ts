import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Bot,
  Cloud,
  CloudRain,
  Droplets,
  Flame,
  LayoutDashboard,
  Leaf,
  Sprout,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import germinacaoImg from "@/assets/images/home/germinacao.jpg";
import DesenvolvimentoImg from "@/assets/images/home/desenvolvimento.jpg";
import trigoImg from "@/assets/images/home/trigo.jpg";
import { ROUTES } from "@/constants/routes";

export const homeManifesto = {
  eyebrow: "Sistema Inteligente",
  title: "Inteligência territorial para quem",
  titleAccent: "vive o campo",
  body: "Clima, água, solo e alertas da sua propriedade reunidos para você decidir com confiança, safra após safra.",
  pillars: [
    {
      id: "climate",
      title: "Clima",
      description: "Leituras e previsão para planejar o dia no talhão.",
      icon: Cloud,
    },
    {
      id: "water",
      title: "Água",
      description: "Irrigação eficiente, setor por setor.",
      icon: Droplets,
    },
    {
      id: "alerts",
      title: "Alertas",
      description: "Avisos antes que o imprevisto vire prejuízo.",
      icon: Bell,
    },
  ],
} as const;

export const climateCopy = {
  eyebrow: "Monitoramento climático",
  title: "Leitura do Céu",
  body: "Sensores e previsão local num painel claro.",
  imageCaption:
    "Leituras do campo e previsão local no mesmo fluxo, para você planejar o dia sem adivinhar o que vem depois das nuvens.",
};

export const climateStats: {
  id: string;
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}[] = [
  {
    id: "temp",
    label: "Temperatura",
    value: "28°C",
    detail: "Média da estação do talhão.",
    icon: Thermometer,
  },
  {
    id: "humidity",
    label: "Umidade",
    value: "62%",
    detail: "Umidade relativa do ar.",
    icon: Droplets,
  },
  {
    id: "wind",
    label: "Vento",
    value: "14 km/h",
    detail: "Velocidade e direção do vento.",
    icon: Wind,
  },
];

export const growthCopy = {
  eyebrow: "Acompanhamento da safra",
  title: "Do plantio à colheita, fase por fase",
  body: "Acompanhe como a lavoura evolui no seu talhão e saiba o que fazer em cada etapa do ciclo.",
};

export const growthStages = [
  {
    id: "sprout",
    phase: "Germinação",
    title: "Plantio e irrigação",
    detail:
      "Veja se o solo e o tempo estão bons antes de plantar ou ligar a irrigação.",
    image: germinacaoImg,
    imageAlt: "Mudas de trigo brotando em fileiras no solo bege ao amanhecer",
  },
  {
    id: "growth",
    phase: "Desenvolvimento",
    title: "Lavoura crescendo",
    detail:
      "Compare esta safra com as anteriores e perceba o que mudou no campo.",
    image: DesenvolvimentoImg,
    imageAlt: "Fileiras de trigo em crescimento sob luz suave no campo",
  },
  {
    id: "harvest",
    phase: "Colheita",
    title: "Hora de colher",
    detail:
      "Acompanhe a maturação da cultura para não perder o momento certo da colheita.",
    image: trigoImg,
    imageAlt: "Campo de trigo maduro iluminado por luz dourada ao entardecer",
  },
] as const;

export const waterCopy = {
  eyebrow: "Gestão hídrica",
  title: "A Rota da Água",
  body: "Consumo por setor e alertas quando algo foge do padrão.",
  imageCaption:
    "Cada setor com leitura própria, você enxerga onde a água vai, onde dá para economizar e quando agir.",
};

export const waterStats = [
  {
    id: "efficiency",
    label: "Eficiência",
    value: "91%",
    detail: "Meta hídrica nos setores monitorados.",
    icon: Droplets,
  },
  {
    id: "saved",
    label: "Economia",
    value: "32k L",
    detail: "Volume poupado no ciclo anterior.",
    icon: CloudRain,
  },
  {
    id: "sectors",
    label: "Setores",
    value: "4",
    detail: "Setores com leitura individual.",
    icon: Leaf,
  },
] as const;

export const alertsCopy = {
  eyebrow: "Alertas ambientais",
  title: "Aviso antes que vire",
  titleAccent: "problema",
  body: "Seca, excesso de chuva ou calor intenso: receba alertas no momento certo e saiba onde agir antes que o impacto chegue ao campo.",
};

export type HomeAlert = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  stripeClass: string;
};

export const homeAlerts: HomeAlert[] = [
  {
    id: "drought",
    title: "Período seco",
    description:
      "O solo está seco há dias. Vale conferir a irrigação e o manejo da lavoura.",
    icon: Sun,
    stripeClass: "alertStripeDry",
  },
  {
    id: "flood",
    title: "Excesso de chuva",
    description:
      "Choveu além do esperado. Fique de olho em encharcamento nas partes baixas do talhão.",
    icon: CloudRain,
    stripeClass: "alertStripeRain",
  },
  {
    id: "heat",
    title: "Calor intenso",
    description:
      "Temperatura alta prevista. Cuidado redobrado com culturas mais sensíveis ao calor.",
    icon: Flame,
    stripeClass: "alertStripeHeat",
  },
];

export const platformCopy = {
  eyebrow: "A plataforma",
  title: "Ferramentas para produtores",
  body: "Do panorama do dia aos dados do campo, tudo integrado num só fluxo.",
};

export type HomeModule = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

/** Mesma ordem e nomes do menu do dashboard (`NAV_ITEMS`). */
export const homeModules: HomeModule[] = [
  {
    id: "overview",
    title: "Visão Geral",
    description:
      "Abra o dia com um panorama completo da propriedade: clima atual, alertas ativos, leituras de solo e água, e o que pede atenção primeiro. Compare dia, semana, mês ou ano sem montar relatório na mão.",
    icon: LayoutDashboard,
  },
  {
    id: "assistant",
    title: "Assistente TerraNova",
    description:
      "Converse com a plataforma para entender o que os números significam no campo. Tire dúvidas sobre clima, irrigação ou alertas e receba respostas diretas, como falar com quem conhece a sua propriedade.",
    icon: Bot,
  },
  {
    id: "alerts",
    title: "Alertas",
    description:
      "Receba avisos quando seca, calor forte ou chuva em excesso ameaçam a safra. Os alertas chegam priorizados por urgência para você saber o que olhar primeiro, antes que vire prejuízo no talhão.",
    icon: Bell,
  },
  {
    id: "climate",
    title: "Controle Climático",
    description:
      "Acompanhe temperatura, umidade, vento e previsão local num painel feito para o dia a dia no campo. Use as leituras para planejar irrigação, aplicação e trabalho com menos adivinhação.",
    icon: Cloud,
  },
  {
    id: "soil",
    title: "Controle do Solo",
    description:
      "Monitore umidade e saúde do solo setor a setor. As leituras ajudam a decidir quando irrigar, onde o manejo precisa de atenção e como a terra responde ao clima da semana.",
    icon: Leaf,
  },
  {
    id: "growth",
    title: "Previsão de Colheitas",
    description:
      "Veja em que ponto está a maturação das culturas e quando abre a janela de colheita. O módulo cruza dados atuais e histórico para você não perder o timing certo na propriedade.",
    icon: Sprout,
  },
  {
    id: "water",
    title: "Consumo Hídrico",
    description:
      "Enxergue consumo e eficiência hídrica por setor: onde a água vai, onde dá para economizar e quando algo foge do padrão. Metas e comparativos ficam visíveis para ajustar a irrigação.",
    icon: Droplets,
  },
];

export const homeCtaCopy = {
  title: "Pronto para cuidar melhor da sua terra?",
  body: "Entre na plataforma e veja clima, água e alertas da sua propriedade num só lugar.",
};

export const homeCtaLinks = [
  { label: "Acessar plataforma", to: ROUTES.plataforma, primary: true },
  { label: "Conheça TerraNova", to: ROUTES.sobre, primary: false },
  { label: "Contato", to: ROUTES.contato, primary: false },
] as const;
