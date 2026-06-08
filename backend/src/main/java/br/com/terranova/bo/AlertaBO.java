package br.com.terranova.bo;

import br.com.terranova.dao.AlertaDAO;
import br.com.terranova.dao.AreaMonitoradaDAO;
import br.com.terranova.dto.request.AlertaRequest;
import br.com.terranova.dto.response.AlertaResponse;
import br.com.terranova.entities.Alerta;
import br.com.terranova.enums.StatusAlerta;
import br.com.terranova.exceptions.EntidadeNaoEncontradaException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

@ApplicationScoped
public class AlertaBO {

    @Inject
    AlertaDAO alertaDAO;

    @Inject
    AreaMonitoradaDAO areaMonitoradaDAO;

    public List<AlertaResponse> listar() {
        return alertaDAO.listar().stream().map(this::toResponse).toList();
    }

    public List<AlertaResponse> listarAbertos() {
        return alertaDAO.buscarAbertos().stream().map(this::toResponse).toList();
    }

    public AlertaResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    Alerta buscarEntidade(Long id) {
        BoUtils.validarId(id, "idAlerta");
        return BoUtils.obterOuFalhar(alertaDAO.buscarPorId(id), "Alerta", id);
    }

    public AlertaResponse criar(AlertaRequest request) {
        validarArea(request.idArea());
        return toResponse(alertaDAO.inserir(toEntity(request)));
    }

    public AlertaResponse atualizar(Long id, AlertaRequest request) {
        buscarEntidade(id);
        validarArea(request.idArea());
        Alerta alerta = toEntity(request);
        alerta.setIdAlerta(id);
        return toResponse(alertaDAO.atualizar(alerta));
    }

    public AlertaResponse resolver(Long id) {
        buscarEntidade(id);
        if (!alertaDAO.resolver(id)) {
            throw new EntidadeNaoEncontradaException("Alerta nao encontrado para resolver.");
        }
        return buscarPorId(id);
    }

    public void deletar(Long id) {
        buscarEntidade(id);
        if (!alertaDAO.deletar(id)) {
            throw new EntidadeNaoEncontradaException("Alerta nao encontrado para exclusao.");
        }
    }

    private void validarArea(Long idArea) {
        BoUtils.validarId(idArea, "idArea");
        BoUtils.obterOuFalhar(areaMonitoradaDAO.buscarPorId(idArea), "Area monitorada", idArea);
    }

    private Alerta toEntity(AlertaRequest request) {
        Alerta alerta = new Alerta();
        alerta.setIdArea(request.idArea());
        alerta.setDataAlerta(BoUtils.dataHoraOuAgora(request.dataAlerta()));
        alerta.setTipoAlerta(BoUtils.valorObrigatorio(request.tipoAlerta(), "tipoAlerta"));
        alerta.setDescricao(BoUtils.textoObrigatorio(request.descricao(), "descricao"));
        alerta.setSeveridade(BoUtils.valorObrigatorio(request.severidade(), "severidade"));
        alerta.setStatus(request.status() == null ? StatusAlerta.ABERTO : request.status());
        return alerta;
    }

    private AlertaResponse toResponse(Alerta alerta) {
        return new AlertaResponse(
                alerta.getIdAlerta(),
                alerta.getIdArea(),
                alerta.getDataAlerta(),
                alerta.getTipoAlerta(),
                alerta.getDescricao(),
                alerta.getSeveridade(),
                alerta.getStatus()
        );
    }
}
