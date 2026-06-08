package br.com.terranova.dto.request;

import br.com.terranova.enums.StatusAreaCultura;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record AreaCulturaRequest(
        @NotNull Long idArea,
        @NotNull Long idCultura,
        @NotNull LocalDate dataPlantio,
        LocalDate dataColheitaPrevista,
        StatusAreaCultura status,
        @Size(max = 50) String estagioCrescimento
) {
}
