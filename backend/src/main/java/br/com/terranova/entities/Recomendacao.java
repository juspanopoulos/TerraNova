package br.com.terranova.entities;

import br.com.terranova.enums.StatusRecomendacao;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Recomendacao {

    private Long idRecomendacao;
    private Long idArea;
    private Long idAlerta;
    private LocalDateTime dataRecomendacao;
    private String acao;
    private BigDecimal volumeAguaSugeridoMm;
    private StatusRecomendacao status;

    public Long getIdRecomendacao() {
        return idRecomendacao;
    }

    public void setIdRecomendacao(Long idRecomendacao) {
        this.idRecomendacao = idRecomendacao;
    }

    public Long getIdArea() {
        return idArea;
    }

    public void setIdArea(Long idArea) {
        this.idArea = idArea;
    }

    public Long getIdAlerta() {
        return idAlerta;
    }

    public void setIdAlerta(Long idAlerta) {
        this.idAlerta = idAlerta;
    }

    public LocalDateTime getDataRecomendacao() {
        return dataRecomendacao;
    }

    public void setDataRecomendacao(LocalDateTime dataRecomendacao) {
        this.dataRecomendacao = dataRecomendacao;
    }

    public String getAcao() {
        return acao;
    }

    public void setAcao(String acao) {
        this.acao = acao;
    }

    public BigDecimal getVolumeAguaSugeridoMm() {
        return volumeAguaSugeridoMm;
    }

    public void setVolumeAguaSugeridoMm(BigDecimal volumeAguaSugeridoMm) {
        this.volumeAguaSugeridoMm = volumeAguaSugeridoMm;
    }

    public StatusRecomendacao getStatus() {
        return status;
    }

    public void setStatus(StatusRecomendacao status) {
        this.status = status;
    }
}
