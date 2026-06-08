package br.com.terranova.dao;

import br.com.terranova.connection.ConnectionFactory;
import br.com.terranova.entities.PredicaoIa;
import br.com.terranova.enums.StatusPredicaoIa;
import br.com.terranova.enums.TipoModeloIa;
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
public class PredicaoIaDAO implements CrudDAO<PredicaoIa> {

    @Inject
    ConnectionFactory connectionFactory;

    @Override
    public List<PredicaoIa> listar() {
        String sql = """
                SELECT id_predicao, id_area, id_area_cultura, id_usuario, dt_predicao, ds_tipo_modelo,
                       ds_nome_modelo, ds_versao_modelo, ds_entrada_json, ds_saida_json,
                       nr_produtividade_prevista, ds_classificacao, nr_volume_agua_sugerido_mm,
                       ds_situacao, ds_status, ds_erro
                FROM TN_PREDICAO_IA
                ORDER BY id_predicao
                """;
        List<PredicaoIa> predicoes = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                predicoes.add(mapear(resultSet));
            }
            return predicoes;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao listar predicoes de IA.", exception);
        }
    }

    @Override
    public Optional<PredicaoIa> buscarPorId(Long id) {
        String sql = """
                SELECT id_predicao, id_area, id_area_cultura, id_usuario, dt_predicao, ds_tipo_modelo,
                       ds_nome_modelo, ds_versao_modelo, ds_entrada_json, ds_saida_json,
                       nr_produtividade_prevista, ds_classificacao, nr_volume_agua_sugerido_mm,
                       ds_situacao, ds_status, ds_erro
                FROM TN_PREDICAO_IA
                WHERE id_predicao = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar predicao de IA por ID.", exception);
        }
    }

    public List<PredicaoIa> buscarPorArea(Long idArea) {
        String sql = """
                SELECT id_predicao, id_area, id_area_cultura, id_usuario, dt_predicao, ds_tipo_modelo,
                       ds_nome_modelo, ds_versao_modelo, ds_entrada_json, ds_saida_json,
                       nr_produtividade_prevista, ds_classificacao, nr_volume_agua_sugerido_mm,
                       ds_situacao, ds_status, ds_erro
                FROM TN_PREDICAO_IA
                WHERE id_area = ?
                ORDER BY dt_predicao DESC
                """;
        List<PredicaoIa> predicoes = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, idArea);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    predicoes.add(mapear(resultSet));
                }
            }
            return predicoes;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar predicoes de IA por area.", exception);
        }
    }

    @Override
    public PredicaoIa inserir(PredicaoIa predicao) {
        String sql = """
                INSERT INTO TN_PREDICAO_IA
                (id_area, id_area_cultura, id_usuario, dt_predicao, ds_tipo_modelo, ds_nome_modelo,
                 ds_versao_modelo, ds_entrada_json, ds_saida_json, nr_produtividade_prevista,
                 ds_classificacao, nr_volume_agua_sugerido_mm, ds_situacao, ds_status, ds_erro)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            preencherStatement(statement, predicao);
            statement.executeUpdate();
            predicao.setIdPredicao(DaoUtils.generatedId(statement));
            return predicao;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao inserir predicao de IA.", exception);
        }
    }

    @Override
    public PredicaoIa atualizar(PredicaoIa predicao) {
        String sql = """
                UPDATE TN_PREDICAO_IA
                SET id_area = ?, id_area_cultura = ?, id_usuario = ?, dt_predicao = ?, ds_tipo_modelo = ?,
                    ds_nome_modelo = ?, ds_versao_modelo = ?, ds_entrada_json = ?, ds_saida_json = ?,
                    nr_produtividade_prevista = ?, ds_classificacao = ?, nr_volume_agua_sugerido_mm = ?,
                    ds_situacao = ?, ds_status = ?, ds_erro = ?
                WHERE id_predicao = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            preencherStatement(statement, predicao);
            statement.setLong(16, predicao.getIdPredicao());
            statement.executeUpdate();
            return predicao;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao atualizar predicao de IA.", exception);
        }
    }

    @Override
    public boolean deletar(Long id) {
        String sql = "DELETE FROM TN_PREDICAO_IA WHERE id_predicao = ?";
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            return statement.executeUpdate() > 0;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao deletar predicao de IA.", exception);
        }
    }

    private void preencherStatement(PreparedStatement statement, PredicaoIa predicao) throws SQLException {
        statement.setLong(1, predicao.getIdArea());
        setNullableLong(statement, 2, predicao.getIdAreaCultura());
        setNullableLong(statement, 3, predicao.getIdUsuario());
        DaoUtils.setLocalDateTime(statement, 4, predicao.getDataPredicao());
        DaoUtils.setEnum(statement, 5, predicao.getTipoModelo());
        statement.setString(6, predicao.getNomeModelo());
        statement.setString(7, predicao.getVersaoModelo());
        statement.setString(8, predicao.getEntradaJson());
        statement.setString(9, predicao.getSaidaJson());
        statement.setBigDecimal(10, predicao.getProdutividadePrevista());
        statement.setString(11, predicao.getClassificacao());
        statement.setBigDecimal(12, predicao.getVolumeAguaSugeridoMm());
        statement.setString(13, predicao.getSituacao());
        DaoUtils.setEnum(statement, 14, predicao.getStatus());
        statement.setString(15, predicao.getErro());
    }

    private void setNullableLong(PreparedStatement statement, int index, Long value) throws SQLException {
        if (value == null) {
            statement.setObject(index, null);
            return;
        }
        statement.setLong(index, value);
    }

    private PredicaoIa mapear(ResultSet resultSet) throws SQLException {
        PredicaoIa predicao = new PredicaoIa();
        predicao.setIdPredicao(resultSet.getLong("id_predicao"));
        predicao.setIdArea(resultSet.getLong("id_area"));
        Long idAreaCultura = resultSet.getLong("id_area_cultura");
        predicao.setIdAreaCultura(resultSet.wasNull() ? null : idAreaCultura);
        Long idUsuario = resultSet.getLong("id_usuario");
        predicao.setIdUsuario(resultSet.wasNull() ? null : idUsuario);
        predicao.setDataPredicao(DaoUtils.getLocalDateTime(resultSet, "dt_predicao"));
        predicao.setTipoModelo(DaoUtils.getEnum(resultSet, "ds_tipo_modelo", TipoModeloIa.class));
        predicao.setNomeModelo(resultSet.getString("ds_nome_modelo"));
        predicao.setVersaoModelo(resultSet.getString("ds_versao_modelo"));
        predicao.setEntradaJson(resultSet.getString("ds_entrada_json"));
        predicao.setSaidaJson(resultSet.getString("ds_saida_json"));
        predicao.setProdutividadePrevista(resultSet.getBigDecimal("nr_produtividade_prevista"));
        predicao.setClassificacao(resultSet.getString("ds_classificacao"));
        predicao.setVolumeAguaSugeridoMm(resultSet.getBigDecimal("nr_volume_agua_sugerido_mm"));
        predicao.setSituacao(resultSet.getString("ds_situacao"));
        predicao.setStatus(DaoUtils.getEnum(resultSet, "ds_status", StatusPredicaoIa.class));
        predicao.setErro(resultSet.getString("ds_erro"));
        return predicao;
    }
}
