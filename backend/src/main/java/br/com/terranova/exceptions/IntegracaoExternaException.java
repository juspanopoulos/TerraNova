package br.com.terranova.exceptions;

public class IntegracaoExternaException extends ApiException {

    public IntegracaoExternaException(String mensagem) {
        super(502, "INTEGRACAO_EXTERNA", mensagem);
    }

    public IntegracaoExternaException(String mensagem, Throwable causa) {
        super(502, "INTEGRACAO_EXTERNA", mensagem, causa);
    }

    protected IntegracaoExternaException(String codigo, String mensagem) {
        super(502, codigo, mensagem);
    }

    protected IntegracaoExternaException(String codigo, String mensagem, Throwable causa) {
        super(502, codigo, mensagem, causa);
    }
}
