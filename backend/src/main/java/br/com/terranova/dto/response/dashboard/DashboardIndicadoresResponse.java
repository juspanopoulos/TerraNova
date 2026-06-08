package br.com.terranova.dto.response.dashboard;

import java.math.BigDecimal;

public record DashboardIndicadoresResponse(
        long totalEmpresas,
        long totalPropriedades,
        long totalAreas,
        long totalCulturas,
        long totalPlantiosAtivos,
        long totalAlertasAbertos,
        long totalRecomendacoesPendentes,
        long totalPredicoesIa,
        BigDecimal mediaTemperatura,
        BigDecimal mediaUmidadeSolo,
        BigDecimal aguaSugeridaPendenteMm
) {
}
