package br.com.terranova.dto.response;

import br.com.terranova.enums.PerfilUsuario;
import br.com.terranova.enums.StatusUsuario;
import java.time.LocalDateTime;

public record UsuarioResponse(
        Long idUsuario,
        Long idEmpresa,
        String nomeUsuario,
        String email,
        String cpf,
        PerfilUsuario perfil,
        StatusUsuario status,
        LocalDateTime dataCadastro,
        LocalDateTime dataUltimoAcesso
) {
}
