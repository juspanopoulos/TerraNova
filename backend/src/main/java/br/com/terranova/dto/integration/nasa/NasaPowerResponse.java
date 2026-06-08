package br.com.terranova.dto.integration.nasa;

import java.math.BigDecimal;
import java.util.Map;

public record NasaPowerResponse(
        NasaPowerProperties properties
) {

    public record NasaPowerProperties(
            Map<String, Map<String, BigDecimal>> parameter
    ) {
    }
}
