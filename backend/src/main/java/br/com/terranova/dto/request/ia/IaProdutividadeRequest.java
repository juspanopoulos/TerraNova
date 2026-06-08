package br.com.terranova.dto.request.ia;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record IaProdutividadeRequest(
        @NotNull Long idArea,
        Long idAreaCultura,
        Long idUsuario,
        @NotNull @DecimalMin("0.0") @JsonProperty("rainfall_mm") BigDecimal rainfallMm,
        @NotNull @JsonProperty("temperature_celsius") BigDecimal temperatureCelsius,
        @NotNull @Min(0) @Max(1) @JsonProperty("fertilizer_used") Integer fertilizerUsed,
        @NotNull @Min(0) @Max(1) @JsonProperty("irrigation_used") Integer irrigationUsed,
        @NotNull @Min(1) @JsonProperty("days_to_harvest") Integer daysToHarvest,
        @NotBlank @Size(max = 30) String region,
        @NotBlank @Size(max = 30) @JsonProperty("soil_type") String soilType,
        @NotBlank @Size(max = 30) String crop,
        @NotBlank @Size(max = 30) @JsonProperty("weather_condition") String weatherCondition
) {
}
