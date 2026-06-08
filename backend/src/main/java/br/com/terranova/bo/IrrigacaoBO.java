package br.com.terranova.bo;

import br.com.terranova.dao.AreaMonitoradaDAO;
import br.com.terranova.dao.IrrigacaoDAO;
import br.com.terranova.dto.request.IrrigacaoRequest;
import br.com.terranova.dto.response.IrrigacaoResponse;
import br.com.terranova.entities.AreaMonitorada;
import br.com.terranova.entities.Irrigacao;
import br.com.terranova.enums.OrigemRegistro;
import br.com.terranova.enums.SimNao;
import br.com.terranova.exceptions.EntidadeNaoEncontradaException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.math.BigDecimal;
import java.util.List;

@ApplicationScoped
public class IrrigacaoBO {

    @Inject
    IrrigacaoDAO irrigacaoDAO;

    @Inject
    AreaMonitoradaDAO areaMonitoradaDAO;

    public List<IrrigacaoResponse> listar() {
        return irrigacaoDAO.listar().stream().map(this::toResponse).toList();
    }

    public List<IrrigacaoResponse> listarHistoricoPorArea(Long idArea) {
        validarArea(idArea);
        return irrigacaoDAO.buscarHistoricoPorArea(idArea).stream().map(this::toResponse).toList();
    }

    public IrrigacaoResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    Irrigacao buscarEntidade(Long id) {
        BoUtils.validarId(id, "idIrrigacao");
        return BoUtils.obterOuFalhar(irrigacaoDAO.buscarPorId(id), "Irrigacao", id);
    }

    public IrrigacaoResponse criar(IrrigacaoRequest request) {
        AreaMonitorada area = validarArea(request.idArea());
        return toResponse(irrigacaoDAO.inserir(toEntity(request, area)));
    }

    public IrrigacaoResponse atualizar(Long id, IrrigacaoRequest request) {
        buscarEntidade(id);
        AreaMonitorada area = validarArea(request.idArea());
        Irrigacao irrigacao = toEntity(request, area);
        irrigacao.setIdIrrigacao(id);
        return toResponse(irrigacaoDAO.atualizar(irrigacao));
    }

    public void deletar(Long id) {
        buscarEntidade(id);
        if (!irrigacaoDAO.deletar(id)) {
            throw new EntidadeNaoEncontradaException("Irrigacao nao encontrada para exclusao.");
        }
    }

    private AreaMonitorada validarArea(Long idArea) {
        BoUtils.validarId(idArea, "idArea");
        return BoUtils.obterOuFalhar(areaMonitoradaDAO.buscarPorId(idArea), "Area monitorada", idArea);
    }

    private Irrigacao toEntity(IrrigacaoRequest request, AreaMonitorada area) {
        BoUtils.valorObrigatorio(request.tipoIrrigacao(), "tipoIrrigacao");
        BoUtils.validarNaoNegativo(request.irrigacaoAnteriorMm(), "irrigacaoAnteriorMm");
        BoUtils.validarNaoNegativo(request.consumoAtualMm(), "consumoAtualMm");
        BoUtils.validarNaoNegativo(request.areaCampoHectare(), "areaCampoHectare");

        BigDecimal areaCampo = request.areaCampoHectare() == null ? area.getAreaHectares() : request.areaCampoHectare();

        Irrigacao irrigacao = new Irrigacao();
        irrigacao.setIdArea(request.idArea());
        irrigacao.setDataRegistro(BoUtils.dataHoraOuAgora(request.dataRegistro()));
        irrigacao.setTipoIrrigacao(request.tipoIrrigacao());
        irrigacao.setIrrigacaoAnteriorMm(request.irrigacaoAnteriorMm());
        irrigacao.setConsumoAtualMm(request.consumoAtualMm());
        irrigacao.setAreaCampoHectare(areaCampo);
        irrigacao.setUsouCoberturaSolo(request.usouCoberturaSolo() == null ? SimNao.NAO : request.usouCoberturaSolo());
        irrigacao.setOrigem(request.origem() == null ? OrigemRegistro.MANUAL : request.origem());
        return irrigacao;
    }

    private IrrigacaoResponse toResponse(Irrigacao irrigacao) {
        return new IrrigacaoResponse(
                irrigacao.getIdIrrigacao(),
                irrigacao.getIdArea(),
                irrigacao.getDataRegistro(),
                irrigacao.getTipoIrrigacao(),
                irrigacao.getIrrigacaoAnteriorMm(),
                irrigacao.getConsumoAtualMm(),
                irrigacao.getAreaCampoHectare(),
                irrigacao.getUsouCoberturaSolo(),
                irrigacao.getOrigem()
        );
    }
}
