package br.com.terranova.dto.integration.ia;

import java.math.BigDecimal;

public record ModeloProdutividadeResponse(
        String status,
        BigDecimal produtividade,
        String classificacao
) {
}
