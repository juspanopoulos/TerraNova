package br.com.terranova.dto.request.ia;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record IaIrrigacaoRequest(
        @NotNull Long idArea,
        Long idAreaCultura,
        Long idUsuario,
        @NotNull BigDecimal latitude,
        @NotNull BigDecimal longitude,
        @NotBlank @Size(max = 30) @JsonProperty("soil_type") String soilType,
        @NotNull @DecimalMin("0.0") @JsonProperty("soil_moisture") BigDecimal soilMoisture,
        @NotBlank @Size(max = 30) @JsonProperty("crop_type") String cropType,
        @NotBlank @Size(max = 30) @JsonProperty("crop_growth_stage") String cropGrowthStage,
        @NotBlank @Size(max = 30) @JsonProperty("irrigation_type") String irrigationType,
        @NotNull @DecimalMin("0.0") @JsonProperty("field_area_hectare") BigDecimal fieldAreaHectare,
        @NotBlank @Size(max = 10) @JsonProperty("mulching_used") String mulchingUsed,
        @NotNull @DecimalMin("0.0") @JsonProperty("previous_irrigation_mm") BigDecimal previousIrrigationMm,
        @NotNull @DecimalMin("0.0") @JsonProperty("current_water_usage") BigDecimal currentWaterUsage
) {
}
