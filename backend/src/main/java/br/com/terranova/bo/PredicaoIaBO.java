package br.com.terranova.bo;

import br.com.terranova.dao.AreaCulturaDAO;
import br.com.terranova.dao.AreaMonitoradaDAO;
import br.com.terranova.dao.PredicaoIaDAO;
import br.com.terranova.dao.UsuarioDAO;
import br.com.terranova.dto.request.PredicaoIaRequest;
import br.com.terranova.dto.response.PredicaoIaResponse;
import br.com.terranova.entities.AreaCultura;
import br.com.terranova.entities.PredicaoIa;
import br.com.terranova.enums.StatusPredicaoIa;
import br.com.terranova.exceptions.EntidadeNaoEncontradaException;
import br.com.terranova.exceptions.ValidacaoException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

@ApplicationScoped
public class PredicaoIaBO {

    @Inject
    PredicaoIaDAO predicaoIaDAO;

    @Inject
    AreaMonitoradaDAO areaMonitoradaDAO;

    @Inject
    AreaCulturaDAO areaCulturaDAO;

    @Inject
    UsuarioDAO usuarioDAO;

    public List<PredicaoIaResponse> listar() {
        return predicaoIaDAO.listar().stream().map(this::toResponse).toList();
    }

    public List<PredicaoIaResponse> listarPorArea(Long idArea) {
        validarArea(idArea);
        return predicaoIaDAO.buscarPorArea(idArea).stream().map(this::toResponse).toList();
    }

    public PredicaoIaResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    PredicaoIa buscarEntidade(Long id) {
        BoUtils.validarId(id, "idPredicao");
        return BoUtils.obterOuFalhar(predicaoIaDAO.buscarPorId(id), "Predicao de IA", id);
    }

    public PredicaoIaResponse criar(PredicaoIaRequest request) {
        validarRelacionamentos(request);
        return toResponse(predicaoIaDAO.inserir(toEntity(request)));
    }

    public PredicaoIaResponse atualizar(Long id, PredicaoIaRequest request) {
        buscarEntidade(id);
        validarRelacionamentos(request);
        PredicaoIa predicao = toEntity(request);
        predicao.setIdPredicao(id);
        return toResponse(predicaoIaDAO.atualizar(predicao));
    }

    public void deletar(Long id) {
        buscarEntidade(id);
        if (!predicaoIaDAO.deletar(id)) {
            throw new EntidadeNaoEncontradaException("Predicao de IA nao encontrada para exclusao.");
        }
    }

    private void validarRelacionamentos(PredicaoIaRequest request) {
        validarArea(request.idArea());
        if (request.idAreaCultura() != null) {
            BoUtils.validarId(request.idAreaCultura(), "idAreaCultura");
            AreaCultura areaCultura = BoUtils.obterOuFalhar(
                    areaCulturaDAO.buscarPorId(request.idAreaCultura()), "Area cultura", request.idAreaCultura());
            if (!areaCultura.getIdArea().equals(request.idArea())) {
                throw new ValidacaoException("idAreaCultura deve pertencer a mesma area da predicao.");
            }
        }
        if (request.idUsuario() != null) {
            BoUtils.validarId(request.idUsuario(), "idUsuario");
            BoUtils.obterOuFalhar(usuarioDAO.buscarPorId(request.idUsuario()), "Usuario", request.idUsuario());
        }
    }

    private void validarArea(Long idArea) {
        BoUtils.validarId(idArea, "idArea");
        BoUtils.obterOuFalhar(areaMonitoradaDAO.buscarPorId(idArea), "Area monitorada", idArea);
    }

    private PredicaoIa toEntity(PredicaoIaRequest request) {
        BoUtils.valorObrigatorio(request.tipoModelo(), "tipoModelo");
        String entradaJson = BoUtils.textoObrigatorio(request.entradaJson(), "entradaJson");
        String saidaJson = BoUtils.normalizar(request.saidaJson());
        String erro = BoUtils.normalizar(request.erro());
        StatusPredicaoIa status = request.status() == null
                ? (erro == null ? StatusPredicaoIa.SUCESSO : StatusPredicaoIa.ERRO)
                : request.status();

        BoUtils.validarJsonBasico(entradaJson, "entradaJson");
        BoUtils.validarJsonBasico(saidaJson, "saidaJson");
        BoUtils.validarNaoNegativo(request.produtividadePrevista(), "produtividadePrevista");
        BoUtils.validarNaoNegativo(request.volumeAguaSugeridoMm(), "volumeAguaSugeridoMm");
        if (status == StatusPredicaoIa.ERRO && erro == null) {
            throw new ValidacaoException("erro deve ser informado quando status for ERRO.");
        }

        PredicaoIa predicao = new PredicaoIa();
        predicao.setIdArea(request.idArea());
        predicao.setIdAreaCultura(request.idAreaCultura());
        predicao.setIdUsuario(request.idUsuario());
        predicao.setDataPredicao(BoUtils.dataHoraOuAgora(request.dataPredicao()));
        predicao.setTipoModelo(request.tipoModelo());
        predicao.setNomeModelo(BoUtils.normalizar(request.nomeModelo()));
        predicao.setVersaoModelo(BoUtils.normalizar(request.versaoModelo()));
        predicao.setEntradaJson(entradaJson);
        predicao.setSaidaJson(saidaJson);
        predicao.setProdutividadePrevista(request.produtividadePrevista());
        predicao.setClassificacao(BoUtils.normalizar(request.classificacao()));
        predicao.setVolumeAguaSugeridoMm(request.volumeAguaSugeridoMm());
        predicao.setSituacao(BoUtils.normalizar(request.situacao()));
        predicao.setStatus(status);
        predicao.setErro(erro);
        return predicao;
    }

    private PredicaoIaResponse toResponse(PredicaoIa predicao) {
        return new PredicaoIaResponse(
                predicao.getIdPredicao(),
                predicao.getIdArea(),
                predicao.getIdAreaCultura(),
                predicao.getIdUsuario(),
                predicao.getDataPredicao(),
                predicao.getTipoModelo(),
                predicao.getNomeModelo(),
                predicao.getVersaoModelo(),
                predicao.getEntradaJson(),
                predicao.getSaidaJson(),
                predicao.getProdutividadePrevista(),
                predicao.getClassificacao(),
                predicao.getVolumeAguaSugeridoMm(),
                predicao.getSituacao(),
                predicao.getStatus(),
                predicao.getErro()
        );
    }
}
