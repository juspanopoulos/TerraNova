package br.com.terranova.dto.response.dashboard;

import br.com.terranova.dto.response.AlertaResponse;
import br.com.terranova.dto.response.PredicaoIaResponse;
import br.com.terranova.dto.response.RecomendacaoResponse;
import java.util.List;

public record DashboardResumoResponse(
        DashboardIndicadoresResponse indicadores,
        List<DashboardAreaResumoResponse> areas,
        List<AlertaResponse> alertasAbertos,
        List<RecomendacaoResponse> recomendacoesPendentes,
        List<PredicaoIaResponse> ultimasPredicoesIa
) {
}
