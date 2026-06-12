package br.com.terranova.bo;

import br.com.terranova.dao.AreaMonitoradaDAO;
import br.com.terranova.dao.PropriedadeDAO;
import br.com.terranova.dto.request.AreaMonitoradaRequest;
import br.com.terranova.dto.response.AreaMonitoradaResponse;
import br.com.terranova.entities.AreaMonitorada;
import br.com.terranova.exceptions.EntidadeNaoEncontradaException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

@ApplicationScoped
public class AreaMonitoradaBO {

    @Inject
    AreaMonitoradaDAO areaMonitoradaDAO;

    @Inject
    PropriedadeDAO propriedadeDAO;

    public List<AreaMonitoradaResponse> listar() {
        return areaMonitoradaDAO.listar().stream().map(this::toResponse).toList();
    }

    public AreaMonitoradaResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    AreaMonitorada buscarEntidade(Long id) {
        BoUtils.validarId(id, "idArea");
        return BoUtils.obterOuFalhar(areaMonitoradaDAO.buscarPorId(id), "Area monitorada", id);
    }

    public AreaMonitoradaResponse criar(AreaMonitoradaRequest request) {
        validarPropriedade(request.idPropriedade());
        return toResponse(areaMonitoradaDAO.inserir(toEntity(request)));
    }

    public AreaMonitoradaResponse atualizar(Long id, AreaMonitoradaRequest request) {
        buscarEntidade(id);
        validarPropriedade(request.idPropriedade());
        AreaMonitorada area = toEntity(request);
        area.setIdArea(id);
        return toResponse(areaMonitoradaDAO.atualizar(area));
    }

    public void deletar(Long id) {
        buscarEntidade(id);
        if (!areaMonitoradaDAO.deletar(id)) {
            throw new EntidadeNaoEncontradaException("Area monitorada nao encontrada para exclusao.");
        }
    }

    private void validarPropriedade(Long idPropriedade) {
        BoUtils.validarId(idPropriedade, "idPropriedade");
        BoUtils.obterOuFalhar(propriedadeDAO.buscarPorId(idPropriedade), "Propriedade", idPropriedade);
    }

    private AreaMonitorada toEntity(AreaMonitoradaRequest request) {
        BoUtils.validarNaoNegativo(request.areaHectares(), "areaHectares");
        AreaMonitorada area = new AreaMonitorada();
        area.setIdPropriedade(request.idPropriedade());
        area.setNomeArea(BoUtils.textoObrigatorio(request.nomeArea(), "nomeArea"));
        area.setAreaHectares(request.areaHectares());
        area.setTipoSolo(BoUtils.tipoSoloPortugues(request.tipoSolo()));
        return area;
    }

    private AreaMonitoradaResponse toResponse(AreaMonitorada area) {
        return new AreaMonitoradaResponse(
                area.getIdArea(),
                area.getIdPropriedade(),
                area.getNomeArea(),
                area.getAreaHectares(),
                BoUtils.tipoSoloPortugues(area.getTipoSolo())
        );
    }
}
