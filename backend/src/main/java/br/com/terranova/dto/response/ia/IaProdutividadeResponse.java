package br.com.terranova.dto.response.ia;

import br.com.terranova.dto.response.PredicaoIaResponse;
import java.math.BigDecimal;

public record IaProdutividadeResponse(
        String status,
        BigDecimal produtividade,
        String classificacao,
        PredicaoIaResponse predicao
) {
}
