package br.com.terranova.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record UsuarioPreferenciasResponse(
        Long idUsuario,
        boolean darkMode,
        boolean reducedMotion,
        boolean emailNotifications,
        String dateRangeStart,
        String dateRangeEnd,
        String selectedMonth,
        List<String> alertLevels,
        List<String> alertTypes,
        String soilSector,
        String growthCrop,
        LocalDateTime dataAtualizacao
) {
}
