package br.com.terranova.exceptions;

public class AutenticacaoException extends ApiException {

    public AutenticacaoException(String mensagem) {
        super(401, "AUTENTICACAO", mensagem);
    }
}
