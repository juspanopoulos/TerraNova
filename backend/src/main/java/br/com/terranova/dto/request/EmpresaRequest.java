package br.com.terranova.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmpresaRequest(
        @NotBlank @Size(max = 100) String nomeEmpresa,
        @NotBlank @Size(max = 18) String cnpj,
        @NotBlank @Email @Size(max = 100) String email,
        @Size(max = 20) String telefone
) {
}
