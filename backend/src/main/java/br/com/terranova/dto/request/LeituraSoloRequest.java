package br.com.terranova.dto.request;

import br.com.terranova.enums.FonteSolo;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record LeituraSoloRequest(
        @NotNull Long idArea,
        LocalDateTime dataColeta,
        @NotNull @DecimalMin("0.0") @DecimalMax("100.0") BigDecimal umidadeSolo,
        @Size(max = 100) String tipoSolo,
        FonteSolo fonte
) {
}
