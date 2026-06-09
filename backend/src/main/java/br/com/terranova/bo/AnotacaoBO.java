package br.com.terranova.bo;

import br.com.terranova.dao.AnotacaoDAO;
import br.com.terranova.dto.request.AnotacaoRequest;
import br.com.terranova.dto.response.AnotacaoResponse;
import br.com.terranova.entities.Anotacao;
import br.com.terranova.exceptions.EntidadeNaoEncontradaException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class AnotacaoBO {

    @Inject
    UsuarioBO usuarioBO;

    @Inject
    AnotacaoDAO anotacaoDAO;

    public List<AnotacaoResponse> listarPorUsuario(Long idUsuario) {
        usuarioBO.buscarEntidade(idUsuario);
        return anotacaoDAO.listarPorUsuario(idUsuario).stream().map(this::toResponse).toList();
    }

    public AnotacaoResponse criar(Long idUsuario, AnotacaoRequest request) {
        usuarioBO.buscarEntidade(idUsuario);
        LocalDateTime agora = LocalDateTime.now();
        Anotacao anotacao = new Anotacao();
        anotacao.setIdUsuario(idUsuario);
        anotacao.setTitulo(BoUtils.textoObrigatorio(request.titulo(), "titulo"));
        anotacao.setConteudoHtml(BoUtils.normalizar(request.conteudoHtml()));
        anotacao.setDataCriacao(agora);
        anotacao.setDataAtualizacao(agora);
        return toResponse(anotacaoDAO.inserir(anotacao));
    }

    public AnotacaoResponse atualizar(Long id, AnotacaoRequest request) {
        Anotacao atual = buscarEntidade(id);
        atual.setTitulo(BoUtils.textoObrigatorio(request.titulo(), "titulo"));
        atual.setConteudoHtml(BoUtils.normalizar(request.conteudoHtml()));
        atual.setDataAtualizacao(LocalDateTime.now());
        return toResponse(anotacaoDAO.atualizar(atual));
    }

    public void deletar(Long id) {
        buscarEntidade(id);
        if (!anotacaoDAO.deletar(id)) {
            throw new EntidadeNaoEncontradaException("Anotacao nao encontrada para exclusao.");
        }
    }

    private Anotacao buscarEntidade(Long id) {
        BoUtils.validarId(id, "idAnotacao");
        return BoUtils.obterOuFalhar(anotacaoDAO.buscarPorId(id), "Anotacao", id);
    }

    private AnotacaoResponse toResponse(Anotacao anotacao) {
        return new AnotacaoResponse(
                anotacao.getIdAnotacao(),
                anotacao.getIdUsuario(),
                anotacao.getTitulo(),
                anotacao.getConteudoHtml(),
                anotacao.getDataCriacao(),
                anotacao.getDataAtualizacao()
        );
    }
}
