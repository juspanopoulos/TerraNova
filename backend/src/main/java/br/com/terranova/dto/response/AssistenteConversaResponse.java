package br.com.terranova.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record AssistenteConversaResponse(
        Long idConversa,
        Long idUsuario,
        String titulo,
        LocalDateTime dataCriacao,
        LocalDateTime dataAtualizacao,
        List<AssistenteMensagemResponse> mensagens
) {
}
