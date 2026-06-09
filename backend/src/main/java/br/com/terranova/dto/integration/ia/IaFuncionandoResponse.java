package br.com.terranova.dto.integration.ia;

import java.util.Map;

public record IaFuncionandoResponse(
        String message,
        Map<String, Object> data
) {
}
