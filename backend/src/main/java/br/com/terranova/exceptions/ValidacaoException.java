package br.com.terranova.exceptions;

public class ValidacaoException extends ApiException {

    public ValidacaoException(String mensagem) {
        super(400, "VALIDACAO", mensagem);
    }

    public ValidacaoException(String mensagem, Throwable causa) {
        super(400, "VALIDACAO", mensagem, causa);
    }
}
