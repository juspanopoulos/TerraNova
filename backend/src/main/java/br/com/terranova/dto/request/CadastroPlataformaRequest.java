package br.com.terranova.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record CadastroPlataformaRequest(
        @NotBlank @Size(max = 100) String nomeEmpresa,
        @NotBlank @Size(max = 18) String cnpj,
        @NotBlank @Email @Size(max = 100) String emailEmpresa,
        @Size(max = 20) String telefoneEmpresa,
        @NotBlank @Size(max = 100) String nomePropriedade,
        @NotBlank @Size(max = 200) String localizacao,
        BigDecimal latitude,
        BigDecimal longitude,
        @DecimalMin("0.0") BigDecimal areaTotalHectares,
        @NotBlank @Size(max = 100) String nomeUsuario,
        @NotBlank @Email @Size(max = 100) String emailUsuario,
        @NotBlank @Size(min = 8, max = 255) String senha,
        @Size(max = 14) String cpf
) {
}
