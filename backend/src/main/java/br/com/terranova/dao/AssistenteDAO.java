package br.com.terranova.dao;

import br.com.terranova.connection.ConnectionFactory;
import br.com.terranova.entities.AssistenteConversa;
import br.com.terranova.entities.AssistenteMensagem;
import br.com.terranova.exceptions.BancoDadosException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class AssistenteDAO {

    @Inject
    ConnectionFactory connectionFactory;

    public List<AssistenteConversa> listarConversasPorUsuario(Long idUsuario) {
        String sql = """
                SELECT id_conversa, id_usuario, ds_titulo, dt_criacao, dt_atualizacao
                FROM TN_ASSISTENTE_CONVERSA
                WHERE id_usuario = ?
                ORDER BY dt_atualizacao DESC, id_conversa DESC
                """;
        List<AssistenteConversa> conversas = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, idUsuario);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    conversas.add(mapearConversa(resultSet));
                }
            }
            return conversas;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao listar conversas do assistente.", exception);
        }
    }

    public Optional<AssistenteConversa> buscarConversa(Long idConversa) {
        String sql = """
                SELECT id_conversa, id_usuario, ds_titulo, dt_criacao, dt_atualizacao
                FROM TN_ASSISTENTE_CONVERSA
                WHERE id_conversa = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, idConversa);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapearConversa(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar conversa do assistente.", exception);
        }
    }

    public AssistenteConversa inserirConversa(AssistenteConversa conversa) {
        String sql = """
                INSERT INTO TN_ASSISTENTE_CONVERSA (id_usuario, ds_titulo, dt_criacao, dt_atualizacao)
                VALUES (?, ?, ?, ?)
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, new String[]{"id_conversa"})) {
            statement.setLong(1, conversa.getIdUsuario());
            statement.setString(2, conversa.getTitulo());
            DaoUtils.setLocalDateTime(statement, 3, conversa.getDataCriacao());
            DaoUtils.setLocalDateTime(statement, 4, conversa.getDataAtualizacao());
            statement.executeUpdate();
            conversa.setIdConversa(DaoUtils.generatedId(statement));
            return conversa;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao criar conversa do assistente.", exception);
        }
    }

    public void atualizarConversa(AssistenteConversa conversa) {
        String sql = """
                UPDATE TN_ASSISTENTE_CONVERSA
                SET ds_titulo = ?, dt_atualizacao = ?
                WHERE id_conversa = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, conversa.getTitulo());
            DaoUtils.setLocalDateTime(statement, 2, conversa.getDataAtualizacao());
            statement.setLong(3, conversa.getIdConversa());
            statement.executeUpdate();
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao atualizar conversa do assistente.", exception);
        }
    }

    public boolean deletarConversa(Long idConversa) {
        String deleteMensagens = "DELETE FROM TN_ASSISTENTE_MENSAGEM WHERE id_conversa = ?";
        String deleteConversa = "DELETE FROM TN_ASSISTENTE_CONVERSA WHERE id_conversa = ?";
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement mensagensStatement = connection.prepareStatement(deleteMensagens);
             PreparedStatement conversaStatement = connection.prepareStatement(deleteConversa)) {
            mensagensStatement.setLong(1, idConversa);
            mensagensStatement.executeUpdate();
            conversaStatement.setLong(1, idConversa);
            return conversaStatement.executeUpdate() > 0;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao deletar conversa do assistente.", exception);
        }
    }

    public List<AssistenteMensagem> listarMensagens(Long idConversa) {
        String sql = """
                SELECT id_mensagem, id_conversa, ds_papel, ds_conteudo, dt_mensagem
                FROM TN_ASSISTENTE_MENSAGEM
                WHERE id_conversa = ?
                ORDER BY dt_mensagem, id_mensagem
                """;
        List<AssistenteMensagem> mensagens = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, idConversa);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    mensagens.add(mapearMensagem(resultSet));
                }
            }
            return mensagens;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao listar mensagens do assistente.", exception);
        }
    }

    public AssistenteMensagem inserirMensagem(AssistenteMensagem mensagem) {
        String sql = """
                INSERT INTO TN_ASSISTENTE_MENSAGEM (id_conversa, ds_papel, ds_conteudo, dt_mensagem)
                VALUES (?, ?, ?, ?)
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, new String[]{"id_mensagem"})) {
            statement.setLong(1, mensagem.getIdConversa());
            statement.setString(2, mensagem.getPapel());
            statement.setString(3, mensagem.getConteudo());
            DaoUtils.setLocalDateTime(statement, 4, mensagem.getDataMensagem());
            statement.executeUpdate();
            mensagem.setIdMensagem(DaoUtils.generatedId(statement));
            return mensagem;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao salvar mensagem do assistente.", exception);
        }
    }

    private AssistenteConversa mapearConversa(ResultSet resultSet) throws SQLException {
        AssistenteConversa conversa = new AssistenteConversa();
        conversa.setIdConversa(resultSet.getLong("id_conversa"));
        conversa.setIdUsuario(resultSet.getLong("id_usuario"));
        conversa.setTitulo(resultSet.getString("ds_titulo"));
        conversa.setDataCriacao(DaoUtils.getLocalDateTime(resultSet, "dt_criacao"));
        conversa.setDataAtualizacao(DaoUtils.getLocalDateTime(resultSet, "dt_atualizacao"));
        return conversa;
    }

    private AssistenteMensagem mapearMensagem(ResultSet resultSet) throws SQLException {
        AssistenteMensagem mensagem = new AssistenteMensagem();
        mensagem.setIdMensagem(resultSet.getLong("id_mensagem"));
        mensagem.setIdConversa(resultSet.getLong("id_conversa"));
        mensagem.setPapel(resultSet.getString("ds_papel"));
        mensagem.setConteudo(resultSet.getString("ds_conteudo"));
        mensagem.setDataMensagem(DaoUtils.getLocalDateTime(resultSet, "dt_mensagem"));
        return mensagem;
    }
}
