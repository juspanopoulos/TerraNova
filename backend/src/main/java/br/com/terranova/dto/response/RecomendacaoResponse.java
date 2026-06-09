package br.com.terranova.dto.response;

import br.com.terranova.enums.StatusRecomendacao;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RecomendacaoResponse(
        Long idRecomendacao,
        Long idArea,
        Long idAlerta,
        LocalDateTime dataRecomendacao,
        String acao,
        BigDecimal volumeAguaSugeridoMm,
        StatusRecomendacao status
) {
}
