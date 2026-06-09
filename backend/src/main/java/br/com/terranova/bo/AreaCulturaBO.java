package br.com.terranova.bo;

import br.com.terranova.dao.AreaCulturaDAO;
import br.com.terranova.dao.AreaMonitoradaDAO;
import br.com.terranova.dao.CulturaDAO;
import br.com.terranova.dto.request.AreaCulturaRequest;
import br.com.terranova.dto.response.AreaCulturaResponse;
import br.com.terranova.entities.AreaCultura;
import br.com.terranova.enums.StatusAreaCultura;
import br.com.terranova.exceptions.EntidadeNaoEncontradaException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

@ApplicationScoped
public class AreaCulturaBO {

    @Inject
    AreaCulturaDAO areaCulturaDAO;

    @Inject
    AreaMonitoradaDAO areaMonitoradaDAO;

    @Inject
    CulturaDAO culturaDAO;

    public List<AreaCulturaResponse> listar() {
        return areaCulturaDAO.listar().stream().map(this::toResponse).toList();
    }

    public List<AreaCulturaResponse> listarAtivos() {
        return areaCulturaDAO.listarAtivos().stream().map(this::toResponse).toList();
    }

    public AreaCulturaResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    AreaCultura buscarEntidade(Long id) {
        BoUtils.validarId(id, "idAreaCultura");
        return BoUtils.obterOuFalhar(areaCulturaDAO.buscarPorId(id), "Area cultura", id);
    }

    public AreaCulturaResponse criar(AreaCulturaRequest request) {
        validarRelacionamentos(request.idArea(), request.idCultura());
        return toResponse(areaCulturaDAO.inserir(toEntity(request)));
    }

    public AreaCulturaResponse atualizar(Long id, AreaCulturaRequest request) {
        buscarEntidade(id);
        validarRelacionamentos(request.idArea(), request.idCultura());
        AreaCultura areaCultura = toEntity(request);
        areaCultura.setIdAreaCultura(id);
        return toResponse(areaCulturaDAO.atualizar(areaCultura));
    }

    public void deletar(Long id) {
        buscarEntidade(id);
        if (!areaCulturaDAO.deletar(id)) {
            throw new EntidadeNaoEncontradaException("Area cultura nao encontrada para exclusao.");
        }
    }

    private void validarRelacionamentos(Long idArea, Long idCultura) {
        BoUtils.validarId(idArea, "idArea");
        BoUtils.validarId(idCultura, "idCultura");
        BoUtils.obterOuFalhar(areaMonitoradaDAO.buscarPorId(idArea), "Area monitorada", idArea);
        BoUtils.obterOuFalhar(culturaDAO.buscarPorId(idCultura), "Cultura", idCultura);
    }

    private AreaCultura toEntity(AreaCulturaRequest request) {
        BoUtils.valorObrigatorio(request.dataPlantio(), "dataPlantio");
        BoUtils.validarColheita(request.dataPlantio(), request.dataColheitaPrevista());

        AreaCultura areaCultura = new AreaCultura();
        areaCultura.setIdArea(request.idArea());
        areaCultura.setIdCultura(request.idCultura());
        areaCultura.setDataPlantio(request.dataPlantio());
        areaCultura.setDataColheitaPrevista(request.dataColheitaPrevista());
        areaCultura.setStatus(request.status() == null ? StatusAreaCultura.ATIVO : request.status());
        areaCultura.setEstagioCrescimento(BoUtils.normalizar(request.estagioCrescimento()));
        return areaCultura;
    }

    private AreaCulturaResponse toResponse(AreaCultura areaCultura) {
        return new AreaCulturaResponse(
                areaCultura.getIdAreaCultura(),
                areaCultura.getIdArea(),
                areaCultura.getIdCultura(),
                areaCultura.getDataPlantio(),
                areaCultura.getDataColheitaPrevista(),
                areaCultura.getStatus(),
                areaCultura.getEstagioCrescimento()
        );
    }
}
