package br.com.terranova.exceptions;

public class BancoDadosException extends ApiException {

    public BancoDadosException(String mensagem) {
        super(500, "BANCO_DADOS", mensagem);
    }

    public BancoDadosException(String mensagem, Throwable causa) {
        super(500, "BANCO_DADOS", mensagem, causa);
    }
}
