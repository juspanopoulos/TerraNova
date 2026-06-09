package br.com.terranova.dto.request;

import br.com.terranova.enums.StatusRecomendacao;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RecomendacaoRequest(
        @NotNull Long idArea,
        Long idAlerta,
        LocalDateTime dataRecomendacao,
        @NotBlank @Size(max = 500) String acao,
        @DecimalMin("0.0") BigDecimal volumeAguaSugeridoMm,
        StatusRecomendacao status
) {
}
