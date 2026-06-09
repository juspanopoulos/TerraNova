package br.com.terranova.dao;

import br.com.terranova.connection.ConnectionFactory;
import br.com.terranova.entities.Empresa;
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
public class EmpresaDAO implements CrudDAO<Empresa> {

    @Inject
    ConnectionFactory connectionFactory;

    @Override
    public List<Empresa> listar() {
        String sql = """
                SELECT id_empresa, nm_empresa, nr_cnpj, ds_email, nr_telefone, dt_cadastro
                FROM TN_EMPRESA
                ORDER BY id_empresa
                """;
        List<Empresa> empresas = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                empresas.add(mapear(resultSet));
            }
            return empresas;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao listar empresas.", exception);
        }
    }

    @Override
    public Optional<Empresa> buscarPorId(Long id) {
        String sql = """
                SELECT id_empresa, nm_empresa, nr_cnpj, ds_email, nr_telefone, dt_cadastro
                FROM TN_EMPRESA
                WHERE id_empresa = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar empresa por ID.", exception);
        }
    }

    @Override
    public Empresa inserir(Empresa empresa) {
        String sql = """
                INSERT INTO TN_EMPRESA (nm_empresa, nr_cnpj, ds_email, nr_telefone)
                VALUES (?, ?, ?, ?)
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, new String[]{"id_empresa"})) {
            statement.setString(1, empresa.getNomeEmpresa());
            statement.setString(2, empresa.getCnpj());
            statement.setString(3, empresa.getEmail());
            statement.setString(4, empresa.getTelefone());
            statement.executeUpdate();
            empresa.setIdEmpresa(DaoUtils.generatedId(statement));
            return empresa;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao inserir empresa.", exception);
        }
    }

    @Override
    public Empresa atualizar(Empresa empresa) {
        String sql = """
                UPDATE TN_EMPRESA
                SET nm_empresa = ?, nr_cnpj = ?, ds_email = ?, nr_telefone = ?
                WHERE id_empresa = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, empresa.getNomeEmpresa());
            statement.setString(2, empresa.getCnpj());
            statement.setString(3, empresa.getEmail());
            statement.setString(4, empresa.getTelefone());
            statement.setLong(5, empresa.getIdEmpresa());
            statement.executeUpdate();
            return empresa;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao atualizar empresa.", exception);
        }
    }

    @Override
    public boolean deletar(Long id) {
        String sql = "DELETE FROM TN_EMPRESA WHERE id_empresa = ?";
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            return statement.executeUpdate() > 0;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao deletar empresa.", exception);
        }
    }

    private Empresa mapear(ResultSet resultSet) throws SQLException {
        Empresa empresa = new Empresa();
        empresa.setIdEmpresa(resultSet.getLong("id_empresa"));
        empresa.setNomeEmpresa(resultSet.getString("nm_empresa"));
        empresa.setCnpj(resultSet.getString("nr_cnpj"));
        empresa.setEmail(resultSet.getString("ds_email"));
        empresa.setTelefone(resultSet.getString("nr_telefone"));
        empresa.setDataCadastro(DaoUtils.getLocalDateTime(resultSet, "dt_cadastro"));
        return empresa;
    }
}
