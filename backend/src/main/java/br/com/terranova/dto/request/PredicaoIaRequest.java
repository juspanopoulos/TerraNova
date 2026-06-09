package br.com.terranova.dto.request;

import br.com.terranova.enums.StatusPredicaoIa;
import br.com.terranova.enums.TipoModeloIa;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PredicaoIaRequest(
        @NotNull Long idArea,
        Long idAreaCultura,
        Long idUsuario,
        LocalDateTime dataPredicao,
        @NotNull TipoModeloIa tipoModelo,
        @Size(max = 100) String nomeModelo,
        @Size(max = 30) String versaoModelo,
        @NotBlank String entradaJson,
        String saidaJson,
        @DecimalMin("0.0") BigDecimal produtividadePrevista,
        @Size(max = 30) String classificacao,
        @DecimalMin("0.0") BigDecimal volumeAguaSugeridoMm,
        @Size(max = 300) String situacao,
        StatusPredicaoIa status,
        @Size(max = 500) String erro
) {
}
