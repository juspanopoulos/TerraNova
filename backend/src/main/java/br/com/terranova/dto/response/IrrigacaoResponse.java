package br.com.terranova.dto.response;

import br.com.terranova.enums.OrigemRegistro;
import br.com.terranova.enums.SimNao;
import br.com.terranova.enums.TipoIrrigacao;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record IrrigacaoResponse(
        Long idIrrigacao,
        Long idArea,
        LocalDateTime dataRegistro,
        TipoIrrigacao tipoIrrigacao,
        BigDecimal irrigacaoAnteriorMm,
        BigDecimal consumoAtualMm,
        BigDecimal areaCampoHectare,
        SimNao usouCoberturaSolo,
        OrigemRegistro origem
) {
}
