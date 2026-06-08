package br.com.terranova.exceptions;

public class IntegracaoIaException extends IntegracaoExternaException {

    public IntegracaoIaException(String mensagem) {
        super("INTEGRACAO_IA", mensagem);
    }

    public IntegracaoIaException(String mensagem, Throwable causa) {
        super("INTEGRACAO_IA", mensagem, causa);
    }
}
