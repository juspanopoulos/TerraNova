package br.com.terranova.dto.integration.ia;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public record ModeloIrrigacaoResponse(
        String status,
        BigDecimal recomendado,
        @JsonProperty("consumo_atual") BigDecimal consumoAtual,
        String situacao
) {
}
