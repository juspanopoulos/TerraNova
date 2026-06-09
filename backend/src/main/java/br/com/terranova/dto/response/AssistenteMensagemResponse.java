package br.com.terranova.dto.response;

import java.time.LocalDateTime;

public record AssistenteMensagemResponse(
        Long idMensagem,
        Long idConversa,
        String papel,
        String conteudo,
        LocalDateTime dataMensagem
) {
}
