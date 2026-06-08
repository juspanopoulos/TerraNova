package br.com.terranova.bo;

import br.com.terranova.dto.response.AlertaResponse;
import br.com.terranova.dto.response.AreaCulturaResponse;
import br.com.terranova.dto.response.AreaMonitoradaResponse;
import br.com.terranova.dto.response.DadoClimaticoResponse;
import br.com.terranova.dto.response.IrrigacaoResponse;
import br.com.terranova.dto.response.LeituraSoloResponse;
import br.com.terranova.dto.response.PredicaoIaResponse;
import br.com.terranova.dto.response.RecomendacaoResponse;
import br.com.terranova.dto.response.dashboard.DashboardAreaResumoResponse;
import br.com.terranova.dto.response.dashboard.DashboardIndicadoresResponse;
import br.com.terranova.dto.response.dashboard.DashboardResumoResponse;
import br.com.terranova.dto.response.dashboard.RelatorioAreaResponse;
import br.com.terranova.dto.response.dashboard.RelatorioOperacionalResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@ApplicationScoped
public class DashboardBO {

    @Inject
    EmpresaBO empresaBO;

    @Inject
    PropriedadeBO propriedadeBO;

    @Inject
    AreaMonitoradaBO areaMonitoradaBO;

    @Inject
    CulturaBO culturaBO;

    @Inject
    AreaCulturaBO areaCulturaBO;

    @Inject
    DadoClimaticoBO dadoClimaticoBO;

    @Inject
    LeituraSoloBO leituraSoloBO;

    @Inject
    IrrigacaoBO irrigacaoBO;

    @Inject
    AlertaBO alertaBO;

    @Inject
    RecomendacaoBO recomendacaoBO;

    @Inject
    PredicaoIaBO predicaoIaBO;

    public DashboardResumoResponse resumo() {
        DadosDashboard dados = carregarDados();
        return new DashboardResumoResponse(
                indicadores(dados),
                dados.areas().stream().map(area -> resumoArea(area, dados)).toList(),
                dados.alertasAbertos(),
                dados.recomendacoesPendentes(),
                ultimasPredicoes(dados.predicoesIa(), 5)
        );
    }

    public DashboardAreaResumoResponse resumoArea(Long idArea) {
        AreaMonitoradaResponse area = areaMonitoradaBO.buscarPorId(idArea);
        return resumoArea(area, carregarDados());
    }

    public RelatorioOperacionalResponse relatorioOperacional() {
        DadosDashboard dados = carregarDados();
        return new RelatorioOperacionalResponse(
                indicadores(dados),
                dados.alertasAbertos(),
                dados.recomendacoesPendentes()
        );
    }

    public RelatorioAreaResponse relatorioArea(Long idArea) {
        AreaMonitoradaResponse area = areaMonitoradaBO.buscarPorId(idArea);
        return new RelatorioAreaResponse(
                idArea,
                area,
                dadoClimaticoBO.listarHistoricoPorArea(idArea),
                leituraSoloBO.listarHistoricoPorArea(idArea),
                irrigacaoBO.listarHistoricoPorArea(idArea),
                alertaBO.listar().stream().filter(alerta -> idArea.equals(alerta.idArea())).toList(),
                recomendacaoBO.listar().stream().filter(recomendacao -> idArea.equals(recomendacao.idArea())).toList(),
                predicaoIaBO.listarPorArea(idArea)
        );
    }

    private DadosDashboard carregarDados() {
        return new DadosDashboard(
                empresaBO.listar().size(),
                propriedadeBO.listar().size(),
                areaMonitoradaBO.listar(),
                culturaBO.listar().size(),
                areaCulturaBO.listarAtivos(),
                dadoClimaticoBO.listar(),
                leituraSoloBO.listar(),
                irrigacaoBO.listar(),
                alertaBO.listarAbertos(),
                recomendacaoBO.listarPendentes(),
                predicaoIaBO.listar()
        );
    }

    private DashboardIndicadoresResponse indicadores(DadosDashboard dados) {
        BigDecimal aguaSugeridaPendente = dados.recomendacoesPendentes().stream()
                .map(RecomendacaoResponse::volumeAguaSugeridoMm)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        return new DashboardIndicadoresResponse(
                dados.totalEmpresas(),
                dados.totalPropriedades(),
                dados.areas().size(),
                dados.totalCulturas(),
                dados.plantiosAtivos().size(),
                dados.alertasAbertos().size(),
                dados.recomendacoesPendentes().size(),
                dados.predicoesIa().size(),
                media(dados.dadosClimaticos().stream().map(DadoClimaticoResponse::temperatura).toList()),
                media(dados.leiturasSolo().stream().map(LeituraSoloResponse::umidadeSolo).toList()),
                aguaSugeridaPendente
        );
    }

    private DashboardAreaResumoResponse resumoArea(AreaMonitoradaResponse area, DadosDashboard dados) {
        Long idArea = area.idArea();
        Map<Long, List<DadoClimaticoResponse>> climaPorArea = agruparPorArea(dados.dadosClimaticos(), DadoClimaticoResponse::idArea);
        Map<Long, List<LeituraSoloResponse>> soloPorArea = agruparPorArea(dados.leiturasSolo(), LeituraSoloResponse::idArea);
        Map<Long, List<IrrigacaoResponse>> irrigacaoPorArea = agruparPorArea(dados.irrigacoes(), IrrigacaoResponse::idArea);
        Map<Long, List<PredicaoIaResponse>> predicaoPorArea = agruparPorArea(dados.predicoesIa(), PredicaoIaResponse::idArea);

        long alertasAbertos = dados.alertasAbertos().stream()
                .filter(alerta -> idArea.equals(alerta.idArea()))
                .count();
        long recomendacoesPendentes = dados.recomendacoesPendentes().stream()
                .filter(recomendacao -> idArea.equals(recomendacao.idArea()))
                .count();

        return new DashboardAreaResumoResponse(
                idArea,
                area.nomeArea(),
                area.areaHectares(),
                area.tipoSolo(),
                maisRecente(climaPorArea.get(idArea), DadoClimaticoResponse::dataColeta),
                maisRecente(soloPorArea.get(idArea), LeituraSoloResponse::dataColeta),
                maisRecente(irrigacaoPorArea.get(idArea), IrrigacaoResponse::dataRegistro),
                alertasAbertos,
                recomendacoesPendentes,
                maisRecente(predicaoPorArea.get(idArea), PredicaoIaResponse::dataPredicao)
        );
    }

    private List<PredicaoIaResponse> ultimasPredicoes(List<PredicaoIaResponse> predicoes, int limite) {
        return predicoes.stream()
                .sorted(Comparator.comparing(
                        PredicaoIaResponse::dataPredicao,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(limite)
                .toList();
    }

    private <T> Map<Long, List<T>> agruparPorArea(List<T> valores, Function<T, Long> idAreaExtractor) {
        return valores.stream().collect(Collectors.groupingBy(idAreaExtractor));
    }

    private <T> T maisRecente(List<T> valores, Function<T, LocalDateTime> dataExtractor) {
        if (valores == null || valores.isEmpty()) {
            return null;
        }
        return valores.stream()
                .filter(valor -> dataExtractor.apply(valor) != null)
                .max(Comparator.comparing(dataExtractor))
                .orElse(valores.get(0));
    }

    private BigDecimal media(List<BigDecimal> valores) {
        List<BigDecimal> validos = valores.stream().filter(Objects::nonNull).toList();
        if (validos.isEmpty()) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        BigDecimal soma = validos.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        return soma.divide(BigDecimal.valueOf(validos.size()), 2, RoundingMode.HALF_UP);
    }

    private record DadosDashboard(
            long totalEmpresas,
            long totalPropriedades,
            List<AreaMonitoradaResponse> areas,
            long totalCulturas,
            List<AreaCulturaResponse> plantiosAtivos,
            List<DadoClimaticoResponse> dadosClimaticos,
            List<LeituraSoloResponse> leiturasSolo,
            List<IrrigacaoResponse> irrigacoes,
            List<AlertaResponse> alertasAbertos,
            List<RecomendacaoResponse> recomendacoesPendentes,
            List<PredicaoIaResponse> predicoesIa
    ) {
    }
}
