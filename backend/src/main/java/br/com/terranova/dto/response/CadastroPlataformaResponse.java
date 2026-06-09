package br.com.terranova.dto.response;

public record CadastroPlataformaResponse(
        EmpresaResponse empresa,
        PropriedadeResponse propriedade,
        UsuarioResponse usuario
) {
}
