package br.com.terranova.dto.request;

import br.com.terranova.enums.SeveridadeAlerta;
import br.com.terranova.enums.StatusAlerta;
import br.com.terranova.enums.TipoAlerta;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record AlertaRequest(
        @NotNull Long idArea,
        LocalDateTime dataAlerta,
        @NotNull TipoAlerta tipoAlerta,
        @NotBlank @Size(max = 500) String descricao,
        @NotNull SeveridadeAlerta severidade,
        StatusAlerta status
) {
}
