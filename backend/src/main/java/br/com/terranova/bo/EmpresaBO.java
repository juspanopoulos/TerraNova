package br.com.terranova.bo;

import br.com.terranova.dao.EmpresaDAO;
import br.com.terranova.dto.request.EmpresaRequest;
import br.com.terranova.dto.response.EmpresaResponse;
import br.com.terranova.entities.Empresa;
import br.com.terranova.exceptions.EntidadeNaoEncontradaException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class EmpresaBO {

    @Inject
    EmpresaDAO empresaDAO;

    public List<EmpresaResponse> listar() {
        return empresaDAO.listar().stream().map(this::toResponse).toList();
    }

    public EmpresaResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    Empresa buscarEntidade(Long id) {
        BoUtils.validarId(id, "idEmpresa");
        return BoUtils.obterOuFalhar(empresaDAO.buscarPorId(id), "Empresa", id);
    }

    public EmpresaResponse criar(EmpresaRequest request) {
        Empresa empresa = toEntity(request);
        empresa.setDataCadastro(LocalDateTime.now());
        return toResponse(empresaDAO.inserir(empresa));
    }

    public EmpresaResponse atualizar(Long id, EmpresaRequest request) {
        Empresa atual = buscarEntidade(id);
        Empresa empresa = toEntity(request);
        empresa.setIdEmpresa(id);
        empresa.setDataCadastro(atual.getDataCadastro());
        return toResponse(empresaDAO.atualizar(empresa));
    }

    public void deletar(Long id) {
        buscarEntidade(id);
        if (!empresaDAO.deletar(id)) {
            throw new EntidadeNaoEncontradaException("Empresa nao encontrada para exclusao.");
        }
    }

    private Empresa toEntity(EmpresaRequest request) {
        Empresa empresa = new Empresa();
        empresa.setNomeEmpresa(BoUtils.textoObrigatorio(request.nomeEmpresa(), "nomeEmpresa"));
        empresa.setCnpj(BoUtils.textoObrigatorio(request.cnpj(), "cnpj"));
        empresa.setEmail(BoUtils.textoObrigatorio(request.email(), "email").toLowerCase());
        empresa.setTelefone(BoUtils.normalizar(request.telefone()));
        return empresa;
    }

    private EmpresaResponse toResponse(Empresa empresa) {
        return new EmpresaResponse(
                empresa.getIdEmpresa(),
                empresa.getNomeEmpresa(),
                empresa.getCnpj(),
                empresa.getEmail(),
                empresa.getTelefone(),
                empresa.getDataCadastro()
        );
    }
}
