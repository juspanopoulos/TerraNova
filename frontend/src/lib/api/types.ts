export type DashboardIndicadoresResponse = {
  totalEmpresas: number;
  totalPropriedades: number;
  totalAreas: number;
  totalCulturas: number;
  totalPlantiosAtivos: number;
  totalAlertasAbertos: number;
  totalRecomendacoesPendentes: number;
  totalPredicoesIa: number;
  mediaTemperatura: number;
  mediaUmidadeSolo: number;
  aguaSugeridaPendenteMm: number;
};

export type DadoClimaticoResponse = {
  idDado: number;
  idArea: number;
  dataColeta: string;
  dataReferencia: string | null;
  temperatura: number;
  umidade: number;
  precipitacao: number | null;
  indiceUv: number | null;
  velocidadeVentoKmh: number | null;
  radiacaoSolar: number | null;
  fonteApi: "NASA" | "ESA" | "INMET" | "MANUAL" | string;
};

export type LeituraSoloResponse = {
  idLeituraSolo: number;
  idArea: number;
  dataColeta: string;
  umidadeSolo: number;
  tipoSolo: string | null;
  fonte: "MANUAL" | "SENSOR" | "NASA" | "IA" | string;
};

export type IrrigacaoResponse = {
  idIrrigacao: number;
  idArea: number;
  dataRegistro: string;
  tipoIrrigacao: string;
  irrigacaoAnteriorMm: number | null;
  consumoAtualMm: number | null;
  areaCampoHectare: number | null;
  usouCoberturaSolo: "SIM" | "NAO" | string;
  origem: "MANUAL" | "SENSOR" | "IA" | string;
};

export type PredicaoIaResponse = {
  idPredicao: number;
  idArea: number;
  idAreaCultura: number | null;
  idUsuario: number | null;
  dataPredicao: string;
  tipoModelo: "PRODUTIVIDADE" | "IRRIGACAO" | string;
  nomeModelo: string | null;
  versaoModelo: string | null;
  entradaJson: string;
  saidaJson: string | null;
  produtividadePrevista: number | null;
  classificacao: string | null;
  volumeAguaSugeridoMm: number | null;
  situacao: string | null;
  status: "SUCESSO" | "ERRO" | string;
  erro: string | null;
};

export type RecomendacaoResponse = {
  idRecomendacao: number;
  idArea: number;
  idAlerta: number | null;
  dataRecomendacao: string;
  acao: string;
  volumeAguaSugeridoMm: number | null;
  status: "PENDENTE" | "APLICADA" | "IGNORADA" | string;
};

export type AlertaResponse = {
  idAlerta: number;
  idArea: number;
  dataAlerta: string;
  tipoAlerta:
    | "SECA"
    | "ENCHENTE"
    | "GEADA"
    | "GRANIZO"
    | "EXCESSO_IRRIGACAO"
    | "DEFICIT_HIDRICO"
    | string;
  descricao: string;
  severidade: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA" | string;
  status: "ABERTO" | "RESOLVIDO" | string;
};

export type AreaMonitoradaResponse = {
  idArea: number;
  idPropriedade: number;
  nomeArea: string;
  areaHectares: number | null;
  tipoSolo: string | null;
};

export type DashboardAreaResumoResponse = {
  idArea: number;
  nomeArea: string;
  areaHectares: number | null;
  tipoSolo: string | null;
  ultimoDadoClimatico: DadoClimaticoResponse | null;
  ultimaLeituraSolo: LeituraSoloResponse | null;
  ultimaIrrigacao: IrrigacaoResponse | null;
  alertasAbertos: number;
  recomendacoesPendentes: number;
  ultimaPredicaoIa: PredicaoIaResponse | null;
};

export type DashboardResumoResponse = {
  indicadores: DashboardIndicadoresResponse;
  areas: DashboardAreaResumoResponse[];
  alertasAbertos: AlertaResponse[];
  recomendacoesPendentes: RecomendacaoResponse[];
  ultimasPredicoesIa: PredicaoIaResponse[];
};
