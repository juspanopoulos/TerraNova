package br.com.terranova.dao;

import br.com.terranova.connection.ConnectionFactory;
import br.com.terranova.entities.AreaCultura;
import br.com.terranova.enums.StatusAreaCultura;
import br.com.terranova.exceptions.BancoDadosException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class AreaCulturaDAO implements CrudDAO<AreaCultura> {

    @Inject
    ConnectionFactory connectionFactory;

    @Override
    public List<AreaCultura> listar() {
        String sql = """
                SELECT id_area_cultura, id_area, id_cultura, dt_plantio, dt_colheita_prevista,
                       ds_status, ds_estagio_crescimento
                FROM TN_AREA_CULTURA
                ORDER BY id_area_cultura
                """;
        List<AreaCultura> plantios = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                plantios.add(mapear(resultSet));
            }
            return plantios;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao listar plantios.", exception);
        }
    }

    @Override
    public Optional<AreaCultura> buscarPorId(Long id) {
        String sql = """
                SELECT id_area_cultura, id_area, id_cultura, dt_plantio, dt_colheita_prevista,
                       ds_status, ds_estagio_crescimento
                FROM TN_AREA_CULTURA
                WHERE id_area_cultura = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar plantio por ID.", exception);
        }
    }

    public List<AreaCultura> listarAtivos() {
        String sql = """
                SELECT id_area_cultura, id_area, id_cultura, dt_plantio, dt_colheita_prevista,
                       ds_status, ds_estagio_crescimento
                FROM TN_AREA_CULTURA
                WHERE ds_status = 'ATIVO'
                ORDER BY id_area_cultura
                """;
        List<AreaCultura> plantios = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                plantios.add(mapear(resultSet));
            }
            return plantios;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao listar plantios ativos.", exception);
        }
    }

    @Override
    public AreaCultura inserir(AreaCultura plantio) {
        String sql = """
                INSERT INTO TN_AREA_CULTURA
                (id_area, id_cultura, dt_plantio, dt_colheita_prevista, ds_status, ds_estagio_crescimento)
                VALUES (?, ?, ?, ?, ?, ?)
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setLong(1, plantio.getIdArea());
            statement.setLong(2, plantio.getIdCultura());
            DaoUtils.setLocalDate(statement, 3, plantio.getDataPlantio());
            DaoUtils.setLocalDate(statement, 4, plantio.getDataColheitaPrevista());
            DaoUtils.setEnum(statement, 5, plantio.getStatus());
            statement.setString(6, plantio.getEstagioCrescimento());
            statement.executeUpdate();
            plantio.setIdAreaCultura(DaoUtils.generatedId(statement));
            return plantio;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao inserir plantio.", exception);
        }
    }

    @Override
    public AreaCultura atualizar(AreaCultura plantio) {
        String sql = """
                UPDATE TN_AREA_CULTURA
                SET id_area = ?, id_cultura = ?, dt_plantio = ?, dt_colheita_prevista = ?,
                    ds_status = ?, ds_estagio_crescimento = ?
                WHERE id_area_cultura = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, plantio.getIdArea());
            statement.setLong(2, plantio.getIdCultura());
            DaoUtils.setLocalDate(statement, 3, plantio.getDataPlantio());
            DaoUtils.setLocalDate(statement, 4, plantio.getDataColheitaPrevista());
            DaoUtils.setEnum(statement, 5, plantio.getStatus());
            statement.setString(6, plantio.getEstagioCrescimento());
            statement.setLong(7, plantio.getIdAreaCultura());
            statement.executeUpdate();
            return plantio;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao atualizar plantio.", exception);
        }
    }

    @Override
    public boolean deletar(Long id) {
        String sql = "DELETE FROM TN_AREA_CULTURA WHERE id_area_cultura = ?";
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            return statement.executeUpdate() > 0;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao deletar plantio.", exception);
        }
    }

    private AreaCultura mapear(ResultSet resultSet) throws SQLException {
        AreaCultura plantio = new AreaCultura();
        plantio.setIdAreaCultura(resultSet.getLong("id_area_cultura"));
        plantio.setIdArea(resultSet.getLong("id_area"));
        plantio.setIdCultura(resultSet.getLong("id_cultura"));
        plantio.setDataPlantio(DaoUtils.getLocalDate(resultSet, "dt_plantio"));
        plantio.setDataColheitaPrevista(DaoUtils.getLocalDate(resultSet, "dt_colheita_prevista"));
        plantio.setStatus(DaoUtils.getEnum(resultSet, "ds_status", StatusAreaCultura.class));
        plantio.setEstagioCrescimento(resultSet.getString("ds_estagio_crescimento"));
        return plantio;
    }
}
