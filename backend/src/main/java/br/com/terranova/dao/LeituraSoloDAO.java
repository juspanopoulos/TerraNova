package br.com.terranova.dao;

import br.com.terranova.connection.ConnectionFactory;
import br.com.terranova.entities.LeituraSolo;
import br.com.terranova.enums.FonteSolo;
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
public class LeituraSoloDAO implements CrudDAO<LeituraSolo> {

    @Inject
    ConnectionFactory connectionFactory;

    @Override
    public List<LeituraSolo> listar() {
        String sql = """
                SELECT id_leitura_solo, id_area, dt_coleta, nr_umidade_solo, ds_tipo_solo, ds_fonte
                FROM TN_LEITURA_SOLO
                ORDER BY id_leitura_solo
                """;
        List<LeituraSolo> leituras = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                leituras.add(mapear(resultSet));
            }
            return leituras;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao listar leituras de solo.", exception);
        }
    }

    @Override
    public Optional<LeituraSolo> buscarPorId(Long id) {
        String sql = """
                SELECT id_leitura_solo, id_area, dt_coleta, nr_umidade_solo, ds_tipo_solo, ds_fonte
                FROM TN_LEITURA_SOLO
                WHERE id_leitura_solo = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar leitura de solo por ID.", exception);
        }
    }

    public Optional<LeituraSolo> buscarUltimaPorArea(Long idArea) {
        String sql = """
                SELECT id_leitura_solo, id_area, dt_coleta, nr_umidade_solo, ds_tipo_solo, ds_fonte
                FROM TN_LEITURA_SOLO
                WHERE id_area = ?
                ORDER BY dt_coleta DESC
                FETCH FIRST 1 ROWS ONLY
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, idArea);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar ultima leitura de solo por area.", exception);
        }
    }

    public List<LeituraSolo> buscarHistoricoPorArea(Long idArea) {
        String sql = """
                SELECT id_leitura_solo, id_area, dt_coleta, nr_umidade_solo, ds_tipo_solo, ds_fonte
                FROM TN_LEITURA_SOLO
                WHERE id_area = ?
                ORDER BY dt_coleta DESC
                """;
        List<LeituraSolo> leituras = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, idArea);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    leituras.add(mapear(resultSet));
                }
            }
            return leituras;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar historico de solo por area.", exception);
        }
    }

    @Override
    public LeituraSolo inserir(LeituraSolo leitura) {
        String sql = """
                INSERT INTO TN_LEITURA_SOLO (id_area, dt_coleta, nr_umidade_solo, ds_tipo_solo, ds_fonte)
                VALUES (?, ?, ?, ?, ?)
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, new String[]{"id_leitura_solo"})) {
            statement.setLong(1, leitura.getIdArea());
            DaoUtils.setLocalDateTime(statement, 2, leitura.getDataColeta());
            statement.setBigDecimal(3, leitura.getUmidadeSolo());
            statement.setString(4, leitura.getTipoSolo());
            DaoUtils.setEnum(statement, 5, leitura.getFonte());
            statement.executeUpdate();
            leitura.setIdLeituraSolo(DaoUtils.generatedId(statement));
            return leitura;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao inserir leitura de solo.", exception);
        }
    }

    @Override
    public LeituraSolo atualizar(LeituraSolo leitura) {
        String sql = """
                UPDATE TN_LEITURA_SOLO
                SET id_area = ?, dt_coleta = ?, nr_umidade_solo = ?, ds_tipo_solo = ?, ds_fonte = ?
                WHERE id_leitura_solo = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, leitura.getIdArea());
            DaoUtils.setLocalDateTime(statement, 2, leitura.getDataColeta());
            statement.setBigDecimal(3, leitura.getUmidadeSolo());
            statement.setString(4, leitura.getTipoSolo());
            DaoUtils.setEnum(statement, 5, leitura.getFonte());
            statement.setLong(6, leitura.getIdLeituraSolo());
            statement.executeUpdate();
            return leitura;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao atualizar leitura de solo.", exception);
        }
    }

    @Override
    public boolean deletar(Long id) {
        String sql = "DELETE FROM TN_LEITURA_SOLO WHERE id_leitura_solo = ?";
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            return statement.executeUpdate() > 0;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao deletar leitura de solo.", exception);
        }
    }

    private LeituraSolo mapear(ResultSet resultSet) throws SQLException {
        LeituraSolo leitura = new LeituraSolo();
        leitura.setIdLeituraSolo(resultSet.getLong("id_leitura_solo"));
        leitura.setIdArea(resultSet.getLong("id_area"));
        leitura.setDataColeta(DaoUtils.getLocalDateTime(resultSet, "dt_coleta"));
        leitura.setUmidadeSolo(resultSet.getBigDecimal("nr_umidade_solo"));
        leitura.setTipoSolo(resultSet.getString("ds_tipo_solo"));
        leitura.setFonte(DaoUtils.getEnum(resultSet, "ds_fonte", FonteSolo.class));
        return leitura;
    }
}
