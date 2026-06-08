package br.com.terranova.dto.response;

import br.com.terranova.enums.FonteApi;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record DadoClimaticoResponse(
        Long idDado,
        Long idArea,
        LocalDateTime dataColeta,
        LocalDate dataReferencia,
        BigDecimal temperatura,
        BigDecimal umidade,
        BigDecimal precipitacao,
        BigDecimal indiceUv,
        BigDecimal velocidadeVentoKmh,
        BigDecimal radiacaoSolar,
        FonteApi fonteApi
) {
}
