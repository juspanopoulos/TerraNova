package br.com.terranova.exceptions;

public class IntegracaoClimaException extends IntegracaoExternaException {

    public IntegracaoClimaException(String mensagem) {
        super("INTEGRACAO_CLIMA", mensagem);
    }

    public IntegracaoClimaException(String mensagem, Throwable causa) {
        super("INTEGRACAO_CLIMA", mensagem, causa);
    }
}
