package br.com.terranova.dto.response;

import java.time.LocalDateTime;

public record AnotacaoResponse(
        Long idAnotacao,
        Long idUsuario,
        String titulo,
        String conteudoHtml,
        LocalDateTime dataCriacao,
        LocalDateTime dataAtualizacao
) {
}
