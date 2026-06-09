package br.com.terranova.exceptions;

public abstract class ApiException extends RuntimeException {

    private final int status;
    private final String codigo;

    protected ApiException(int status, String codigo, String mensagem) {
        super(mensagem);
        this.status = status;
        this.codigo = codigo;
    }

    protected ApiException(int status, String codigo, String mensagem, Throwable causa) {
        super(mensagem, causa);
        this.status = status;
        this.codigo = codigo;
    }

    public int getStatus() {
        return status;
    }

    public String getCodigo() {
        return codigo;
    }
}
