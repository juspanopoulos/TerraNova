package br.com.terranova.dto.request;

import br.com.terranova.enums.OrigemRegistro;
import br.com.terranova.enums.SimNao;
import br.com.terranova.enums.TipoIrrigacao;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record IrrigacaoRequest(
        @NotNull Long idArea,
        LocalDateTime dataRegistro,
        @NotNull TipoIrrigacao tipoIrrigacao,
        @DecimalMin("0.0") BigDecimal irrigacaoAnteriorMm,
        @DecimalMin("0.0") BigDecimal consumoAtualMm,
        @DecimalMin("0.0") BigDecimal areaCampoHectare,
        SimNao usouCoberturaSolo,
        OrigemRegistro origem
) {
}
