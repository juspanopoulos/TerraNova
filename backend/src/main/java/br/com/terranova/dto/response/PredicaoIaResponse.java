package br.com.terranova.dto.response;

import br.com.terranova.enums.StatusPredicaoIa;
import br.com.terranova.enums.TipoModeloIa;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PredicaoIaResponse(
        Long idPredicao,
        Long idArea,
        Long idAreaCultura,
        Long idUsuario,
        LocalDateTime dataPredicao,
        TipoModeloIa tipoModelo,
        String nomeModelo,
        String versaoModelo,
        String entradaJson,
        String saidaJson,
        BigDecimal produtividadePrevista,
        String classificacao,
        BigDecimal volumeAguaSugeridoMm,
        String situacao,
        StatusPredicaoIa status,
        String erro
) {
}
