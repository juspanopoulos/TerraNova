package br.com.terranova.dao;

import br.com.terranova.connection.ConnectionFactory;
import br.com.terranova.entities.Recomendacao;
import br.com.terranova.enums.StatusRecomendacao;
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
public class RecomendacaoDAO implements CrudDAO<Recomendacao> {

    @Inject
    ConnectionFactory connectionFactory;

    @Override
    public List<Recomendacao> listar() {
        String sql = """
                SELECT id_recomendacao, id_area, id_alerta, dt_recomendacao, ds_acao,
                       nr_volume_agua_sugerido_mm, ds_status
                FROM TN_RECOMENDACAO
                ORDER BY id_recomendacao
                """;
        List<Recomendacao> recomendacoes = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                recomendacoes.add(mapear(resultSet));
            }
            return recomendacoes;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao listar recomendacoes.", exception);
        }
    }

    @Override
    public Optional<Recomendacao> buscarPorId(Long id) {
        String sql = """
                SELECT id_recomendacao, id_area, id_alerta, dt_recomendacao, ds_acao,
                       nr_volume_agua_sugerido_mm, ds_status
                FROM TN_RECOMENDACAO
                WHERE id_recomendacao = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar recomendacao por ID.", exception);
        }
    }

    public List<Recomendacao> buscarPendentes() {
        String sql = """
                SELECT id_recomendacao, id_area, id_alerta, dt_recomendacao, ds_acao,
                       nr_volume_agua_sugerido_mm, ds_status
                FROM TN_RECOMENDACAO
                WHERE ds_status = 'PENDENTE'
                ORDER BY dt_recomendacao DESC
                """;
        List<Recomendacao> recomendacoes = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                recomendacoes.add(mapear(resultSet));
            }
            return recomendacoes;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar recomendacoes pendentes.", exception);
        }
    }

    @Override
    public Recomendacao inserir(Recomendacao recomendacao) {
        String sql = """
                INSERT INTO TN_RECOMENDACAO
                (id_area, id_alerta, dt_recomendacao, ds_acao, nr_volume_agua_sugerido_mm, ds_status)
                VALUES (?, ?, ?, ?, ?, ?)
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, new String[]{"id_recomendacao"})) {
            statement.setLong(1, recomendacao.getIdArea());
            if (recomendacao.getIdAlerta() == null) {
                statement.setObject(2, null);
            } else {
                statement.setLong(2, recomendacao.getIdAlerta());
            }
            DaoUtils.setLocalDateTime(statement, 3, recomendacao.getDataRecomendacao());
            statement.setString(4, recomendacao.getAcao());
            statement.setBigDecimal(5, recomendacao.getVolumeAguaSugeridoMm());
            DaoUtils.setEnum(statement, 6, recomendacao.getStatus());
            statement.executeUpdate();
            recomendacao.setIdRecomendacao(DaoUtils.generatedId(statement));
            return recomendacao;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao inserir recomendacao.", exception);
        }
    }

    @Override
    public Recomendacao atualizar(Recomendacao recomendacao) {
        String sql = """
                UPDATE TN_RECOMENDACAO
                SET id_area = ?, id_alerta = ?, dt_recomendacao = ?, ds_acao = ?,
                    nr_volume_agua_sugerido_mm = ?, ds_status = ?
                WHERE id_recomendacao = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, recomendacao.getIdArea());
            if (recomendacao.getIdAlerta() == null) {
                statement.setObject(2, null);
            } else {
                statement.setLong(2, recomendacao.getIdAlerta());
            }
            DaoUtils.setLocalDateTime(statement, 3, recomendacao.getDataRecomendacao());
            statement.setString(4, recomendacao.getAcao());
            statement.setBigDecimal(5, recomendacao.getVolumeAguaSugeridoMm());
            DaoUtils.setEnum(statement, 6, recomendacao.getStatus());
            statement.setLong(7, recomendacao.getIdRecomendacao());
            statement.executeUpdate();
            return recomendacao;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao atualizar recomendacao.", exception);
        }
    }

    public boolean atualizarStatus(Long id, StatusRecomendacao status) {
        String sql = "UPDATE TN_RECOMENDACAO SET ds_status = ? WHERE id_recomendacao = ?";
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            DaoUtils.setEnum(statement, 1, status);
            statement.setLong(2, id);
            return statement.executeUpdate() > 0;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao atualizar status da recomendacao.", exception);
        }
    }

    @Override
    public boolean deletar(Long id) {
        String sql = "DELETE FROM TN_RECOMENDACAO WHERE id_recomendacao = ?";
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            return statement.executeUpdate() > 0;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao deletar recomendacao.", exception);
        }
    }

    private Recomendacao mapear(ResultSet resultSet) throws SQLException {
        Recomendacao recomendacao = new Recomendacao();
        recomendacao.setIdRecomendacao(resultSet.getLong("id_recomendacao"));
        recomendacao.setIdArea(resultSet.getLong("id_area"));
        Long idAlerta = resultSet.getLong("id_alerta");
        recomendacao.setIdAlerta(resultSet.wasNull() ? null : idAlerta);
        recomendacao.setDataRecomendacao(DaoUtils.getLocalDateTime(resultSet, "dt_recomendacao"));
        recomendacao.setAcao(resultSet.getString("ds_acao"));
        recomendacao.setVolumeAguaSugeridoMm(resultSet.getBigDecimal("nr_volume_agua_sugerido_mm"));
        recomendacao.setStatus(DaoUtils.getEnum(resultSet, "ds_status", StatusRecomendacao.class));
        return recomendacao;
    }
}
