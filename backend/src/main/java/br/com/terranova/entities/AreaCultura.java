package br.com.terranova.entities;

import br.com.terranova.enums.StatusAreaCultura;
import java.time.LocalDate;

public class AreaCultura {

    private Long idAreaCultura;
    private Long idArea;
    private Long idCultura;
    private LocalDate dataPlantio;
    private LocalDate dataColheitaPrevista;
    private StatusAreaCultura status;
    private String estagioCrescimento;

    public Long getIdAreaCultura() {
        return idAreaCultura;
    }

    public void setIdAreaCultura(Long idAreaCultura) {
        this.idAreaCultura = idAreaCultura;
    }

    public Long getIdArea() {
        return idArea;
    }

    public void setIdArea(Long idArea) {
        this.idArea = idArea;
    }

    public Long getIdCultura() {
        return idCultura;
    }

    public void setIdCultura(Long idCultura) {
        this.idCultura = idCultura;
    }

    public LocalDate getDataPlantio() {
        return dataPlantio;
    }

    public void setDataPlantio(LocalDate dataPlantio) {
        this.dataPlantio = dataPlantio;
    }

    public LocalDate getDataColheitaPrevista() {
        return dataColheitaPrevista;
    }

    public void setDataColheitaPrevista(LocalDate dataColheitaPrevista) {
        this.dataColheitaPrevista = dataColheitaPrevista;
    }

    public StatusAreaCultura getStatus() {
        return status;
    }

    public void setStatus(StatusAreaCultura status) {
        this.status = status;
    }

    public String getEstagioCrescimento() {
        return estagioCrescimento;
    }

    public void setEstagioCrescimento(String estagioCrescimento) {
        this.estagioCrescimento = estagioCrescimento;
    }
}
