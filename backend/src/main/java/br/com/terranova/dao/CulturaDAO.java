package br.com.terranova.dao;

import br.com.terranova.connection.ConnectionFactory;
import br.com.terranova.entities.Cultura;
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
public class CulturaDAO implements CrudDAO<Cultura> {

    @Inject
    ConnectionFactory connectionFactory;

    @Override
    public List<Cultura> listar() {
        String sql = """
                SELECT id_cultura, nm_cultura, ds_cultura, nr_necessidade_hidrica_mm, ds_periodo_plantio
                FROM TN_CULTURA
                ORDER BY id_cultura
                """;
        List<Cultura> culturas = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                culturas.add(mapear(resultSet));
            }
            return culturas;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao listar culturas.", exception);
        }
    }

    @Override
    public Optional<Cultura> buscarPorId(Long id) {
        String sql = """
                SELECT id_cultura, nm_cultura, ds_cultura, nr_necessidade_hidrica_mm, ds_periodo_plantio
                FROM TN_CULTURA
                WHERE id_cultura = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar cultura por ID.", exception);
        }
    }

    @Override
    public Cultura inserir(Cultura cultura) {
        String sql = """
                INSERT INTO TN_CULTURA (nm_cultura, ds_cultura, nr_necessidade_hidrica_mm, ds_periodo_plantio)
                VALUES (?, ?, ?, ?)
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setString(1, cultura.getNomeCultura());
            statement.setString(2, cultura.getDescricao());
            statement.setBigDecimal(3, cultura.getNecessidadeHidricaMm());
            statement.setString(4, cultura.getPeriodoPlantio());
            statement.executeUpdate();
            cultura.setIdCultura(DaoUtils.generatedId(statement));
            return cultura;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao inserir cultura.", exception);
        }
    }

    @Override
    public Cultura atualizar(Cultura cultura) {
        String sql = """
                UPDATE TN_CULTURA
                SET nm_cultura = ?, ds_cultura = ?, nr_necessidade_hidrica_mm = ?, ds_periodo_plantio = ?
                WHERE id_cultura = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, cultura.getNomeCultura());
            statement.setString(2, cultura.getDescricao());
            statement.setBigDecimal(3, cultura.getNecessidadeHidricaMm());
            statement.setString(4, cultura.getPeriodoPlantio());
            statement.setLong(5, cultura.getIdCultura());
            statement.executeUpdate();
            return cultura;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao atualizar cultura.", exception);
        }
    }

    @Override
    public boolean deletar(Long id) {
        String sql = "DELETE FROM TN_CULTURA WHERE id_cultura = ?";
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            return statement.executeUpdate() > 0;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao deletar cultura.", exception);
        }
    }

    private Cultura mapear(ResultSet resultSet) throws SQLException {
        Cultura cultura = new Cultura();
        cultura.setIdCultura(resultSet.getLong("id_cultura"));
        cultura.setNomeCultura(resultSet.getString("nm_cultura"));
        cultura.setDescricao(resultSet.getString("ds_cultura"));
        cultura.setNecessidadeHidricaMm(resultSet.getBigDecimal("nr_necessidade_hidrica_mm"));
        cultura.setPeriodoPlantio(resultSet.getString("ds_periodo_plantio"));
        return cultura;
    }
}
