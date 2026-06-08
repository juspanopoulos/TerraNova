package br.com.terranova.dto.integration.ia;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public record ModeloIrrigacaoPayload(
        BigDecimal latitude,
        BigDecimal longitude,
        @JsonProperty("soil_type") String soilType,
        @JsonProperty("soil_moisture") BigDecimal soilMoisture,
        @JsonProperty("crop_type") String cropType,
        @JsonProperty("crop_growth_stage") String cropGrowthStage,
        @JsonProperty("irrigation_type") String irrigationType,
        @JsonProperty("field_area_hectare") BigDecimal fieldAreaHectare,
        @JsonProperty("mulching_used") String mulchingUsed,
        @JsonProperty("previous_irrigation_mm") BigDecimal previousIrrigationMm,
        @JsonProperty("current_water_usage") BigDecimal currentWaterUsage
) {
}
