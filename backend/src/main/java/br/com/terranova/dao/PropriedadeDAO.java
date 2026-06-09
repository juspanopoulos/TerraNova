package br.com.terranova.dao;

import br.com.terranova.connection.ConnectionFactory;
import br.com.terranova.entities.Propriedade;
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
public class PropriedadeDAO implements CrudDAO<Propriedade> {

    @Inject
    ConnectionFactory connectionFactory;

    @Override
    public List<Propriedade> listar() {
        String sql = """
                SELECT id_propriedade, id_empresa, nm_propriedade, ds_localizacao,
                       nr_latitude, nr_longitude, nr_area_total_hectares
                FROM TN_PROPRIEDADE
                ORDER BY id_propriedade
                """;
        List<Propriedade> propriedades = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                propriedades.add(mapear(resultSet));
            }
            return propriedades;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao listar propriedades.", exception);
        }
    }

    @Override
    public Optional<Propriedade> buscarPorId(Long id) {
        String sql = """
                SELECT id_propriedade, id_empresa, nm_propriedade, ds_localizacao,
                       nr_latitude, nr_longitude, nr_area_total_hectares
                FROM TN_PROPRIEDADE
                WHERE id_propriedade = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar propriedade por ID.", exception);
        }
    }

    @Override
    public Propriedade inserir(Propriedade propriedade) {
        String sql = """
                INSERT INTO TN_PROPRIEDADE
                (id_empresa, nm_propriedade, ds_localizacao, nr_latitude, nr_longitude, nr_area_total_hectares)
                VALUES (?, ?, ?, ?, ?, ?)
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, new String[]{"id_propriedade"})) {
            statement.setLong(1, propriedade.getIdEmpresa());
            statement.setString(2, propriedade.getNomePropriedade());
            statement.setString(3, propriedade.getLocalizacao());
            statement.setBigDecimal(4, propriedade.getLatitude());
            statement.setBigDecimal(5, propriedade.getLongitude());
            statement.setBigDecimal(6, propriedade.getAreaTotalHectares());
            statement.executeUpdate();
            propriedade.setIdPropriedade(DaoUtils.generatedId(statement));
            return propriedade;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao inserir propriedade.", exception);
        }
    }

    @Override
    public Propriedade atualizar(Propriedade propriedade) {
        String sql = """
                UPDATE TN_PROPRIEDADE
                SET id_empresa = ?, nm_propriedade = ?, ds_localizacao = ?,
                    nr_latitude = ?, nr_longitude = ?, nr_area_total_hectares = ?
                WHERE id_propriedade = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, propriedade.getIdEmpresa());
            statement.setString(2, propriedade.getNomePropriedade());
            statement.setString(3, propriedade.getLocalizacao());
            statement.setBigDecimal(4, propriedade.getLatitude());
            statement.setBigDecimal(5, propriedade.getLongitude());
            statement.setBigDecimal(6, propriedade.getAreaTotalHectares());
            statement.setLong(7, propriedade.getIdPropriedade());
            statement.executeUpdate();
            return propriedade;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao atualizar propriedade.", exception);
        }
    }

    @Override
    public boolean deletar(Long id) {
        String sql = "DELETE FROM TN_PROPRIEDADE WHERE id_propriedade = ?";
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            return statement.executeUpdate() > 0;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao deletar propriedade.", exception);
        }
    }

    private Propriedade mapear(ResultSet resultSet) throws SQLException {
        Propriedade propriedade = new Propriedade();
        propriedade.setIdPropriedade(resultSet.getLong("id_propriedade"));
        propriedade.setIdEmpresa(resultSet.getLong("id_empresa"));
        propriedade.setNomePropriedade(resultSet.getString("nm_propriedade"));
        propriedade.setLocalizacao(resultSet.getString("ds_localizacao"));
        propriedade.setLatitude(resultSet.getBigDecimal("nr_latitude"));
        propriedade.setLongitude(resultSet.getBigDecimal("nr_longitude"));
        propriedade.setAreaTotalHectares(resultSet.getBigDecimal("nr_area_total_hectares"));
        return propriedade;
    }
}
