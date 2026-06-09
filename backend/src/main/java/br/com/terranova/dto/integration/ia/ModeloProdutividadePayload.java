package br.com.terranova.dto.integration.ia;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public record ModeloProdutividadePayload(
        @JsonProperty("rainfall_mm") BigDecimal rainfallMm,
        @JsonProperty("temperature_celsius") BigDecimal temperatureCelsius,
        @JsonProperty("fertilizer_used") Integer fertilizerUsed,
        @JsonProperty("irrigation_used") Integer irrigationUsed,
        @JsonProperty("days_to_harvest") Integer daysToHarvest,
        String region,
        @JsonProperty("soil_type") String soilType,
        String crop,
        @JsonProperty("weather_condition") String weatherCondition
) {
}
