package br.com.terranova.dto.response;

import br.com.terranova.enums.StatusAreaCultura;
import java.time.LocalDate;

public record AreaCulturaResponse(
        Long idAreaCultura,
        Long idArea,
        Long idCultura,
        LocalDate dataPlantio,
        LocalDate dataColheitaPrevista,
        StatusAreaCultura status,
        String estagioCrescimento
) {
}
