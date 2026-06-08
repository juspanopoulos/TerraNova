package br.com.terranova.dto.response;

import java.math.BigDecimal;

public record PropriedadeResponse(
        Long idPropriedade,
        Long idEmpresa,
        String nomePropriedade,
        String localizacao,
        BigDecimal latitude,
        BigDecimal longitude,
        BigDecimal areaTotalHectares
) {
}
