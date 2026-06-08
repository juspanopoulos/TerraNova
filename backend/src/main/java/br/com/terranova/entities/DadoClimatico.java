package br.com.terranova.entities;

import br.com.terranova.enums.FonteApi;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class DadoClimatico {

    private Long idDado;
    private Long idArea;
    private LocalDateTime dataColeta;
    private LocalDate dataReferencia;
    private BigDecimal temperatura;
    private BigDecimal umidade;
    private BigDecimal precipitacao;
    private BigDecimal indiceUv;
    private BigDecimal velocidadeVentoKmh;
    private BigDecimal radiacaoSolar;
    private FonteApi fonteApi;

    public Long getIdDado() {
        return idDado;
    }

    public void setIdDado(Long idDado) {
        this.idDado = idDado;
    }

    public Long getIdArea() {
        return idArea;
    }

    public void setIdArea(Long idArea) {
        this.idArea = idArea;
    }

    public LocalDateTime getDataColeta() {
        return dataColeta;
    }

    public void setDataColeta(LocalDateTime dataColeta) {
        this.dataColeta = dataColeta;
    }

    public LocalDate getDataReferencia() {
        return dataReferencia;
    }

    public void setDataReferencia(LocalDate dataReferencia) {
        this.dataReferencia = dataReferencia;
    }

    public BigDecimal getTemperatura() {
        return temperatura;
    }

    public void setTemperatura(BigDecimal temperatura) {
        this.temperatura = temperatura;
    }

    public BigDecimal getUmidade() {
        return umidade;
    }

    public void setUmidade(BigDecimal umidade) {
        this.umidade = umidade;
    }

    public BigDecimal getPrecipitacao() {
        return precipitacao;
    }

    public void setPrecipitacao(BigDecimal precipitacao) {
        this.precipitacao = precipitacao;
    }

    public BigDecimal getIndiceUv() {
        return indiceUv;
    }

    public void setIndiceUv(BigDecimal indiceUv) {
        this.indiceUv = indiceUv;
    }

    public BigDecimal getVelocidadeVentoKmh() {
        return velocidadeVentoKmh;
    }

    public void setVelocidadeVentoKmh(BigDecimal velocidadeVentoKmh) {
        this.velocidadeVentoKmh = velocidadeVentoKmh;
    }

    public BigDecimal getRadiacaoSolar() {
        return radiacaoSolar;
    }

    public void setRadiacaoSolar(BigDecimal radiacaoSolar) {
        this.radiacaoSolar = radiacaoSolar;
    }

    public FonteApi getFonteApi() {
        return fonteApi;
    }

    public void setFonteApi(FonteApi fonteApi) {
        this.fonteApi = fonteApi;
    }
}
