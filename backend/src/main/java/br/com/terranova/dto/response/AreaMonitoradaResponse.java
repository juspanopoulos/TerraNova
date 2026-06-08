package br.com.terranova.dto.response;

import java.math.BigDecimal;

public record AreaMonitoradaResponse(
        Long idArea,
        Long idPropriedade,
        String nomeArea,
        BigDecimal areaHectares,
        String tipoSolo
) {
}
