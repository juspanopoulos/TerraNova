package br.com.terranova.dto.request;

import br.com.terranova.enums.FonteApi;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record DadoClimaticoRequest(
        @NotNull Long idArea,
        @NotNull LocalDateTime dataColeta,
        LocalDate dataReferencia,
        @NotNull BigDecimal temperatura,
        @NotNull @DecimalMin("0.0") @DecimalMax("100.0") BigDecimal umidade,
        @DecimalMin("0.0") BigDecimal precipitacao,
        @DecimalMin("0.0") BigDecimal indiceUv,
        @DecimalMin("0.0") BigDecimal velocidadeVentoKmh,
        @DecimalMin("0.0") BigDecimal radiacaoSolar,
        @NotNull FonteApi fonteApi
) {
}
