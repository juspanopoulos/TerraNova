import type { LucideIcon } from 'lucide-react'
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
} from 'lucide-react'
import germinacaoImg from '@/assets/images/home/germinacao.jpg'
import germinacao2Img from '@/assets/images/home/germinacao2.jpg'
import trigoImg from '@/assets/images/home/trigo.jpg'
import { ROUTES } from '@/constants/routes'

export const homeManifesto = {
  eyebrow: 'TerraNova',
  title: 'Inteligência territorial para quem',
  titleAccent: 'vive o campo',
  body: 'Clima, água, solo e alertas da sua propriedade — reunidos para você decidir com confiança, safra após safra.',
  pillars: [
    {
      id: 'climate',
      title: 'Clima',
      description: 'Leituras e previsão para planejar o dia no talhão.',
      icon: Cloud,
    },
    {
      id: 'water',
      title: 'Água',
      description: 'Irrigação eficiente, setor por setor.',
      icon: Droplets,
    },
    {
      id: 'alerts',
      title: 'Alertas',
      description: 'Avisos antes que o imprevisto vire prejuízo.',
      icon: Bell,
    },
  ],
} as const

export const climateCopy = {
  eyebrow: 'Monitoramento climático',
  title: 'O céu da sua propriedade, traduzido em números',
  body: 'Sensores e previsões locais cruzados num painel claro — para você sair do portão sabendo o que esperar.',
  imageCaption: 'Leituras do campo e previsão local no mesmo fluxo — sem adivinhar o que vem depois das nuvens.',
}

export const climateStats: {
  id: string
  label: string
  value: string
  detail: string
  icon: LucideIcon
}[] = [
  {
    id: 'temp',
    label: 'Temperatura',
    value: '28°C',
    detail: 'Média recente na estação mais próxima do talhão.',
    icon: Thermometer,
  },
  {
    id: 'humidity',
    label: 'Umidade',
    value: '62%',
    detail: 'Umidade relativa do ar, atualizada ao longo do dia.',
    icon: Droplets,
  },
  {
    id: 'wind',
    label: 'Vento',
    value: '14 km/h',
    detail: 'Velocidade e direção para planejar pulverização e irrigação.',
    icon: Wind,
  },
]

export const growthCopy = {
  eyebrow: 'Produtividade',
  title: 'Safra boa começa com timing certo',
  body: 'Histórico, clima e condições do solo apontam quando plantar, irrigar e colher — com dados, não achismo.',
}

export const growthStages = [
  {
    id: 'sprout',
    phase: 'Germinação',
    title: 'Janelas de manejo',
    detail: 'Irrigação e plantio no momento em que o solo e o clima pedem ação.',
    image: germinacaoImg,
    imageAlt: 'Brotos verdes germinando em recipiente de vidro',
  },
  {
    id: 'growth',
    phase: 'Desenvolvimento',
    title: 'Histórico de safra',
    detail: 'Compare ciclos passados com o atual e enxergue padrões no talhão.',
    image: germinacao2Img,
    imageAlt: 'Plantas jovens de milho em fileiras no campo ao amanhecer',
  },
  {
    id: 'harvest',
    phase: 'Colheita',
    title: 'Maturação',
    detail: 'Acompanhe o vigor da cultura e chegue na colheita com timing certo.',
    image: trigoImg,
    imageAlt: 'Espigas de trigo maduro em campo dourado',
  },
] as const

export const waterCopy = {
  eyebrow: 'Gestão hídrica',
  title: 'Água onde precisa, na medida certa',
  body: 'Consumo por setor, metas de eficiência e alertas quando algo foge do padrão.',
  imageCaption:
    'Cada setor com leitura própria — você enxerga onde a água vai e onde dá para economizar.',
}

export const waterStats = [
  {
    id: 'efficiency',
    label: 'Eficiência',
    value: '91%',
    detail: 'Meta de uso hídrico atingida nos setores monitorados.',
    icon: Droplets,
  },
  {
    id: 'saved',
    label: 'Economia',
    value: '32k L',
    detail: 'Volume poupado em relação ao ciclo anterior.',
    icon: CloudRain,
  },
  {
    id: 'sectors',
    label: 'Setores',
    value: '4',
    detail: 'Talhões e setores de irrigação com leitura individual.',
    icon: Leaf,
  },
] as const

export const alertsCopy = {
  eyebrow: 'Alertas ambientais',
  title: 'Quando o campo pede atenção, você fica sabendo',
  body: 'Seca, chuva em excesso ou calor intenso — avisos claros e priorizados para a sua propriedade.',
}

export type HomeAlert = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  stripeClass: string
}

export const homeAlerts: HomeAlert[] = [
  {
    id: 'drought',
    title: 'Período seco',
    description: 'Umidade persistente abaixo do ideal — revise irrigação e manejo.',
    icon: Sun,
    stripeClass: 'alertStripeDry',
  },
  {
    id: 'flood',
    title: 'Excesso de chuva',
    description: 'Risco de encharcamento ou saturação do solo em áreas críticas.',
    icon: CloudRain,
    stripeClass: 'alertStripeRain',
  },
  {
    id: 'heat',
    title: 'Calor intenso',
    description: 'Picos de temperatura previstos — proteja culturas sensíveis.',
    icon: Flame,
    stripeClass: 'alertStripeHeat',
  },
]

export const platformCopy = {
  eyebrow: 'A plataforma',
  title: 'Ferramentas feitas para a rotina do produtor',
  body: 'Do panorama do dia às anotações de campo — tudo integrado num só fluxo.',
}

export type HomeModule = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  featured?: boolean
}

export const homeModules: HomeModule[] = [
  {
    id: 'overview',
    title: 'Visão Geral',
    description: 'Panorama completo da propriedade em um só painel.',
    icon: LayoutDashboard,
    featured: true,
  },
  {
    id: 'climate',
    title: 'Clima',
    description: 'Temperatura, vento, umidade e previsão integrados.',
    icon: Cloud,
  },
  {
    id: 'water',
    title: 'Água',
    description: 'Consumo e eficiência hídrica por setor.',
    icon: Droplets,
  },
  {
    id: 'alerts',
    title: 'Alertas',
    description: 'Avisos priorizados por urgência e impacto.',
    icon: Bell,
  },
  {
    id: 'growth',
    title: 'Colheitas',
    description: 'Janelas de maturação e colheita previstas.',
    icon: Sprout,
  },
  {
    id: 'assistant',
    title: 'Assistente',
    description: 'Interpretação dos dados em linguagem simples.',
    icon: Bot,
    featured: true,
  },
]

export const homeCtaCopy = {
  title: 'Pronto para cuidar melhor da sua terra?',
  body: 'Entre na plataforma e veja clima, água e alertas da sua propriedade num só lugar.',
}

export const homeCtaLinks = [
  { label: 'Acessar plataforma', to: ROUTES.plataforma, primary: true },
  { label: 'Conheça a TerraNova', to: ROUTES.sobre, primary: false },
  { label: 'Contato', to: ROUTES.contato, primary: false },
] as const
