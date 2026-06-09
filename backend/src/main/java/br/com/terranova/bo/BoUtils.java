package br.com.terranova.bo;

import br.com.terranova.exceptions.EntidadeNaoEncontradaException;
import br.com.terranova.exceptions.ValidacaoException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

final class BoUtils {

    private static final BigDecimal ZERO = BigDecimal.ZERO;
    private static final BigDecimal CEM = BigDecimal.valueOf(100);

    private BoUtils() {
    }

    static void validarId(Long id, String campo) {
        if (id == null || id <= 0) {
            throw new ValidacaoException(campo + " deve ser um ID valido.");
        }
    }

    static <T> T obterOuFalhar(Optional<T> resultado, String entidade, Long id) {
        return resultado.orElseThrow(() ->
                new EntidadeNaoEncontradaException(entidade + " nao encontrado para o ID " + id + "."));
    }

    static String normalizar(String valor) {
        if (valor == null) {
            return null;
        }
        String normalizado = valor.trim();
        return normalizado.isEmpty() ? null : normalizado;
    }

    static String textoObrigatorio(String valor, String campo) {
        String normalizado = normalizar(valor);
        if (normalizado == null) {
            throw new ValidacaoException(campo + " deve ser informado.");
        }
        return normalizado;
    }

    static <T> T valorObrigatorio(T valor, String campo) {
        if (valor == null) {
            throw new ValidacaoException(campo + " deve ser informado.");
        }
        return valor;
    }

    static LocalDateTime dataHoraOuAgora(LocalDateTime valor) {
        return valor == null ? LocalDateTime.now() : valor;
    }

    static void validarNaoNegativo(BigDecimal valor, String campo) {
        if (valor != null && valor.compareTo(ZERO) < 0) {
            throw new ValidacaoException(campo + " nao pode ser negativo.");
        }
    }

    static BigDecimal naoNegativoObrigatorio(BigDecimal valor, String campo) {
        valorObrigatorio(valor, campo);
        validarNaoNegativo(valor, campo);
        return valor;
    }

    static void validarPercentual(BigDecimal valor, String campo) {
        validarIntervalo(valor, ZERO, CEM, campo);
    }

    static BigDecimal percentualObrigatorio(BigDecimal valor, String campo) {
        valorObrigatorio(valor, campo);
        validarPercentual(valor, campo);
        return valor;
    }

    static void validarIntervalo(BigDecimal valor, BigDecimal minimo, BigDecimal maximo, String campo) {
        if (valor == null) {
            return;
        }
        if (valor.compareTo(minimo) < 0 || valor.compareTo(maximo) > 0) {
            throw new ValidacaoException(campo + " deve estar entre " + minimo + " e " + maximo + ".");
        }
    }

    static void validarColheita(LocalDate dataPlantio, LocalDate dataColheitaPrevista) {
        if (dataPlantio != null && dataColheitaPrevista != null && dataColheitaPrevista.isBefore(dataPlantio)) {
            throw new ValidacaoException("dataColheitaPrevista nao pode ser anterior a dataPlantio.");
        }
    }

    static void validarJsonBasico(String json, String campo) {
        String texto = normalizar(json);
        if (texto == null) {
            return;
        }
        boolean objeto = texto.startsWith("{") && texto.endsWith("}");
        boolean array = texto.startsWith("[") && texto.endsWith("]");
        if (!objeto && !array) {
            throw new ValidacaoException(campo + " deve conter um JSON valido.");
        }
    }
}
