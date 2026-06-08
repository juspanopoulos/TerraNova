package br.com.terranova.entities;

import java.math.BigDecimal;

public class Cultura {

    private Long idCultura;
    private String nomeCultura;
    private String descricao;
    private BigDecimal necessidadeHidricaMm;
    private String periodoPlantio;

    public Long getIdCultura() {
        return idCultura;
    }

    public void setIdCultura(Long idCultura) {
        this.idCultura = idCultura;
    }

    public String getNomeCultura() {
        return nomeCultura;
    }

    public void setNomeCultura(String nomeCultura) {
        this.nomeCultura = nomeCultura;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getNecessidadeHidricaMm() {
        return necessidadeHidricaMm;
    }

    public void setNecessidadeHidricaMm(BigDecimal necessidadeHidricaMm) {
        this.necessidadeHidricaMm = necessidadeHidricaMm;
    }

    public String getPeriodoPlantio() {
        return periodoPlantio;
    }

    public void setPeriodoPlantio(String periodoPlantio) {
        this.periodoPlantio = periodoPlantio;
    }
}
