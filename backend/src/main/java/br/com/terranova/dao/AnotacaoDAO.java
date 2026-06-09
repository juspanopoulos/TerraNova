package br.com.terranova.dao;

import br.com.terranova.connection.ConnectionFactory;
import br.com.terranova.entities.Anotacao;
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
public class AnotacaoDAO {

    @Inject
    ConnectionFactory connectionFactory;

    public List<Anotacao> listarPorUsuario(Long idUsuario) {
        String sql = """
                SELECT id_anotacao, id_usuario, ds_titulo, ds_conteudo_html, dt_criacao, dt_atualizacao
                FROM TN_ANOTACAO
                WHERE id_usuario = ?
                ORDER BY dt_atualizacao DESC, id_anotacao DESC
                """;
        List<Anotacao> anotacoes = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, idUsuario);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    anotacoes.add(mapear(resultSet));
                }
            }
            return anotacoes;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao listar anotacoes.", exception);
        }
    }

    public Optional<Anotacao> buscarPorId(Long id) {
        String sql = """
                SELECT id_anotacao, id_usuario, ds_titulo, ds_conteudo_html, dt_criacao, dt_atualizacao
                FROM TN_ANOTACAO
                WHERE id_anotacao = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar anotacao.", exception);
        }
    }

    public Anotacao inserir(Anotacao anotacao) {
        String sql = """
                INSERT INTO TN_ANOTACAO (id_usuario, ds_titulo, ds_conteudo_html, dt_criacao, dt_atualizacao)
                VALUES (?, ?, ?, ?, ?)
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, new String[]{"id_anotacao"})) {
            statement.setLong(1, anotacao.getIdUsuario());
            statement.setString(2, anotacao.getTitulo());
            statement.setString(3, anotacao.getConteudoHtml());
            DaoUtils.setLocalDateTime(statement, 4, anotacao.getDataCriacao());
            DaoUtils.setLocalDateTime(statement, 5, anotacao.getDataAtualizacao());
            statement.executeUpdate();
            anotacao.setIdAnotacao(DaoUtils.generatedId(statement));
            return anotacao;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao inserir anotacao.", exception);
        }
    }

    public Anotacao atualizar(Anotacao anotacao) {
        String sql = """
                UPDATE TN_ANOTACAO
                SET ds_titulo = ?, ds_conteudo_html = ?, dt_atualizacao = ?
                WHERE id_anotacao = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, anotacao.getTitulo());
            statement.setString(2, anotacao.getConteudoHtml());
            DaoUtils.setLocalDateTime(statement, 3, anotacao.getDataAtualizacao());
            statement.setLong(4, anotacao.getIdAnotacao());
            statement.executeUpdate();
            return anotacao;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao atualizar anotacao.", exception);
        }
    }

    public boolean deletar(Long id) {
        String sql = "DELETE FROM TN_ANOTACAO WHERE id_anotacao = ?";
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            return statement.executeUpdate() > 0;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao deletar anotacao.", exception);
        }
    }

    private Anotacao mapear(ResultSet resultSet) throws SQLException {
        Anotacao anotacao = new Anotacao();
        anotacao.setIdAnotacao(resultSet.getLong("id_anotacao"));
        anotacao.setIdUsuario(resultSet.getLong("id_usuario"));
        anotacao.setTitulo(resultSet.getString("ds_titulo"));
        anotacao.setConteudoHtml(resultSet.getString("ds_conteudo_html"));
        anotacao.setDataCriacao(DaoUtils.getLocalDateTime(resultSet, "dt_criacao"));
        anotacao.setDataAtualizacao(DaoUtils.getLocalDateTime(resultSet, "dt_atualizacao"));
        return anotacao;
    }
}
