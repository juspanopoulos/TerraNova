package br.com.terranova.dao;

import br.com.terranova.connection.ConnectionFactory;
import br.com.terranova.entities.AreaMonitorada;
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
public class AreaMonitoradaDAO implements CrudDAO<AreaMonitorada> {

    @Inject
    ConnectionFactory connectionFactory;

    @Override
    public List<AreaMonitorada> listar() {
        String sql = """
                SELECT id_area, id_propriedade, nm_area, nr_area_hectares, ds_tipo_solo
                FROM TN_AREA_MONITORADA
                ORDER BY id_area
                """;
        List<AreaMonitorada> areas = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                areas.add(mapear(resultSet));
            }
            return areas;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao listar areas monitoradas.", exception);
        }
    }

    @Override
    public Optional<AreaMonitorada> buscarPorId(Long id) {
        String sql = """
                SELECT id_area, id_propriedade, nm_area, nr_area_hectares, ds_tipo_solo
                FROM TN_AREA_MONITORADA
                WHERE id_area = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar area monitorada por ID.", exception);
        }
    }

    @Override
    public AreaMonitorada inserir(AreaMonitorada area) {
        String sql = """
                INSERT INTO TN_AREA_MONITORADA (id_propriedade, nm_area, nr_area_hectares, ds_tipo_solo)
                VALUES (?, ?, ?, ?)
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, new String[]{"id_area"})) {
            statement.setLong(1, area.getIdPropriedade());
            statement.setString(2, area.getNomeArea());
            statement.setBigDecimal(3, area.getAreaHectares());
            statement.setString(4, area.getTipoSolo());
            statement.executeUpdate();
            area.setIdArea(DaoUtils.generatedId(statement));
            return area;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao inserir area monitorada.", exception);
        }
    }

    @Override
    public AreaMonitorada atualizar(AreaMonitorada area) {
        String sql = """
                UPDATE TN_AREA_MONITORADA
                SET id_propriedade = ?, nm_area = ?, nr_area_hectares = ?, ds_tipo_solo = ?
                WHERE id_area = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, area.getIdPropriedade());
            statement.setString(2, area.getNomeArea());
            statement.setBigDecimal(3, area.getAreaHectares());
            statement.setString(4, area.getTipoSolo());
            statement.setLong(5, area.getIdArea());
            statement.executeUpdate();
            return area;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao atualizar area monitorada.", exception);
        }
    }

    @Override
    public boolean deletar(Long id) {
        String sql = "DELETE FROM TN_AREA_MONITORADA WHERE id_area = ?";
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            return statement.executeUpdate() > 0;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao deletar area monitorada.", exception);
        }
    }

    private AreaMonitorada mapear(ResultSet resultSet) throws SQLException {
        AreaMonitorada area = new AreaMonitorada();
        area.setIdArea(resultSet.getLong("id_area"));
        area.setIdPropriedade(resultSet.getLong("id_propriedade"));
        area.setNomeArea(resultSet.getString("nm_area"));
        area.setAreaHectares(resultSet.getBigDecimal("nr_area_hectares"));
        area.setTipoSolo(resultSet.getString("ds_tipo_solo"));
        return area;
    }
}
