package br.com.terranova.bo;

import br.com.terranova.dao.AreaMonitoradaDAO;
import br.com.terranova.dao.LeituraSoloDAO;
import br.com.terranova.dto.request.LeituraSoloRequest;
import br.com.terranova.dto.response.LeituraSoloResponse;
import br.com.terranova.entities.AreaMonitorada;
import br.com.terranova.entities.LeituraSolo;
import br.com.terranova.enums.FonteSolo;
import br.com.terranova.exceptions.EntidadeNaoEncontradaException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

@ApplicationScoped
public class LeituraSoloBO {

    @Inject
    LeituraSoloDAO leituraSoloDAO;

    @Inject
    AreaMonitoradaDAO areaMonitoradaDAO;

    public List<LeituraSoloResponse> listar() {
        return leituraSoloDAO.listar().stream().map(this::toResponse).toList();
    }

    public List<LeituraSoloResponse> listarHistoricoPorArea(Long idArea) {
        validarArea(idArea);
        return leituraSoloDAO.buscarHistoricoPorArea(idArea).stream().map(this::toResponse).toList();
    }

    public LeituraSoloResponse buscarUltimaPorArea(Long idArea) {
        validarArea(idArea);
        return toResponse(BoUtils.obterOuFalhar(leituraSoloDAO.buscarUltimaPorArea(idArea), "Leitura de solo", idArea));
    }

    public LeituraSoloResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    LeituraSolo buscarEntidade(Long id) {
        BoUtils.validarId(id, "idLeituraSolo");
        return BoUtils.obterOuFalhar(leituraSoloDAO.buscarPorId(id), "Leitura de solo", id);
    }

    public LeituraSoloResponse criar(LeituraSoloRequest request) {
        AreaMonitorada area = validarArea(request.idArea());
        return toResponse(leituraSoloDAO.inserir(toEntity(request, area)));
    }

    public LeituraSoloResponse atualizar(Long id, LeituraSoloRequest request) {
        buscarEntidade(id);
        AreaMonitorada area = validarArea(request.idArea());
        LeituraSolo leitura = toEntity(request, area);
        leitura.setIdLeituraSolo(id);
        return toResponse(leituraSoloDAO.atualizar(leitura));
    }

    public void deletar(Long id) {
        buscarEntidade(id);
        if (!leituraSoloDAO.deletar(id)) {
            throw new EntidadeNaoEncontradaException("Leitura de solo nao encontrada para exclusao.");
        }
    }

    private AreaMonitorada validarArea(Long idArea) {
        BoUtils.validarId(idArea, "idArea");
        return BoUtils.obterOuFalhar(areaMonitoradaDAO.buscarPorId(idArea), "Area monitorada", idArea);
    }

    private LeituraSolo toEntity(LeituraSoloRequest request, AreaMonitorada area) {
        BoUtils.percentualObrigatorio(request.umidadeSolo(), "umidadeSolo");
        String tipoSolo = BoUtils.tipoSoloPortugues(request.tipoSolo());
        String tipoSoloArea = BoUtils.tipoSoloPortugues(area.getTipoSolo());

        LeituraSolo leitura = new LeituraSolo();
        leitura.setIdArea(request.idArea());
        leitura.setDataColeta(BoUtils.dataHoraOuAgora(request.dataColeta()));
        leitura.setUmidadeSolo(request.umidadeSolo());
        leitura.setTipoSolo(tipoSolo == null ? tipoSoloArea : tipoSolo);
        leitura.setFonte(request.fonte() == null ? FonteSolo.MANUAL : request.fonte());
        return leitura;
    }

    private LeituraSoloResponse toResponse(LeituraSolo leitura) {
        return new LeituraSoloResponse(
                leitura.getIdLeituraSolo(),
                leitura.getIdArea(),
                leitura.getDataColeta(),
                leitura.getUmidadeSolo(),
                BoUtils.tipoSoloPortugues(leitura.getTipoSolo()),
                leitura.getFonte()
        );
    }
}
