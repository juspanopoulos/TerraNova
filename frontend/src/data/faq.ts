import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  HelpCircle,
  Leaf,
  Lock,
  Sprout,
} from "lucide-react";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  items: FaqItem[];
};

export const faqCategories: FaqCategory[] = [
  {
    id: "sobre",
    label: "Sobre",
    description:
      "O essencial sobre o que é o TerraNova e para quem ela foi pensada.",
    icon: Leaf,
    items: [
      {
        id: "o-que-e",
        question: "O que é o TerraNova?",
        answer:
          "O TerraNova é uma plataforma digital para acompanhar a propriedade rural com mais clareza. Ela reúne clima, solo, consumo de água, previsão de colheitas e alertas ambientais em um painel pensado para quem precisa decidir com calma, sem perder tempo caçando informação.",
      },
      {
        id: "publico",
        question: "Para quem o TerraNova foi pensada?",
        answer:
          "Para produtores, gestores e equipes que cuidam de propriedades rurais e querem enxergar o território de forma integrada. A interface prioriza leitura rápida e linguagem acessível, sem exigir que você seja especialista em tecnologia ou em análise de dados.",
      },
      {
        id: "diferencial",
        question: "O que muda em relação a planilhas e apps separados?",
        answer:
          "Em vez de alternar entre ferramentas e sensores, o TerraNova centraliza indicadores e alertas num único fluxo. Você abre a Visão Geral, vê o que merece atenção primeiro e aprofunda nos módulos de clima, solo, água ou colheitas conforme a necessidade do dia.",
      },
    ],
  },
  {
    id: "modulos",
    label: "Módulos",
    description:
      "Como funcionam as principais áreas da plataforma no dia a dia.",
    icon: Cloud,
    items: [
      {
        id: "visao-geral",
        question: "O que encontro na Visão Geral?",
        answer:
          "É a porta de entrada do dashboard: um resumo com indicadores da propriedade, clima atual, estado do solo, consumo hídrico e alertas recentes. A ideia é que você saiba, em poucos segundos, onde focar antes de mergulhar nos detalhes.",
      },
      {
        id: "alertas",
        question: "Que tipo de alertas a plataforma envia?",
        answer:
          "Alertas sobre condições que podem afetar a safra ou a operação: seca prolongada, calor extremo, chuva intensa, umidade do solo fora da faixa ideal e outros sinais configuráveis. Eles aparecem priorizados por criticidade para você agir no que é urgente.",
      },
      {
        id: "recortes",
        question: "Quais recortes de tempo existem na plataforma?",
        answer:
          "Além da Visão Geral, há visões por dia, semana, mês e anual. Isso facilita comparar períodos, identificar tendências e preparar relatórios sem montar planilhas manualmente.",
      },
    ],
  },
  {
    id: "dados",
    label: "Dados",
    description:
      "De onde vêm as informações e como acompanhar cada setor.",
    icon: Sprout,
    items: [
      {
        id: "origem-dados",
        question: "De onde vêm os dados climáticos e de solo?",
        answer:
          "lorem ipsum",
      },
      {
        id: "setores",
        question: "Consigo acompanhar diferentes áreas da propriedade?",
        answer:
          "Sim. Módulos como Controle do Solo e Consumo Hídrico permitem comparar setores ou talhões, identificar onde a irrigação pode ser otimizada e onde o solo precisa de atenção extra.",
      },
      {
        id: "colheitas",
        question: "Como funciona a Previsão de Colheitas?",
        answer:
          "lorem ipsum",
      },
    ],
  },
  {
    id: "conta",
    label: "Conta",
    description:
      "Entrar na plataforma, personalizar a propriedade e cuidar dos seus dados.",
    icon: Lock,
    items: [
      {
        id: "acesso",
        question: "Como acesso a plataforma?",
        answer:
          "Pelo menu Plataforma no site. Na primeira visita, você passa pela tela de login e pode cadastrar a propriedade. Depois disso, o dashboard fica disponível com todos os módulos.",
      },
      {
        id: "configuracao",
        question: "Posso configurar dados da minha propriedade?",
        answer:
          "Sim. Em Configurações você encontra opções gerais, dados da empresa ou propriedade e integrações com sensores ou serviços externos. Quanto mais completo o cadastro, mais precisa fica a leitura no painel.",
      },
      {
        id: "seguranca",
        question: "Meus dados ficam seguros?",
        answer:
          "lorem ipsum",
      },
    ],
  },
  {
    id: "suporte",
    label: "Suporte",
    description:
      "Quando a resposta não está aqui, estes são os próximos passos.",
    icon: HelpCircle,
    items: [
      {
        id: "nao-encontrei",
        question: "Não encontrei minha pergunta aqui. E agora?",
        answer:
          "Se a resposta não está aqui, entre em contato pela [Contato]. Envie sua dúvida e a equipe TerraNova responde o mais breve possível.",
      },
      {
        id: "feedback",
        question: "Posso sugerir melhorias ou novos módulos?",
        answer:
          "Sim! Adoramos receber ideias de quem usa a plataforma. Acesse a [Contato] e conte o que faria diferença no seu dia a dia no campo.",
      },
    ],
  },
];
