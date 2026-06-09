package br.com.terranova.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AssistenteChatPersistidoRequest(
        @NotBlank @Size(max = 1000) String pergunta,
        @Size(max = 4000) String contexto
) {
}
