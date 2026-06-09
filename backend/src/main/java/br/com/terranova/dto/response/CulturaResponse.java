package br.com.terranova.dto.response;

import java.math.BigDecimal;

public record CulturaResponse(
        Long idCultura,
        String nomeCultura,
        String descricao,
        BigDecimal necessidadeHidricaMm,
        String periodoPlantio
) {
}
