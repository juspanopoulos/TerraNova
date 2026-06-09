package br.com.terranova.entities;

import br.com.terranova.enums.StatusPredicaoIa;
import br.com.terranova.enums.TipoModeloIa;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PredicaoIa {

    private Long idPredicao;
    private Long idArea;
    private Long idAreaCultura;
    private Long idUsuario;
    private LocalDateTime dataPredicao;
    private TipoModeloIa tipoModelo;
    private String nomeModelo;
    private String versaoModelo;
    private String entradaJson;
    private String saidaJson;
    private BigDecimal produtividadePrevista;
    private String classificacao;
    private BigDecimal volumeAguaSugeridoMm;
    private String situacao;
    private StatusPredicaoIa status;
    private String erro;

    public Long getIdPredicao() {
        return idPredicao;
    }

    public void setIdPredicao(Long idPredicao) {
        this.idPredicao = idPredicao;
    }

    public Long getIdArea() {
        return idArea;
    }

    public void setIdArea(Long idArea) {
        this.idArea = idArea;
    }

    public Long getIdAreaCultura() {
        return idAreaCultura;
    }

    public void setIdAreaCultura(Long idAreaCultura) {
        this.idAreaCultura = idAreaCultura;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public LocalDateTime getDataPredicao() {
        return dataPredicao;
    }

    public void setDataPredicao(LocalDateTime dataPredicao) {
        this.dataPredicao = dataPredicao;
    }

    public TipoModeloIa getTipoModelo() {
        return tipoModelo;
    }

    public void setTipoModelo(TipoModeloIa tipoModelo) {
        this.tipoModelo = tipoModelo;
    }

    public String getNomeModelo() {
        return nomeModelo;
    }

    public void setNomeModelo(String nomeModelo) {
        this.nomeModelo = nomeModelo;
    }

    public String getVersaoModelo() {
        return versaoModelo;
    }

    public void setVersaoModelo(String versaoModelo) {
        this.versaoModelo = versaoModelo;
    }

    public String getEntradaJson() {
        return entradaJson;
    }

    public void setEntradaJson(String entradaJson) {
        this.entradaJson = entradaJson;
    }

    public String getSaidaJson() {
        return saidaJson;
    }

    public void setSaidaJson(String saidaJson) {
        this.saidaJson = saidaJson;
    }

    public BigDecimal getProdutividadePrevista() {
        return produtividadePrevista;
    }

    public void setProdutividadePrevista(BigDecimal produtividadePrevista) {
        this.produtividadePrevista = produtividadePrevista;
    }

    public String getClassificacao() {
        return classificacao;
    }

    public void setClassificacao(String classificacao) {
        this.classificacao = classificacao;
    }

    public BigDecimal getVolumeAguaSugeridoMm() {
        return volumeAguaSugeridoMm;
    }

    public void setVolumeAguaSugeridoMm(BigDecimal volumeAguaSugeridoMm) {
        this.volumeAguaSugeridoMm = volumeAguaSugeridoMm;
    }

    public String getSituacao() {
        return situacao;
    }

    public void setSituacao(String situacao) {
        this.situacao = situacao;
    }

    public StatusPredicaoIa getStatus() {
        return status;
    }

    public void setStatus(StatusPredicaoIa status) {
        this.status = status;
    }

    public String getErro() {
        return erro;
    }

    public void setErro(String erro) {
        this.erro = erro;
    }
}
