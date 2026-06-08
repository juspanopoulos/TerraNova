package br.com.terranova.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record AreaMonitoradaRequest(
        @NotNull Long idPropriedade,
        @NotBlank @Size(max = 100) String nomeArea,
        @DecimalMin("0.0") BigDecimal areaHectares,
        @Size(max = 100) String tipoSolo
) {
}
