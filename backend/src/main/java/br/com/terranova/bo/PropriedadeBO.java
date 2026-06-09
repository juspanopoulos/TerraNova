package br.com.terranova.bo;

import br.com.terranova.dao.EmpresaDAO;
import br.com.terranova.dao.PropriedadeDAO;
import br.com.terranova.dto.request.PropriedadeRequest;
import br.com.terranova.dto.response.PropriedadeResponse;
import br.com.terranova.entities.Propriedade;
import br.com.terranova.exceptions.EntidadeNaoEncontradaException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.math.BigDecimal;
import java.util.List;

@ApplicationScoped
public class PropriedadeBO {

    @Inject
    PropriedadeDAO propriedadeDAO;

    @Inject
    EmpresaDAO empresaDAO;

    public List<PropriedadeResponse> listar() {
        return propriedadeDAO.listar().stream().map(this::toResponse).toList();
    }

    public PropriedadeResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    Propriedade buscarEntidade(Long id) {
        BoUtils.validarId(id, "idPropriedade");
        return BoUtils.obterOuFalhar(propriedadeDAO.buscarPorId(id), "Propriedade", id);
    }

    public PropriedadeResponse criar(PropriedadeRequest request) {
        validarEmpresa(request.idEmpresa());
        return toResponse(propriedadeDAO.inserir(toEntity(request)));
    }

    public PropriedadeResponse atualizar(Long id, PropriedadeRequest request) {
        buscarEntidade(id);
        validarEmpresa(request.idEmpresa());
        Propriedade propriedade = toEntity(request);
        propriedade.setIdPropriedade(id);
        return toResponse(propriedadeDAO.atualizar(propriedade));
    }

    public void deletar(Long id) {
        buscarEntidade(id);
        if (!propriedadeDAO.deletar(id)) {
            throw new EntidadeNaoEncontradaException("Propriedade nao encontrada para exclusao.");
        }
    }

    private void validarEmpresa(Long idEmpresa) {
        BoUtils.validarId(idEmpresa, "idEmpresa");
        BoUtils.obterOuFalhar(empresaDAO.buscarPorId(idEmpresa), "Empresa", idEmpresa);
    }

    private Propriedade toEntity(PropriedadeRequest request) {
        BoUtils.validarIntervalo(request.latitude(), BigDecimal.valueOf(-90), BigDecimal.valueOf(90), "latitude");
        BoUtils.validarIntervalo(request.longitude(), BigDecimal.valueOf(-180), BigDecimal.valueOf(180), "longitude");
        BoUtils.validarNaoNegativo(request.areaTotalHectares(), "areaTotalHectares");

        Propriedade propriedade = new Propriedade();
        propriedade.setIdEmpresa(request.idEmpresa());
        propriedade.setNomePropriedade(BoUtils.textoObrigatorio(request.nomePropriedade(), "nomePropriedade"));
        propriedade.setLocalizacao(BoUtils.textoObrigatorio(request.localizacao(), "localizacao"));
        propriedade.setLatitude(request.latitude());
        propriedade.setLongitude(request.longitude());
        propriedade.setAreaTotalHectares(request.areaTotalHectares());
        return propriedade;
    }

    private PropriedadeResponse toResponse(Propriedade propriedade) {
        return new PropriedadeResponse(
                propriedade.getIdPropriedade(),
                propriedade.getIdEmpresa(),
                propriedade.getNomePropriedade(),
                propriedade.getLocalizacao(),
                propriedade.getLatitude(),
                propriedade.getLongitude(),
                propriedade.getAreaTotalHectares()
        );
    }
}
