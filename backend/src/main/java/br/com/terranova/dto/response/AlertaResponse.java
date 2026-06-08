package br.com.terranova.dto.response;

import br.com.terranova.enums.SeveridadeAlerta;
import br.com.terranova.enums.StatusAlerta;
import br.com.terranova.enums.TipoAlerta;
import java.time.LocalDateTime;

public record AlertaResponse(
        Long idAlerta,
        Long idArea,
        LocalDateTime dataAlerta,
        TipoAlerta tipoAlerta,
        String descricao,
        SeveridadeAlerta severidade,
        StatusAlerta status
) {
}
