package br.com.terranova.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record CulturaRequest(
        @NotBlank @Size(max = 100) String nomeCultura,
        @Size(max = 300) String descricao,
        @NotNull @DecimalMin("0.0") BigDecimal necessidadeHidricaMm,
        @Size(max = 100) String periodoPlantio
) {
}
