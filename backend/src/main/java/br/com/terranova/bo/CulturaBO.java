package br.com.terranova.bo;

import br.com.terranova.dao.CulturaDAO;
import br.com.terranova.dto.request.CulturaRequest;
import br.com.terranova.dto.response.CulturaResponse;
import br.com.terranova.entities.Cultura;
import br.com.terranova.exceptions.EntidadeNaoEncontradaException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

@ApplicationScoped
public class CulturaBO {

    @Inject
    CulturaDAO culturaDAO;

    public List<CulturaResponse> listar() {
        return culturaDAO.listar().stream().map(this::toResponse).toList();
    }

    public CulturaResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    Cultura buscarEntidade(Long id) {
        BoUtils.validarId(id, "idCultura");
        return BoUtils.obterOuFalhar(culturaDAO.buscarPorId(id), "Cultura", id);
    }

    public CulturaResponse criar(CulturaRequest request) {
        return toResponse(culturaDAO.inserir(toEntity(request)));
    }

    public CulturaResponse atualizar(Long id, CulturaRequest request) {
        buscarEntidade(id);
        Cultura cultura = toEntity(request);
        cultura.setIdCultura(id);
        return toResponse(culturaDAO.atualizar(cultura));
    }

    public void deletar(Long id) {
        buscarEntidade(id);
        if (!culturaDAO.deletar(id)) {
            throw new EntidadeNaoEncontradaException("Cultura nao encontrada para exclusao.");
        }
    }

    private Cultura toEntity(CulturaRequest request) {
        Cultura cultura = new Cultura();
        cultura.setNomeCultura(BoUtils.textoObrigatorio(request.nomeCultura(), "nomeCultura"));
        cultura.setDescricao(BoUtils.normalizar(request.descricao()));
        cultura.setNecessidadeHidricaMm(
                BoUtils.naoNegativoObrigatorio(request.necessidadeHidricaMm(), "necessidadeHidricaMm"));
        cultura.setPeriodoPlantio(BoUtils.normalizar(request.periodoPlantio()));
        return cultura;
    }

    private CulturaResponse toResponse(Cultura cultura) {
        return new CulturaResponse(
                cultura.getIdCultura(),
                cultura.getNomeCultura(),
                cultura.getDescricao(),
                cultura.getNecessidadeHidricaMm(),
                cultura.getPeriodoPlantio()
        );
    }
}
