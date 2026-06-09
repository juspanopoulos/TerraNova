package br.com.terranova.dto.response.dashboard;

import br.com.terranova.dto.response.AlertaResponse;
import br.com.terranova.dto.response.AreaMonitoradaResponse;
import br.com.terranova.dto.response.DadoClimaticoResponse;
import br.com.terranova.dto.response.IrrigacaoResponse;
import br.com.terranova.dto.response.LeituraSoloResponse;
import br.com.terranova.dto.response.PredicaoIaResponse;
import br.com.terranova.dto.response.RecomendacaoResponse;
import java.util.List;

public record RelatorioAreaResponse(
        Long idArea,
        AreaMonitoradaResponse area,
        List<DadoClimaticoResponse> historicoClimatico,
        List<LeituraSoloResponse> historicoSolo,
        List<IrrigacaoResponse> historicoIrrigacao,
        List<AlertaResponse> alertas,
        List<RecomendacaoResponse> recomendacoes,
        List<PredicaoIaResponse> predicoesIa
) {
}
