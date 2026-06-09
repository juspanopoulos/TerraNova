package br.com.terranova.bo;

import br.com.terranova.dao.AlertaDAO;
import br.com.terranova.dao.AreaMonitoradaDAO;
import br.com.terranova.dao.RecomendacaoDAO;
import br.com.terranova.dto.request.RecomendacaoRequest;
import br.com.terranova.dto.response.RecomendacaoResponse;
import br.com.terranova.entities.Alerta;
import br.com.terranova.entities.Recomendacao;
import br.com.terranova.enums.StatusRecomendacao;
import br.com.terranova.exceptions.EntidadeNaoEncontradaException;
import br.com.terranova.exceptions.ValidacaoException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

@ApplicationScoped
public class RecomendacaoBO {

    @Inject
    RecomendacaoDAO recomendacaoDAO;

    @Inject
    AreaMonitoradaDAO areaMonitoradaDAO;

    @Inject
    AlertaDAO alertaDAO;

    public List<RecomendacaoResponse> listar() {
        return recomendacaoDAO.listar().stream().map(this::toResponse).toList();
    }

    public List<RecomendacaoResponse> listarPendentes() {
        return recomendacaoDAO.buscarPendentes().stream().map(this::toResponse).toList();
    }

    public RecomendacaoResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    Recomendacao buscarEntidade(Long id) {
        BoUtils.validarId(id, "idRecomendacao");
        return BoUtils.obterOuFalhar(recomendacaoDAO.buscarPorId(id), "Recomendacao", id);
    }

    public RecomendacaoResponse criar(RecomendacaoRequest request) {
        validarRelacionamentos(request.idArea(), request.idAlerta());
        return toResponse(recomendacaoDAO.inserir(toEntity(request)));
    }

    public RecomendacaoResponse atualizar(Long id, RecomendacaoRequest request) {
        buscarEntidade(id);
        validarRelacionamentos(request.idArea(), request.idAlerta());
        Recomendacao recomendacao = toEntity(request);
        recomendacao.setIdRecomendacao(id);
        return toResponse(recomendacaoDAO.atualizar(recomendacao));
    }

    public RecomendacaoResponse aplicar(Long id) {
        return atualizarStatus(id, StatusRecomendacao.APLICADA);
    }

    public RecomendacaoResponse ignorar(Long id) {
        return atualizarStatus(id, StatusRecomendacao.IGNORADA);
    }

    public void deletar(Long id) {
        buscarEntidade(id);
        if (!recomendacaoDAO.deletar(id)) {
            throw new EntidadeNaoEncontradaException("Recomendacao nao encontrada para exclusao.");
        }
    }

    private RecomendacaoResponse atualizarStatus(Long id, StatusRecomendacao novoStatus) {
        Recomendacao atual = buscarEntidade(id);
        if (atual.getStatus() == novoStatus) {
            return toResponse(atual);
        }
        if (atual.getStatus() != StatusRecomendacao.PENDENTE) {
            throw new ValidacaoException("Somente recomendacoes pendentes podem mudar de status.");
        }
        if (!recomendacaoDAO.atualizarStatus(id, novoStatus)) {
            throw new EntidadeNaoEncontradaException("Recomendacao nao encontrada para atualizar status.");
        }
        return buscarPorId(id);
    }

    private void validarRelacionamentos(Long idArea, Long idAlerta) {
        BoUtils.validarId(idArea, "idArea");
        BoUtils.obterOuFalhar(areaMonitoradaDAO.buscarPorId(idArea), "Area monitorada", idArea);
        if (idAlerta == null) {
            return;
        }
        BoUtils.validarId(idAlerta, "idAlerta");
        Alerta alerta = BoUtils.obterOuFalhar(alertaDAO.buscarPorId(idAlerta), "Alerta", idAlerta);
        if (!alerta.getIdArea().equals(idArea)) {
            throw new ValidacaoException("idAlerta deve pertencer a mesma area da recomendacao.");
        }
    }

    private Recomendacao toEntity(RecomendacaoRequest request) {
        BoUtils.validarNaoNegativo(request.volumeAguaSugeridoMm(), "volumeAguaSugeridoMm");

        Recomendacao recomendacao = new Recomendacao();
        recomendacao.setIdArea(request.idArea());
        recomendacao.setIdAlerta(request.idAlerta());
        recomendacao.setDataRecomendacao(BoUtils.dataHoraOuAgora(request.dataRecomendacao()));
        recomendacao.setAcao(BoUtils.textoObrigatorio(request.acao(), "acao"));
        recomendacao.setVolumeAguaSugeridoMm(request.volumeAguaSugeridoMm());
        recomendacao.setStatus(request.status() == null ? StatusRecomendacao.PENDENTE : request.status());
        return recomendacao;
    }

    private RecomendacaoResponse toResponse(Recomendacao recomendacao) {
        return new RecomendacaoResponse(
                recomendacao.getIdRecomendacao(),
                recomendacao.getIdArea(),
                recomendacao.getIdAlerta(),
                recomendacao.getDataRecomendacao(),
                recomendacao.getAcao(),
                recomendacao.getVolumeAguaSugeridoMm(),
                recomendacao.getStatus()
        );
    }
}
