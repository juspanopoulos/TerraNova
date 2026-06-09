package br.com.terranova.dao;

import br.com.terranova.connection.ConnectionFactory;
import br.com.terranova.entities.Usuario;
import br.com.terranova.enums.PerfilUsuario;
import br.com.terranova.enums.StatusUsuario;
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
public class UsuarioDAO implements CrudDAO<Usuario> {

    @Inject
    ConnectionFactory connectionFactory;

    @Override
    public List<Usuario> listar() {
        String sql = """
                SELECT id_usuario, id_empresa, nm_usuario, ds_email, ds_senha_hash, nr_cpf,
                       ds_perfil, ds_status, dt_cadastro, dt_ultimo_acesso
                FROM TN_USUARIO
                ORDER BY id_usuario
                """;
        List<Usuario> usuarios = new ArrayList<>();
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                usuarios.add(mapear(resultSet));
            }
            return usuarios;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao listar usuarios.", exception);
        }
    }

    @Override
    public Optional<Usuario> buscarPorId(Long id) {
        String sql = """
                SELECT id_usuario, id_empresa, nm_usuario, ds_email, ds_senha_hash, nr_cpf,
                       ds_perfil, ds_status, dt_cadastro, dt_ultimo_acesso
                FROM TN_USUARIO
                WHERE id_usuario = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar usuario por ID.", exception);
        }
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        String sql = """
                SELECT id_usuario, id_empresa, nm_usuario, ds_email, ds_senha_hash, nr_cpf,
                       ds_perfil, ds_status, dt_cadastro, dt_ultimo_acesso
                FROM TN_USUARIO
                WHERE ds_email = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, email);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar usuario por email.", exception);
        }
    }

    @Override
    public Usuario inserir(Usuario usuario) {
        String sql = """
                INSERT INTO TN_USUARIO
                (id_empresa, nm_usuario, ds_email, ds_senha_hash, nr_cpf, ds_perfil, ds_status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, new String[]{"id_usuario"})) {
            statement.setLong(1, usuario.getIdEmpresa());
            statement.setString(2, usuario.getNomeUsuario());
            statement.setString(3, usuario.getEmail());
            statement.setString(4, usuario.getSenhaHash());
            statement.setString(5, usuario.getCpf());
            DaoUtils.setEnum(statement, 6, usuario.getPerfil());
            DaoUtils.setEnum(statement, 7, usuario.getStatus());
            statement.executeUpdate();
            usuario.setIdUsuario(DaoUtils.generatedId(statement));
            return usuario;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao inserir usuario.", exception);
        }
    }

    @Override
    public Usuario atualizar(Usuario usuario) {
        String sql = """
                UPDATE TN_USUARIO
                SET id_empresa = ?, nm_usuario = ?, ds_email = ?, ds_senha_hash = ?, nr_cpf = ?,
                    ds_perfil = ?, ds_status = ?, dt_ultimo_acesso = ?
                WHERE id_usuario = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, usuario.getIdEmpresa());
            statement.setString(2, usuario.getNomeUsuario());
            statement.setString(3, usuario.getEmail());
            statement.setString(4, usuario.getSenhaHash());
            statement.setString(5, usuario.getCpf());
            DaoUtils.setEnum(statement, 6, usuario.getPerfil());
            DaoUtils.setEnum(statement, 7, usuario.getStatus());
            DaoUtils.setLocalDateTime(statement, 8, usuario.getDataUltimoAcesso());
            statement.setLong(9, usuario.getIdUsuario());
            statement.executeUpdate();
            return usuario;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao atualizar usuario.", exception);
        }
    }

    @Override
    public boolean deletar(Long id) {
        String sql = "DELETE FROM TN_USUARIO WHERE id_usuario = ?";
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            return statement.executeUpdate() > 0;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao deletar usuario.", exception);
        }
    }

    private Usuario mapear(ResultSet resultSet) throws SQLException {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(resultSet.getLong("id_usuario"));
        usuario.setIdEmpresa(resultSet.getLong("id_empresa"));
        usuario.setNomeUsuario(resultSet.getString("nm_usuario"));
        usuario.setEmail(resultSet.getString("ds_email"));
        usuario.setSenhaHash(resultSet.getString("ds_senha_hash"));
        usuario.setCpf(resultSet.getString("nr_cpf"));
        usuario.setPerfil(DaoUtils.getEnum(resultSet, "ds_perfil", PerfilUsuario.class));
        usuario.setStatus(DaoUtils.getEnum(resultSet, "ds_status", StatusUsuario.class));
        usuario.setDataCadastro(DaoUtils.getLocalDateTime(resultSet, "dt_cadastro"));
        usuario.setDataUltimoAcesso(DaoUtils.getLocalDateTime(resultSet, "dt_ultimo_acesso"));
        return usuario;
    }
}
