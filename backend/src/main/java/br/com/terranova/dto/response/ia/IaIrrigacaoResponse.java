package br.com.terranova.dto.response.ia;

import br.com.terranova.dto.response.PredicaoIaResponse;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public record IaIrrigacaoResponse(
        String status,
        BigDecimal recomendado,
        @JsonProperty("consumo_atual") BigDecimal consumoAtual,
        String situacao,
        PredicaoIaResponse predicao
) {
}
