package br.com.terranova.dto.response.dashboard;

import br.com.terranova.dto.response.DadoClimaticoResponse;
import br.com.terranova.dto.response.IrrigacaoResponse;
import br.com.terranova.dto.response.LeituraSoloResponse;
import br.com.terranova.dto.response.PredicaoIaResponse;
import java.math.BigDecimal;

public record DashboardAreaResumoResponse(
        Long idArea,
        String nomeArea,
        BigDecimal areaHectares,
        String tipoSolo,
        DadoClimaticoResponse ultimoDadoClimatico,
        LeituraSoloResponse ultimaLeituraSolo,
        IrrigacaoResponse ultimaIrrigacao,
        long alertasAbertos,
        long recomendacoesPendentes,
        PredicaoIaResponse ultimaPredicaoIa
) {
}
