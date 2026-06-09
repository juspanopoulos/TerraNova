package br.com.terranova.entities;

import java.time.LocalDateTime;

public class Anotacao {

    private Long idAnotacao;
    private Long idUsuario;
    private String titulo;
    private String conteudoHtml;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;

    public Long getIdAnotacao() {
        return idAnotacao;
    }

    public void setIdAnotacao(Long idAnotacao) {
        this.idAnotacao = idAnotacao;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getConteudoHtml() {
        return conteudoHtml;
    }

    public void setConteudoHtml(String conteudoHtml) {
        this.conteudoHtml = conteudoHtml;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }
}
