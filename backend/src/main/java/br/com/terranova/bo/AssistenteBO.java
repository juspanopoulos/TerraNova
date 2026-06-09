package br.com.terranova.bo;

import br.com.terranova.dao.AssistenteDAO;
import br.com.terranova.dto.integration.ia.ChatIaRequest;
import br.com.terranova.dto.integration.ia.ChatIaResponse;
import br.com.terranova.dto.request.AssistenteChatPersistidoRequest;
import br.com.terranova.dto.request.AssistenteConversaRequest;
import br.com.terranova.dto.response.AssistenteConversaResponse;
import br.com.terranova.dto.response.AssistenteMensagemResponse;
import br.com.terranova.entities.AssistenteConversa;
import br.com.terranova.entities.AssistenteMensagem;
import br.com.terranova.exceptions.EntidadeNaoEncontradaException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class AssistenteBO {

    @Inject
    UsuarioBO usuarioBO;

    @Inject
    IaBO iaBO;

    @Inject
    AssistenteDAO assistenteDAO;

    public List<AssistenteConversaResponse> listarConversas(Long idUsuario) {
        usuarioBO.buscarEntidade(idUsuario);
        return assistenteDAO.listarConversasPorUsuario(idUsuario).stream().map(this::toResponse).toList();
    }

    public AssistenteConversaResponse criarConversa(Long idUsuario, AssistenteConversaRequest request) {
        usuarioBO.buscarEntidade(idUsuario);
        LocalDateTime agora = LocalDateTime.now();
        AssistenteConversa conversa = new AssistenteConversa();
        conversa.setIdUsuario(idUsuario);
        conversa.setTitulo(tituloOuPadrao(request == null ? null : request.titulo()));
        conversa.setDataCriacao(agora);
        conversa.setDataAtualizacao(agora);
        return toResponse(assistenteDAO.inserirConversa(conversa));
    }

    public AssistenteConversaResponse conversar(Long idConversa, AssistenteChatPersistidoRequest request) {
        AssistenteConversa conversa = buscarConversa(idConversa);
        String pergunta = BoUtils.textoObrigatorio(request.pergunta(), "pergunta");
        LocalDateTime agora = LocalDateTime.now();

        salvarMensagem(idConversa, "user", pergunta, agora);
        ChatIaResponse resposta = iaBO.conversar(new ChatIaRequest(pergunta, request.contexto()));
        salvarMensagem(idConversa, "assistant", resposta.resposta(), LocalDateTime.now());

        if (assistenteDAO.listarMensagens(idConversa).size() <= 2) {
            conversa.setTitulo(tituloDaPergunta(pergunta));
        }
        conversa.setDataAtualizacao(LocalDateTime.now());
        assistenteDAO.atualizarConversa(conversa);
        return toResponse(conversa);
    }

    public void deletarConversa(Long idConversa) {
        buscarConversa(idConversa);
        if (!assistenteDAO.deletarConversa(idConversa)) {
            throw new EntidadeNaoEncontradaException("Conversa do assistente nao encontrada para exclusao.");
        }
    }

    private void salvarMensagem(Long idConversa, String papel, String conteudo, LocalDateTime data) {
        AssistenteMensagem mensagem = new AssistenteMensagem();
        mensagem.setIdConversa(idConversa);
        mensagem.setPapel(papel);
        mensagem.setConteudo(conteudo);
        mensagem.setDataMensagem(data);
        assistenteDAO.inserirMensagem(mensagem);
    }

    private AssistenteConversa buscarConversa(Long idConversa) {
        BoUtils.validarId(idConversa, "idConversa");
        return assistenteDAO.buscarConversa(idConversa)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Conversa do assistente nao encontrada."));
    }

    private String tituloOuPadrao(String titulo) {
        String normalizado = BoUtils.normalizar(titulo);
        return normalizado == null ? "Nova conversa" : normalizado;
    }

    private String tituloDaPergunta(String pergunta) {
        return pergunta.length() <= 42 ? pergunta : pergunta.substring(0, 42) + "...";
    }

    private AssistenteConversaResponse toResponse(AssistenteConversa conversa) {
        return new AssistenteConversaResponse(
                conversa.getIdConversa(),
                conversa.getIdUsuario(),
                conversa.getTitulo(),
                conversa.getDataCriacao(),
                conversa.getDataAtualizacao(),
                assistenteDAO.listarMensagens(conversa.getIdConversa()).stream().map(this::toMensagemResponse).toList()
        );
    }

    private AssistenteMensagemResponse toMensagemResponse(AssistenteMensagem mensagem) {
        return new AssistenteMensagemResponse(
                mensagem.getIdMensagem(),
                mensagem.getIdConversa(),
                mensagem.getPapel(),
                mensagem.getConteudo(),
                mensagem.getDataMensagem()
        );
    }
}
