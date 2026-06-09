package br.com.terranova.dto.integration.ia;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChatIaRequest(
        @NotBlank @Size(max = 1000) String pergunta,
        @Size(max = 4000) String contexto
) {
}
