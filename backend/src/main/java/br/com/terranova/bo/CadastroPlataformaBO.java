package br.com.terranova.bo;

import br.com.terranova.dto.request.CadastroPlataformaRequest;
import br.com.terranova.dto.request.EmpresaRequest;
import br.com.terranova.dto.request.PropriedadeRequest;
import br.com.terranova.dto.request.UsuarioRequest;
import br.com.terranova.dto.response.CadastroPlataformaResponse;
import br.com.terranova.dto.response.EmpresaResponse;
import br.com.terranova.dto.response.PropriedadeResponse;
import br.com.terranova.dto.response.UsuarioResponse;
import br.com.terranova.enums.PerfilUsuario;
import br.com.terranova.enums.StatusUsuario;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class CadastroPlataformaBO {

    @Inject
    EmpresaBO empresaBO;

    @Inject
    PropriedadeBO propriedadeBO;

    @Inject
    UsuarioBO usuarioBO;

    public CadastroPlataformaResponse cadastrar(CadastroPlataformaRequest request) {
        EmpresaResponse empresa = empresaBO.criar(new EmpresaRequest(
                request.nomeEmpresa(),
                request.cnpj(),
                request.emailEmpresa(),
                request.telefoneEmpresa()
        ));

        PropriedadeResponse propriedade = propriedadeBO.criar(new PropriedadeRequest(
                empresa.idEmpresa(),
                request.nomePropriedade(),
                request.localizacao(),
                request.latitude(),
                request.longitude(),
                request.areaTotalHectares()
        ));

        UsuarioResponse usuario = usuarioBO.criar(new UsuarioRequest(
                empresa.idEmpresa(),
                request.nomeUsuario(),
                request.emailUsuario(),
                request.senha(),
                request.cpf(),
                PerfilUsuario.ADMIN,
                StatusUsuario.ATIVO
        ));

        return new CadastroPlataformaResponse(empresa, propriedade, usuario);
    }
}
