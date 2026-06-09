package br.com.terranova.entities;

import br.com.terranova.enums.FonteSolo;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LeituraSolo {

    private Long idLeituraSolo;
    private Long idArea;
    private LocalDateTime dataColeta;
    private BigDecimal umidadeSolo;
    private String tipoSolo;
    private FonteSolo fonte;

    public Long getIdLeituraSolo() {
        return idLeituraSolo;
    }

    public void setIdLeituraSolo(Long idLeituraSolo) {
        this.idLeituraSolo = idLeituraSolo;
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

    public BigDecimal getUmidadeSolo() {
        return umidadeSolo;
    }

    public void setUmidadeSolo(BigDecimal umidadeSolo) {
        this.umidadeSolo = umidadeSolo;
    }

    public String getTipoSolo() {
        return tipoSolo;
    }

    public void setTipoSolo(String tipoSolo) {
        this.tipoSolo = tipoSolo;
    }

    public FonteSolo getFonte() {
        return fonte;
    }

    public void setFonte(FonteSolo fonte) {
        this.fonte = fonte;
    }
}
