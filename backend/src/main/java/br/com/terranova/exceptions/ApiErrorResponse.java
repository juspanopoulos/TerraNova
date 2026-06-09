package br.com.terranova.exceptions;

import java.time.OffsetDateTime;

public record ApiErrorResponse(
        int status,
        String erro,
        String mensagem,
        String caminho,
        OffsetDateTime timestamp
) {
}
