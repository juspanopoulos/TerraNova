package br.com.terranova.entities;

import br.com.terranova.enums.OrigemRegistro;
import br.com.terranova.enums.SimNao;
import br.com.terranova.enums.TipoIrrigacao;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Irrigacao {

    private Long idIrrigacao;
    private Long idArea;
    private LocalDateTime dataRegistro;
    private TipoIrrigacao tipoIrrigacao;
    private BigDecimal irrigacaoAnteriorMm;
    private BigDecimal consumoAtualMm;
    private BigDecimal areaCampoHectare;
    private SimNao usouCoberturaSolo;
    private OrigemRegistro origem;

    public Long getIdIrrigacao() {
        return idIrrigacao;
    }

    public void setIdIrrigacao(Long idIrrigacao) {
        this.idIrrigacao = idIrrigacao;
    }

    public Long getIdArea() {
        return idArea;
    }

    public void setIdArea(Long idArea) {
        this.idArea = idArea;
    }

    public LocalDateTime getDataRegistro() {
        return dataRegistro;
    }

    public void setDataRegistro(LocalDateTime dataRegistro) {
        this.dataRegistro = dataRegistro;
    }

    public TipoIrrigacao getTipoIrrigacao() {
        return tipoIrrigacao;
    }

    public void setTipoIrrigacao(TipoIrrigacao tipoIrrigacao) {
        this.tipoIrrigacao = tipoIrrigacao;
    }

    public BigDecimal getIrrigacaoAnteriorMm() {
        return irrigacaoAnteriorMm;
    }

    public void setIrrigacaoAnteriorMm(BigDecimal irrigacaoAnteriorMm) {
        this.irrigacaoAnteriorMm = irrigacaoAnteriorMm;
    }

    public BigDecimal getConsumoAtualMm() {
        return consumoAtualMm;
    }

    public void setConsumoAtualMm(BigDecimal consumoAtualMm) {
        this.consumoAtualMm = consumoAtualMm;
    }

    public BigDecimal getAreaCampoHectare() {
        return areaCampoHectare;
    }

    public void setAreaCampoHectare(BigDecimal areaCampoHectare) {
        this.areaCampoHectare = areaCampoHectare;
    }

    public SimNao getUsouCoberturaSolo() {
        return usouCoberturaSolo;
    }

    public void setUsouCoberturaSolo(SimNao usouCoberturaSolo) {
        this.usouCoberturaSolo = usouCoberturaSolo;
    }

    public OrigemRegistro getOrigem() {
        return origem;
    }

    public void setOrigem(OrigemRegistro origem) {
        this.origem = origem;
    }
}
