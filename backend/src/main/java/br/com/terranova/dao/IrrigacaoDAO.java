package br.com.terranova.dao;

import br.com.terranova.connection.ConnectionFactory;
import br.com.terranova.entities.Irrigacao;
import br.com.terranova.enums.OrigemRegistro;
import br.com.terranova.enums.SimNao;
import br.com.terranova.enums.TipoIrrigacao;
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
public class IrrigacaoDAO implements CrudDAO<Irrigacao> {

    @Inject
    ConnectionFactory connectionFactory;

    @Override
    public List<Irrigacao> listar() {
        String sql = """
                SELECT id_irrigacao, id_area, dt_registro, ds_tipo_irrigacao, nr_irrigacao_anterior_mm,
                       nr_consumo_atual_mm, nr_area_campo_hectare, ds_usou_cobertura_solo, ds_origem
                FROM TN_IRRIGACAO
                ORDER BY id_irrigacao
                """;
        List<Irrigacao> irrigacoes = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                irrigacoes.add(mapear(resultSet));
            }
            return irrigacoes;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao listar irrigacoes.", exception);
        }
    }

    @Override
    public Optional<Irrigacao> buscarPorId(Long id) {
        String sql = """
                SELECT id_irrigacao, id_area, dt_registro, ds_tipo_irrigacao, nr_irrigacao_anterior_mm,
                       nr_consumo_atual_mm, nr_area_campo_hectare, ds_usou_cobertura_solo, ds_origem
                FROM TN_IRRIGACAO
                WHERE id_irrigacao = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar irrigacao por ID.", exception);
        }
    }

    public List<Irrigacao> buscarHistoricoPorArea(Long idArea) {
        String sql = """
                SELECT id_irrigacao, id_area, dt_registro, ds_tipo_irrigacao, nr_irrigacao_anterior_mm,
                       nr_consumo_atual_mm, nr_area_campo_hectare, ds_usou_cobertura_solo, ds_origem
                FROM TN_IRRIGACAO
                WHERE id_area = ?
                ORDER BY dt_registro DESC
                """;
        List<Irrigacao> irrigacoes = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, idArea);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    irrigacoes.add(mapear(resultSet));
                }
            }
            return irrigacoes;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar historico de irrigacao por area.", exception);
        }
    }

    @Override
    public Irrigacao inserir(Irrigacao irrigacao) {
        String sql = """
                INSERT INTO TN_IRRIGACAO
                (id_area, dt_registro, ds_tipo_irrigacao, nr_irrigacao_anterior_mm, nr_consumo_atual_mm,
                 nr_area_campo_hectare, ds_usou_cobertura_solo, ds_origem)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, new String[]{"id_irrigacao"})) {
            statement.setLong(1, irrigacao.getIdArea());
            DaoUtils.setLocalDateTime(statement, 2, irrigacao.getDataRegistro());
            DaoUtils.setEnum(statement, 3, irrigacao.getTipoIrrigacao());
            statement.setBigDecimal(4, irrigacao.getIrrigacaoAnteriorMm());
            statement.setBigDecimal(5, irrigacao.getConsumoAtualMm());
            statement.setBigDecimal(6, irrigacao.getAreaCampoHectare());
            DaoUtils.setEnum(statement, 7, irrigacao.getUsouCoberturaSolo());
            DaoUtils.setEnum(statement, 8, irrigacao.getOrigem());
            statement.executeUpdate();
            irrigacao.setIdIrrigacao(DaoUtils.generatedId(statement));
            return irrigacao;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao inserir irrigacao.", exception);
        }
    }

    @Override
    public Irrigacao atualizar(Irrigacao irrigacao) {
        String sql = """
                UPDATE TN_IRRIGACAO
                SET id_area = ?, dt_registro = ?, ds_tipo_irrigacao = ?, nr_irrigacao_anterior_mm = ?,
                    nr_consumo_atual_mm = ?, nr_area_campo_hectare = ?, ds_usou_cobertura_solo = ?, ds_origem = ?
                WHERE id_irrigacao = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, irrigacao.getIdArea());
            DaoUtils.setLocalDateTime(statement, 2, irrigacao.getDataRegistro());
            DaoUtils.setEnum(statement, 3, irrigacao.getTipoIrrigacao());
            statement.setBigDecimal(4, irrigacao.getIrrigacaoAnteriorMm());
            statement.setBigDecimal(5, irrigacao.getConsumoAtualMm());
            statement.setBigDecimal(6, irrigacao.getAreaCampoHectare());
            DaoUtils.setEnum(statement, 7, irrigacao.getUsouCoberturaSolo());
            DaoUtils.setEnum(statement, 8, irrigacao.getOrigem());
            statement.setLong(9, irrigacao.getIdIrrigacao());
            statement.executeUpdate();
            return irrigacao;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao atualizar irrigacao.", exception);
        }
    }

    @Override
    public boolean deletar(Long id) {
        String sql = "DELETE FROM TN_IRRIGACAO WHERE id_irrigacao = ?";
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            return statement.executeUpdate() > 0;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao deletar irrigacao.", exception);
        }
    }

    private Irrigacao mapear(ResultSet resultSet) throws SQLException {
        Irrigacao irrigacao = new Irrigacao();
        irrigacao.setIdIrrigacao(resultSet.getLong("id_irrigacao"));
        irrigacao.setIdArea(resultSet.getLong("id_area"));
        irrigacao.setDataRegistro(DaoUtils.getLocalDateTime(resultSet, "dt_registro"));
        irrigacao.setTipoIrrigacao(DaoUtils.getEnum(resultSet, "ds_tipo_irrigacao", TipoIrrigacao.class));
        irrigacao.setIrrigacaoAnteriorMm(resultSet.getBigDecimal("nr_irrigacao_anterior_mm"));
        irrigacao.setConsumoAtualMm(resultSet.getBigDecimal("nr_consumo_atual_mm"));
        irrigacao.setAreaCampoHectare(resultSet.getBigDecimal("nr_area_campo_hectare"));
        irrigacao.setUsouCoberturaSolo(DaoUtils.getEnum(resultSet, "ds_usou_cobertura_solo", SimNao.class));
        irrigacao.setOrigem(DaoUtils.getEnum(resultSet, "ds_origem", OrigemRegistro.class));
        return irrigacao;
    }
}
