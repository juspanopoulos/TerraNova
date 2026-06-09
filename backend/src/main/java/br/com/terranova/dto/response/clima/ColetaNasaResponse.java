package br.com.terranova.dto.response.clima;

import br.com.terranova.dto.response.DadoClimaticoResponse;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ColetaNasaResponse(
        Long idArea,
        LocalDate dataReferencia,
        BigDecimal latitude,
        BigDecimal longitude,
        DadoClimaticoResponse dadoClimatico
) {
}
