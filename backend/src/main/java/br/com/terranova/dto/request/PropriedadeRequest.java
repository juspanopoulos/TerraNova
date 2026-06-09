package br.com.terranova.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record PropriedadeRequest(
        @NotNull Long idEmpresa,
        @NotBlank @Size(max = 100) String nomePropriedade,
        @NotBlank @Size(max = 200) String localizacao,
        BigDecimal latitude,
        BigDecimal longitude,
        @DecimalMin("0.0") BigDecimal areaTotalHectares
) {
}
