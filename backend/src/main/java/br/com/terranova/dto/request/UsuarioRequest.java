package br.com.terranova.dto.request;

import br.com.terranova.enums.PerfilUsuario;
import br.com.terranova.enums.StatusUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(
        @NotNull Long idEmpresa,
        @NotBlank @Size(max = 100) String nomeUsuario,
        @NotBlank @Email @Size(max = 100) String email,
        @Size(min = 8, max = 255) String senha,
        @Size(max = 14) String cpf,
        PerfilUsuario perfil,
        StatusUsuario status
) {
}
