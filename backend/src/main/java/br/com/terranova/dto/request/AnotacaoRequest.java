package br.com.terranova.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AnotacaoRequest(
        @NotBlank @Size(max = 150) String titulo,
        @Size(max = 4000) String conteudoHtml
) {
}
