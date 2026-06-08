package br.com.terranova.exceptions;

public class EntidadeNaoEncontradaException extends ApiException {

    public EntidadeNaoEncontradaException(String mensagem) {
        super(404, "ENTIDADE_NAO_ENCONTRADA", mensagem);
    }
}
