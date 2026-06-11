package br.com.terranova.dao;

import br.com.terranova.connection.ConnectionFactory;
import br.com.terranova.entities.DadoClimatico;
import br.com.terranova.enums.FonteApi;
import br.com.terranova.exceptions.BancoDadosException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class DadoClimaticoDAO implements CrudDAO<DadoClimatico> {

    @Inject
    ConnectionFactory connectionFactory;

    @Override
    public List<DadoClimatico> listar() {
        String sql = """
                SELECT id_dado, id_area, dt_coleta, dt_referencia, nr_temperatura, nr_umidade,
                       nr_precipitacao, nr_indice_uv, nr_velocidade_vento_kmh, nr_radiacao_solar, ds_fonte_api
                FROM TN_DADO_CLIMATICO
                ORDER BY id_dado
                """;
        List<DadoClimatico> dados = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                dados.add(mapear(resultSet));
            }
            return dados;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao listar dados climaticos.", exception);
        }
    }

    @Override
    public Optional<DadoClimatico> buscarPorId(Long id) {
        String sql = """
                SELECT id_dado, id_area, dt_coleta, dt_referencia, nr_temperatura, nr_umidade,
                       nr_precipitacao, nr_indice_uv, nr_velocidade_vento_kmh, nr_radiacao_solar, ds_fonte_api
                FROM TN_DADO_CLIMATICO
                WHERE id_dado = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar dado climatico por ID.", exception);
        }
    }

    public List<DadoClimatico> buscarHistoricoPorArea(Long idArea) {
        String sql = """
                SELECT id_dado, id_area, dt_coleta, dt_referencia, nr_temperatura, nr_umidade,
                       nr_precipitacao, nr_indice_uv, nr_velocidade_vento_kmh, nr_radiacao_solar, ds_fonte_api
                FROM TN_DADO_CLIMATICO
                WHERE id_area = ?
                ORDER BY dt_coleta DESC
                """;
        List<DadoClimatico> dados = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, idArea);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    dados.add(mapear(resultSet));
                }
            }
            return dados;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar historico climatico por area.", exception);
        }
    }

    public Optional<DadoClimatico> buscarPorAreaDataReferenciaFonte(
            Long idArea,
            LocalDate dataReferencia,
            FonteApi fonteApi
    ) {
        String sql = """
                SELECT id_dado, id_area, dt_coleta, dt_referencia, nr_temperatura, nr_umidade,
                       nr_precipitacao, nr_indice_uv, nr_velocidade_vento_kmh, nr_radiacao_solar, ds_fonte_api
                FROM TN_DADO_CLIMATICO
                WHERE id_area = ?
                  AND dt_referencia = ?
                  AND ds_fonte_api = ?
                ORDER BY dt_coleta DESC
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, idArea);
            DaoUtils.setLocalDate(statement, 2, dataReferencia);
            DaoUtils.setEnum(statement, 3, fonteApi);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar dado climatico por area, data e fonte.", exception);
        }
    }

    @Override
    public DadoClimatico inserir(DadoClimatico dado) {
        String sql = """
                INSERT INTO TN_DADO_CLIMATICO
                (id_area, dt_coleta, dt_referencia, nr_temperatura, nr_umidade, nr_precipitacao,
                 nr_indice_uv, nr_velocidade_vento_kmh, nr_radiacao_solar, ds_fonte_api)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, new String[]{"id_dado"})) {
            statement.setLong(1, dado.getIdArea());
            DaoUtils.setLocalDateTime(statement, 2, dado.getDataColeta());
            DaoUtils.setLocalDate(statement, 3, dado.getDataReferencia());
            statement.setBigDecimal(4, dado.getTemperatura());
            statement.setBigDecimal(5, dado.getUmidade());
            statement.setBigDecimal(6, dado.getPrecipitacao());
            statement.setBigDecimal(7, dado.getIndiceUv());
            statement.setBigDecimal(8, dado.getVelocidadeVentoKmh());
            statement.setBigDecimal(9, dado.getRadiacaoSolar());
            DaoUtils.setEnum(statement, 10, dado.getFonteApi());
            statement.executeUpdate();
            dado.setIdDado(DaoUtils.generatedId(statement));
            return dado;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao inserir dado climatico.", exception);
        }
    }

    @Override
    public DadoClimatico atualizar(DadoClimatico dado) {
        String sql = """
                UPDATE TN_DADO_CLIMATICO
                SET id_area = ?, dt_coleta = ?, dt_referencia = ?, nr_temperatura = ?, nr_umidade = ?,
                    nr_precipitacao = ?, nr_indice_uv = ?, nr_velocidade_vento_kmh = ?,
                    nr_radiacao_solar = ?, ds_fonte_api = ?
                WHERE id_dado = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, dado.getIdArea());
            DaoUtils.setLocalDateTime(statement, 2, dado.getDataColeta());
            DaoUtils.setLocalDate(statement, 3, dado.getDataReferencia());
            statement.setBigDecimal(4, dado.getTemperatura());
            statement.setBigDecimal(5, dado.getUmidade());
            statement.setBigDecimal(6, dado.getPrecipitacao());
            statement.setBigDecimal(7, dado.getIndiceUv());
            statement.setBigDecimal(8, dado.getVelocidadeVentoKmh());
            statement.setBigDecimal(9, dado.getRadiacaoSolar());
            DaoUtils.setEnum(statement, 10, dado.getFonteApi());
            statement.setLong(11, dado.getIdDado());
            statement.executeUpdate();
            return dado;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao atualizar dado climatico.", exception);
        }
    }

    @Override
    public boolean deletar(Long id) {
        String sql = "DELETE FROM TN_DADO_CLIMATICO WHERE id_dado = ?";
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            return statement.executeUpdate() > 0;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao deletar dado climatico.", exception);
        }
    }

    private DadoClimatico mapear(ResultSet resultSet) throws SQLException {
        DadoClimatico dado = new DadoClimatico();
        dado.setIdDado(resultSet.getLong("id_dado"));
        dado.setIdArea(resultSet.getLong("id_area"));
        dado.setDataColeta(DaoUtils.getLocalDateTime(resultSet, "dt_coleta"));
        dado.setDataReferencia(DaoUtils.getLocalDate(resultSet, "dt_referencia"));
        dado.setTemperatura(resultSet.getBigDecimal("nr_temperatura"));
        dado.setUmidade(resultSet.getBigDecimal("nr_umidade"));
        dado.setPrecipitacao(resultSet.getBigDecimal("nr_precipitacao"));
        dado.setIndiceUv(resultSet.getBigDecimal("nr_indice_uv"));
        dado.setVelocidadeVentoKmh(resultSet.getBigDecimal("nr_velocidade_vento_kmh"));
        dado.setRadiacaoSolar(resultSet.getBigDecimal("nr_radiacao_solar"));
        dado.setFonteApi(DaoUtils.getEnum(resultSet, "ds_fonte_api", FonteApi.class));
        return dado;
    }
}
