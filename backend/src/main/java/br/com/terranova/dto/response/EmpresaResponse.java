package br.com.terranova.dto.response;

import java.time.LocalDateTime;

public record EmpresaResponse(
        Long idEmpresa,
        String nomeEmpresa,
        String cnpj,
        String email,
        String telefone,
        LocalDateTime dataCadastro
) {
}
