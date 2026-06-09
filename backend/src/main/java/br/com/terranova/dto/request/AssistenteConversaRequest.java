package br.com.terranova.dto.request;

import jakarta.validation.constraints.Size;

public record AssistenteConversaRequest(
        @Size(max = 120) String titulo
) {
}
