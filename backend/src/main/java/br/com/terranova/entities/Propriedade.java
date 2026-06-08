package br.com.terranova.entities;

import java.math.BigDecimal;

public class Propriedade {

    private Long idPropriedade;
    private Long idEmpresa;
    private String nomePropriedade;
    private String localizacao;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal areaTotalHectares;

    public Long getIdPropriedade() {
        return idPropriedade;
    }

    public void setIdPropriedade(Long idPropriedade) {
        this.idPropriedade = idPropriedade;
    }

    public Long getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(Long idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public String getNomePropriedade() {
        return nomePropriedade;
    }

    public void setNomePropriedade(String nomePropriedade) {
        this.nomePropriedade = nomePropriedade;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public BigDecimal getAreaTotalHectares() {
        return areaTotalHectares;
    }

    public void setAreaTotalHectares(BigDecimal areaTotalHectares) {
        this.areaTotalHectares = areaTotalHectares;
    }
}
