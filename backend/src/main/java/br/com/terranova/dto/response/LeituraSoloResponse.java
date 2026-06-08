package br.com.terranova.dto.response;

import br.com.terranova.enums.FonteSolo;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record LeituraSoloResponse(
        Long idLeituraSolo,
        Long idArea,
        LocalDateTime dataColeta,
        BigDecimal umidadeSolo,
        String tipoSolo,
        FonteSolo fonte
) {
}
