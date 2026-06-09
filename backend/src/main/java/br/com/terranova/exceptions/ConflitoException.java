package br.com.terranova.exceptions;

public class ConflitoException extends ApiException {

    public ConflitoException(String mensagem) {
        super(409, "CONFLITO", mensagem);
    }

    public ConflitoException(String mensagem, Throwable causa) {
        super(409, "CONFLITO", mensagem, causa);
    }
}
