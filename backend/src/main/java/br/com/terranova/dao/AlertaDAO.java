package br.com.terranova.dao;

import br.com.terranova.connection.ConnectionFactory;
import br.com.terranova.entities.Alerta;
import br.com.terranova.enums.SeveridadeAlerta;
import br.com.terranova.enums.StatusAlerta;
import br.com.terranova.enums.TipoAlerta;
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
public class AlertaDAO implements CrudDAO<Alerta> {

    @Inject
    ConnectionFactory connectionFactory;

    @Override
    public List<Alerta> listar() {
        String sql = """
                SELECT id_alerta, id_area, dt_alerta, ds_tipo_alerta, ds_descricao, ds_severidade, ds_status
                FROM TN_ALERTA
                ORDER BY id_alerta
                """;
        List<Alerta> alertas = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                alertas.add(mapear(resultSet));
            }
            return alertas;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao listar alertas.", exception);
        }
    }

    @Override
    public Optional<Alerta> buscarPorId(Long id) {
        String sql = """
                SELECT id_alerta, id_area, dt_alerta, ds_tipo_alerta, ds_descricao, ds_severidade, ds_status
                FROM TN_ALERTA
                WHERE id_alerta = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar alerta por ID.", exception);
        }
    }

    public List<Alerta> buscarAbertos() {
        String sql = """
                SELECT id_alerta, id_area, dt_alerta, ds_tipo_alerta, ds_descricao, ds_severidade, ds_status
                FROM TN_ALERTA
                WHERE ds_status = 'ABERTO'
                ORDER BY
                    CASE ds_severidade
                        WHEN 'CRITICA' THEN 1
                        WHEN 'ALTA' THEN 2
                        WHEN 'MEDIA' THEN 3
                        WHEN 'BAIXA' THEN 4
                    END,
                    dt_alerta DESC
                """;
        List<Alerta> alertas = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                alertas.add(mapear(resultSet));
            }
            return alertas;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar alertas abertos.", exception);
        }
    }

    @Override
    public Alerta inserir(Alerta alerta) {
        String sql = """
                INSERT INTO TN_ALERTA (id_area, dt_alerta, ds_tipo_alerta, ds_descricao, ds_severidade, ds_status)
                VALUES (?, ?, ?, ?, ?, ?)
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, new String[]{"id_alerta"})) {
            statement.setLong(1, alerta.getIdArea());
            DaoUtils.setLocalDateTime(statement, 2, alerta.getDataAlerta());
            DaoUtils.setEnum(statement, 3, alerta.getTipoAlerta());
            statement.setString(4, alerta.getDescricao());
            DaoUtils.setEnum(statement, 5, alerta.getSeveridade());
            DaoUtils.setEnum(statement, 6, alerta.getStatus());
            statement.executeUpdate();
            alerta.setIdAlerta(DaoUtils.generatedId(statement));
            return alerta;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao inserir alerta.", exception);
        }
    }

    @Override
    public Alerta atualizar(Alerta alerta) {
        String sql = """
                UPDATE TN_ALERTA
                SET id_area = ?, dt_alerta = ?, ds_tipo_alerta = ?, ds_descricao = ?,
                    ds_severidade = ?, ds_status = ?
                WHERE id_alerta = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, alerta.getIdArea());
            DaoUtils.setLocalDateTime(statement, 2, alerta.getDataAlerta());
            DaoUtils.setEnum(statement, 3, alerta.getTipoAlerta());
            statement.setString(4, alerta.getDescricao());
            DaoUtils.setEnum(statement, 5, alerta.getSeveridade());
            DaoUtils.setEnum(statement, 6, alerta.getStatus());
            statement.setLong(7, alerta.getIdAlerta());
            statement.executeUpdate();
            return alerta;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao atualizar alerta.", exception);
        }
    }

    public boolean resolver(Long id) {
        String sql = "UPDATE TN_ALERTA SET ds_status = 'RESOLVIDO' WHERE id_alerta = ?";
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            return statement.executeUpdate() > 0;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao resolver alerta.", exception);
        }
    }

    @Override
    public boolean deletar(Long id) {
        String sql = "DELETE FROM TN_ALERTA WHERE id_alerta = ?";
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            return statement.executeUpdate() > 0;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao deletar alerta.", exception);
        }
    }

    private Alerta mapear(ResultSet resultSet) throws SQLException {
        Alerta alerta = new Alerta();
        alerta.setIdAlerta(resultSet.getLong("id_alerta"));
        alerta.setIdArea(resultSet.getLong("id_area"));
        alerta.setDataAlerta(DaoUtils.getLocalDateTime(resultSet, "dt_alerta"));
        alerta.setTipoAlerta(DaoUtils.getEnum(resultSet, "ds_tipo_alerta", TipoAlerta.class));
        alerta.setDescricao(resultSet.getString("ds_descricao"));
        alerta.setSeveridade(DaoUtils.getEnum(resultSet, "ds_severidade", SeveridadeAlerta.class));
        alerta.setStatus(DaoUtils.getEnum(resultSet, "ds_status", StatusAlerta.class));
        return alerta;
    }
}
