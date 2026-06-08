package br.com.terranova.dto.response.dashboard;

import br.com.terranova.dto.response.AlertaResponse;
import br.com.terranova.dto.response.RecomendacaoResponse;
import java.util.List;

public record RelatorioOperacionalResponse(
        DashboardIndicadoresResponse indicadores,
        List<AlertaResponse> alertasAbertos,
        List<RecomendacaoResponse> recomendacoesPendentes
) {
}
