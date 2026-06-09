package br.com.terranova.bo;

import br.com.terranova.dao.EmpresaDAO;
import br.com.terranova.dao.UsuarioDAO;
import br.com.terranova.dto.request.UsuarioRequest;
import br.com.terranova.dto.response.UsuarioResponse;
import br.com.terranova.entities.Usuario;
import br.com.terranova.enums.PerfilUsuario;
import br.com.terranova.enums.StatusUsuario;
import br.com.terranova.exceptions.ConflitoException;
import br.com.terranova.exceptions.EntidadeNaoEncontradaException;
import br.com.terranova.utils.PasswordUtils;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class UsuarioBO {

    @Inject
    UsuarioDAO usuarioDAO;

    @Inject
    EmpresaDAO empresaDAO;

    public List<UsuarioResponse> listar() {
        return usuarioDAO.listar().stream().map(this::toResponse).toList();
    }

    public UsuarioResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    Usuario buscarEntidade(Long id) {
        BoUtils.validarId(id, "idUsuario");
        return BoUtils.obterOuFalhar(usuarioDAO.buscarPorId(id), "Usuario", id);
    }

    public UsuarioResponse criar(UsuarioRequest request) {
        validarEmpresa(request.idEmpresa());
        String email = BoUtils.textoObrigatorio(request.email(), "email").toLowerCase();
        usuarioDAO.buscarPorEmail(email).ifPresent(usuario -> {
            throw new ConflitoException("Ja existe usuario cadastrado com este email.");
        });

        Usuario usuario = toEntity(request, email);
        usuario.setDataCadastro(LocalDateTime.now());
        return toResponse(usuarioDAO.inserir(usuario));
    }

    public UsuarioResponse atualizar(Long id, UsuarioRequest request) {
        Usuario atual = buscarEntidade(id);
        validarEmpresa(request.idEmpresa());
        String email = BoUtils.textoObrigatorio(request.email(), "email").toLowerCase();
        usuarioDAO.buscarPorEmail(email)
                .filter(usuario -> !usuario.getIdUsuario().equals(id))
                .ifPresent(usuario -> {
                    throw new ConflitoException("Ja existe outro usuario cadastrado com este email.");
                });

        Usuario usuario = toEntity(request, email);
        usuario.setIdUsuario(id);
        usuario.setDataCadastro(atual.getDataCadastro());
        usuario.setDataUltimoAcesso(atual.getDataUltimoAcesso());
        return toResponse(usuarioDAO.atualizar(usuario));
    }

    public void deletar(Long id) {
        buscarEntidade(id);
        if (!usuarioDAO.deletar(id)) {
            throw new EntidadeNaoEncontradaException("Usuario nao encontrado para exclusao.");
        }
    }

    private void validarEmpresa(Long idEmpresa) {
        BoUtils.validarId(idEmpresa, "idEmpresa");
        BoUtils.obterOuFalhar(empresaDAO.buscarPorId(idEmpresa), "Empresa", idEmpresa);
    }

    private Usuario toEntity(UsuarioRequest request, String email) {
        Usuario usuario = new Usuario();
        usuario.setIdEmpresa(request.idEmpresa());
        usuario.setNomeUsuario(BoUtils.textoObrigatorio(request.nomeUsuario(), "nomeUsuario"));
        usuario.setEmail(email);
        usuario.setSenhaHash(PasswordUtils.gerarHash(request.senha()));
        usuario.setCpf(BoUtils.normalizar(request.cpf()));
        usuario.setPerfil(request.perfil() == null ? PerfilUsuario.OPERADOR : request.perfil());
        usuario.setStatus(request.status() == null ? StatusUsuario.ATIVO : request.status());
        return usuario;
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getIdUsuario(),
                usuario.getIdEmpresa(),
                usuario.getNomeUsuario(),
                usuario.getEmail(),
                usuario.getCpf(),
                usuario.getPerfil(),
                usuario.getStatus(),
                usuario.getDataCadastro(),
                usuario.getDataUltimoAcesso()
        );
    }
}
