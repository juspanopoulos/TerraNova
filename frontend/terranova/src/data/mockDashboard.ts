import type { AlertLevel } from "@/types/dashboard";

export type AlertItem = {
  id: string;
  level: AlertLevel;
  title: string;
  type: string;
  sector: string;
  time: string;
  summary: string;
};

export const MOCK_DASHBOARD_DATA = {
  property: { name: "Fazenda Terra Nova", region: "Sul de Minas" },
  climate: {
    current: { temperature: 24.6, humidity: 68, wind: 12.4 },
    history: {
      daily: {
        labels: [
          "00h",
          "02h",
          "04h",
          "06h",
          "08h",
          "10h",
          "12h",
          "14h",
          "16h",
          "18h",
          "20h",
          "22h",
          "Agora",
        ],
        temperature: [18, 18.5, 19, 20, 21, 22, 24, 25, 24.6, 23, 22, 21, 20],
        humidity: [74, 73, 72, 71, 68, 66, 63, 61, 68, 70, 72, 71, 68],
        wind: [7, 7.5, 8, 8.5, 9, 10, 12, 13, 12.4, 11, 10, 9.5, 9],
      },
      weekly: {
        labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        temperature: [22, 23, 24, 25, 24, 23, 22],
        humidity: [65, 67, 68, 70, 69, 66, 64],
        wind: [10, 11, 12, 13, 12, 11, 10],
      },
      monthly: {
        labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
        temperature: [23, 24, 25, 24.6],
        humidity: [66, 67, 68, 68],
        wind: [11, 12, 12, 12.4],
      },
      yearly: {
        labels: ["Jan", "Mar", "Mai", "Jul", "Set", "Nov"],
        temperature: [26, 24, 22, 20, 23, 25],
        humidity: [70, 68, 65, 62, 66, 69],
        wind: [9, 10, 11, 12, 11, 10],
      },
    },
  },
  soil: {
    current: { nitrogen: 42, phosphorus: 28, potassium: 55, moisture: 61, ph: 6.4 },
    sectors: [
      { sector: "Talhão A", moisture: 64, ph: 6.5, status: "Normal" },
      { sector: "Talhão B", moisture: 58, ph: 6.3, status: "Normal" },
      { sector: "Estufa", moisture: 71, ph: 6.8, status: "Úmido" },
      { sector: "Serra Norte", moisture: 52, ph: 6.1, status: "Atenção" },
      { sector: "Reserva", moisture: 49, ph: 5.9, status: "Seco" },
    ],
    nutrients: [
      { id: "n", value: 42, color: "#3F6B4B", label: "Nitrogênio (N)", detail: "Nível adequado para fase vegetativa." },
      { id: "p", value: 28, color: "#A8C7A1", label: "Fósforo (P)", detail: "Reforço leve recomendado em 10 dias." },
      { id: "k", value: 55, color: "#E59B3A", label: "Potássio (K)", detail: "Excelente reserva para floração." },
    ],
  },
  crops: [
    { id: "soja", name: "Soja", zone: "Talhão A", maturity: 72, week: "Sem. 12", estimate: "18–22 Out", status: "Em maturação" },
    { id: "milho", name: "Milho", zone: "Talhão B", maturity: 45, week: "Sem. 8", estimate: "05–12 Nov", status: "Crescimento" },
    { id: "cafe", name: "Café", zone: "Serra Norte", maturity: 88, week: "Sem. 22", estimate: "Mar/2027", status: "Pré-colheita" },
    { id: "horta", name: "Hortaliças", zone: "Estufa", maturity: 34, week: "Sem. 5", estimate: "Contínuo", status: "Inicial" },
  ],
  water: {
    current: { consumptionLiters: 1840, savingsLiters: 32000, efficiency: 91 },
    distribution: [
      { id: "gotejamento", value: 45, color: "#3F6B4B", label: "Gotejamento", detail: "828 L — maior eficiência por zona." },
      { id: "aspersao", value: 30, color: "#A8C7A1", label: "Aspersão", detail: "552 L — Talhões A e B." },
      { id: "reservatorio", value: 15, color: "#E59B3A", label: "Reservatório", detail: "276 L — reserva estratégica." },
      { id: "recuperacao", value: 10, color: "#94a3b8", label: "Recuperação", detail: "184 L — reuso de drenagem." },
    ],
    irrigationBySector: [
      { sector: "Talhão A", used: 620, target: 700, save: "11%", efficiency: 94 },
      { sector: "Talhão B", used: 480, target: 550, save: "13%", efficiency: 92 },
      { sector: "Estufa", used: 410, target: 480, save: "15%", efficiency: 89 },
      { sector: "Serra Norte", used: 330, target: 400, save: "18%", efficiency: 87 },
    ],
    history: {
      daily: { labels: ["6h", "9h", "12h", "15h", "18h", "21h", "Agora"], values: [320, 410, 520, 480, 390, 280, 1840] },
      weekly: { labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"], values: [2100, 1950, 1880, 1920, 1840, 1760, 1800] },
      monthly: { labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"], values: [8200, 7900, 7600, 7400] },
      yearly: { labels: ["Jan", "Mar", "Mai", "Jul", "Set", "Nov"], values: [28000, 26500, 25000, 24000, 25500, 27000] },
    },
  },
  alerts: [
    {
      id: "1",
      level: "critical",
      title: "Risco de geada",
      type: "Temperatura",
      sector: "Serra Norte",
      time: "04/06 · 05:48",
      summary: "Temp. < 2°C entre 04h–06h. Proteger café e hortaliças.",
    },
    {
      id: "2",
      level: "warning",
      title: "Onda de calor",
      type: "UV / Calor",
      sector: "Talhão A",
      time: "04/06 · 04:30",
      summary: "UV alto por 3 dias. Revisar irrigação e sombreamento.",
    },
    {
      id: "3",
      level: "normal",
      title: "Chuva moderada",
      type: "Precipitação",
      sector: "Geral",
      time: "04/06 · 02:15",
      summary: "8–12 mm previstos. Irrigação reduzida automaticamente.",
    },
    {
      id: "4",
      level: "warning",
      title: "Vento forte",
      type: "Vento",
      sector: "Talhão B",
      time: "03/06 · 22:00",
      summary: "Rajadas > 40 km/h. Estacas e coberturas sendo reforçadas.",
    },
    {
      id: "5",
      level: "normal",
      title: "Umidade estável",
      type: "Umidade",
      sector: "Estufa",
      time: "03/06 · 18:40",
      summary: "Faixa ideal mantida entre 65–72%.",
    },
    {
      id: "6",
      level: "critical",
      title: "Solo seco — Reserva",
      type: "Solo",
      sector: "Reserva",
      time: "03/06 · 14:20",
      summary: "Umidade em 49%. Acionar irrigação de emergência.",
    },
    {
      id: "7",
      level: "warning",
      title: "Irrigação adiada",
      type: "Precipitação",
      sector: "Talhão A",
      time: "03/06 · 11:00",
      summary: "Aguardando fim da chuva prevista para retomar gotejamento.",
    },
    {
      id: "8",
      level: "critical",
      title: "Déficit hídrico",
      type: "Solo",
      sector: "Talhão B",
      time: "03/06 · 09:15",
      summary: "Umidade abaixo de 45% por 6h. Irrigação intensificada.",
    },
    {
      id: "9",
      level: "normal",
      title: "Pressão atmosférica estável",
      type: "Clima",
      sector: "Geral",
      time: "02/06 · 16:30",
      summary: "Sem alteração significativa prevista nas próximas 48h.",
    },
    {
      id: "10",
      level: "warning",
      title: "Sensor offline — Estufa",
      type: "Equipamento",
      sector: "Estufa",
      time: "02/06 · 08:00",
      summary: "Reconectado após reinício automático do módulo.",
    },
  ] satisfies AlertItem[],
};
