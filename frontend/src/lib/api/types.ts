export type UsuarioResponse = {
  idUsuario: number;
  idEmpresa: number;
  nomeUsuario: string;
  email: string;
  cpf: string | null;
  perfil: "ADMIN" | "OPERADOR" | "VISUALIZADOR" | string;
  status: "ATIVO" | "INATIVO" | string;
  dataCadastro: string | null;
  dataUltimoAcesso: string | null;
};

export type LoginRequest = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  usuario: UsuarioResponse;
};

export type UsuarioRequest = {
  idEmpresa: number;
  nomeUsuario: string;
  email: string;
  senha?: string | null;
  cpf?: string | null;
  perfil?: string | null;
  status?: string | null;
};

export type EmpresaResponse = {
  idEmpresa: number;
  nomeEmpresa: string;
  cnpj: string | null;
  email: string | null;
  telefone: string | null;
  dataCadastro: string | null;
};

export type EmpresaRequest = {
  nomeEmpresa: string;
  cnpj: string;
  email: string;
  telefone?: string | null;
};

export type PropriedadeResponse = {
  idPropriedade: number;
  idEmpresa: number;
  nomePropriedade: string;
  localizacao: string | null;
  latitude: number | null;
  longitude: number | null;
  areaTotalHectares: number | null;
};

export type PropriedadeRequest = {
  idEmpresa: number;
  nomePropriedade: string;
  localizacao: string;
  latitude?: number | null;
  longitude?: number | null;
  areaTotalHectares?: number | null;
};

export type CadastroPlataformaRequest = {
  nomeEmpresa: string;
  cnpj: string;
  emailEmpresa: string;
  telefoneEmpresa?: string | null;
  nomePropriedade: string;
  localizacao: string;
  latitude?: number | null;
  longitude?: number | null;
  areaTotalHectares?: number | null;
  nomeUsuario: string;
  emailUsuario: string;
  senha: string;
  cpf?: string | null;
};

export type CadastroPlataformaResponse = {
  empresa: EmpresaResponse;
  propriedade: PropriedadeResponse;
  usuario: UsuarioResponse;
};

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

export type ColetaNasaResponse = {
  idArea: number;
  dataReferencia: string;
  latitude: number;
  longitude: number;
  dadoClimatico: DadoClimaticoResponse;
};

export type LeituraSoloResponse = {
  idLeituraSolo: number;
  idArea: number;
  dataColeta: string;
  umidadeSolo: number;
  tipoSolo: string | null;
  fonte: "MANUAL" | "SENSOR" | "NASA" | "IA" | string;
};

export type LeituraSoloRequest = {
  idArea: number;
  dataColeta?: string | null;
  umidadeSolo: number;
  tipoSolo?: string | null;
  fonte?: "MANUAL" | "SENSOR" | "NASA" | "IA" | string | null;
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

export type IrrigacaoRequest = {
  idArea: number;
  dataRegistro?: string | null;
  tipoIrrigacao: string;
  irrigacaoAnteriorMm?: number | null;
  consumoAtualMm?: number | null;
  areaCampoHectare?: number | null;
  usouCoberturaSolo?: "SIM" | "NAO" | string | null;
  origem?: "MANUAL" | "SENSOR" | "IA" | string | null;
};

export type CulturaResponse = {
  idCultura: number;
  nomeCultura: string;
  descricao: string | null;
  necessidadeHidricaMm: number | null;
  periodoPlantio: string | null;
};

export type CulturaRequest = {
  nomeCultura: string;
  descricao?: string | null;
  necessidadeHidricaMm: number;
  periodoPlantio?: string | null;
};

export type AreaCulturaResponse = {
  idAreaCultura: number;
  idArea: number;
  idCultura: number;
  dataPlantio: string;
  dataColheitaPrevista: string | null;
  status: "ATIVO" | "COLHIDO" | "PERDIDO" | string;
  estagioCrescimento: string | null;
};

export type AreaCulturaRequest = {
  idArea: number;
  idCultura: number;
  dataPlantio: string;
  dataColheitaPrevista?: string | null;
  status?: "ATIVO" | "COLHIDO" | "PERDIDO" | string | null;
  estagioCrescimento?: string | null;
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

export type ChatIaRequest = {
  pergunta: string;
  contexto?: string | null;
};

export type ChatIaResponse = {
  resposta: string;
};

export type UsuarioPreferenciasResponse = {
  idUsuario: number;
  darkMode: boolean;
  reducedMotion: boolean;
  emailNotifications: boolean;
  dateRangeStart: string;
  dateRangeEnd: string;
  selectedMonth: string;
  alertLevels: string[];
  alertTypes: string[];
  soilSector: string;
  growthCrop: string;
  dataAtualizacao: string | null;
};

export type UsuarioPreferenciasRequest = Partial<
  Omit<UsuarioPreferenciasResponse, "idUsuario" | "dataAtualizacao">
>;

export type AnotacaoResponse = {
  idAnotacao: number;
  idUsuario: number;
  titulo: string;
  conteudoHtml: string | null;
  dataCriacao: string;
  dataAtualizacao: string;
};

export type AnotacaoRequest = {
  titulo: string;
  conteudoHtml?: string | null;
};

export type AssistenteMensagemResponse = {
  idMensagem: number;
  idConversa: number;
  papel: "user" | "assistant" | string;
  conteudo: string;
  dataMensagem: string;
};

export type AssistenteConversaResponse = {
  idConversa: number;
  idUsuario: number;
  titulo: string;
  dataCriacao: string;
  dataAtualizacao: string;
  mensagens: AssistenteMensagemResponse[];
};

export type AssistenteConversaRequest = {
  titulo?: string | null;
};

export type AssistenteChatPersistidoRequest = {
  pergunta: string;
  contexto?: string | null;
};

export type IaProdutividadeRequest = {
  idArea: number;
  idAreaCultura?: number | null;
  idUsuario?: number | null;
  rainfall_mm: number;
  temperature_celsius: number;
  fertilizer_used: number;
  irrigation_used: number;
  days_to_harvest: number;
  region: string;
  soil_type: string;
  crop: string;
  weather_condition: string;
};

export type IaProdutividadeResponse = {
  status: string;
  produtividade: number;
  classificacao: string;
  predicao: PredicaoIaResponse;
};

export type IaIrrigacaoRequest = {
  idArea: number;
  idAreaCultura?: number | null;
  idUsuario?: number | null;
  latitude: number;
  longitude: number;
  soil_type: string;
  soil_moisture: number;
  crop_type: string;
  crop_growth_stage: string;
  irrigation_type: string;
  field_area_hectare: number;
  mulching_used: string;
  previous_irrigation_mm: number;
  current_water_usage: number;
};

export type IaIrrigacaoResponse = {
  status: string;
  recomendado: number;
  consumo_atual: number;
  situacao: string;
  predicao: PredicaoIaResponse;
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

export type AreaMonitoradaRequest = {
  idPropriedade: number;
  nomeArea: string;
  areaHectares?: number | null;
  tipoSolo?: string | null;
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
