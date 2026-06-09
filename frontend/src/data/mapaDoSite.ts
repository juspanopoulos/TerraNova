import {
  Bell,
  Bot,
  Building2,
  Calendar,
  CalendarDays,
  CalendarRange,
  Cloud,
  Droplets,
  HelpCircle,
  Home,
  Info,
  LayoutDashboard,
  Leaf,
  Mail,
  Map,
  Network,
  Plug,
  Settings2,
  Sprout,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { DASHBOARD_ROUTES } from "@/constants/dashboard";

export type SitemapLink = {
  label: string;
  to: string;
  description?: string;
  icon: LucideIcon;
  /** Substituir pela captura da pagina quando disponivel */
  previewImage?: string | null;
};

export type SitemapSection = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  eyebrow: string;
  links: SitemapLink[];
};

export const sitemapSections: SitemapSection[] = [
  {
    id: "institucional",
    title: "Site institucional",
    description: "Páginas públicas do site TerraNova.",
    icon: Network,
    eyebrow: "Páginas públicas",
    links: [
      {
        label: "Inicio",
        to: ROUTES.home,
        description: "Visão geral da plataforma e módulos de monitoramento.",
        icon: Home,
      },
      {
        label: "Sobre",
        to: ROUTES.sobre,
        description: "Missão, valores e proposta do TerraNova.",
        icon: Info,
      },
      {
        label: "Equipe",
        to: ROUTES.equipe,
        description: "Quem desenvolve e sustenta o produto.",
        icon: Users,
      },
      {
        label: "FAQ",
        to: ROUTES.faq,
        description: "Perguntas frequentes sobre a plataforma.",
        icon: HelpCircle,
      },
      {
        label: "Contato",
        to: ROUTES.contato,
        description: "Canais para falar com a equipe.",
        icon: Mail,
      },
      {
        label: "Mapa do site",
        to: ROUTES.mapaDoSite,
        description: "Índice de todas as páginas navegáveis.",
        icon: Map,
      },
    ],
  },
  {
    id: "plataforma",
    title: "Plataforma",
    description: "Modulos e visões do painel TerraNova.",
    icon: LayoutDashboard,
    eyebrow: "Painel TerraNova",
    links: [
      {
        label: "Visão Geral",
        to: DASHBOARD_ROUTES.visaoGeral,
        description: "Hub com visões e indicadores da propriedade.",
        icon: LayoutDashboard,
      },
      {
        label: "Visão do Dia",
        to: DASHBOARD_ROUTES.visaoDia,
        description: "Indicadores das últimas 24 horas.",
        icon: CalendarDays,
      },
      {
        label: "Visão Semanal",
        to: DASHBOARD_ROUTES.visaoSemana,
        description: "Tendências e comparativos da semana.",
        icon: CalendarRange,
      },
      {
        label: "Visão do Mês",
        to: DASHBOARD_ROUTES.visaoMes,
        description: "Panorama consolidado do mês corrente.",
        icon: Calendar,
      },
      {
        label: "Visão Anual",
        to: DASHBOARD_ROUTES.visaoAnual,
        description: "Evolução e metas ao longo do ano.",
        icon: TrendingUp,
      },
      {
        label: "Assistente TerraNova",
        to: DASHBOARD_ROUTES.assistente,
        description: "Apoio inteligente no dia a dia no campo.",
        icon: Bot,
      },
      {
        label: "Alertas",
        to: DASHBOARD_ROUTES.alertas,
        description: "Avisos e eventos do território.",
        icon: Bell,
      },
      {
        label: "Controle Climático",
        to: DASHBOARD_ROUTES.clima,
        description: "Monitoramento de clima e previsões.",
        icon: Cloud,
      },
      {
        label: "Controle do Solo",
        to: DASHBOARD_ROUTES.solo,
        description: "Indicadores e análise do solo por setor.",
        icon: Leaf,
      },
      {
        label: "Previsão de Colheitas",
        to: DASHBOARD_ROUTES.colheitas,
        description: "Estimativas de colheita e janelas de safra.",
        icon: Sprout,
      },
      {
        label: "Consumo Hídrico",
        to: DASHBOARD_ROUTES.agua,
        description: "Uso e gestão da água na propriedade.",
        icon: Droplets,
      },
      {
        label: "Configurações — Geral",
        to: DASHBOARD_ROUTES.configuracoesGeral,
        description: "Preferências da conta e da experiência.",
        icon: Settings2,
      },
      {
        label: "Configurações — Empresa",
        to: DASHBOARD_ROUTES.configuracoesEmpresa,
        description: "Dados da propriedade e da operação.",
        icon: Building2,
      },
      {
        label: "Configurações — Integrações",
        to: DASHBOARD_ROUTES.configuracoesIntegracoes,
        description: "Conexões com outros sistemas e ferramentas.",
        icon: Plug,
      },
    ],
  },
];
