package br.com.terranova.dto.request;

import java.util.List;

public record UsuarioPreferenciasRequest(
        Boolean darkMode,
        Boolean reducedMotion,
        Boolean emailNotifications,
        String dateRangeStart,
        String dateRangeEnd,
        String selectedMonth,
        List<String> alertLevels,
        List<String> alertTypes,
        String soilSector,
        String growthCrop
) {
}
