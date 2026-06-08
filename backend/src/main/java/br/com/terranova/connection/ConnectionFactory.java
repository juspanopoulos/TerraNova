package br.com.terranova.connection;

import br.com.terranova.exceptions.BancoDadosException;
import io.agroal.api.AgroalDataSource;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.sql.Connection;
import java.sql.SQLException;

@ApplicationScoped
public class ConnectionFactory {

    @Inject
    AgroalDataSource dataSource;

    public Connection getConnection() {
        try {
            return dataSource.getConnection();
        } catch (SQLException exception) {
            throw new BancoDadosException("Nao foi possivel abrir conexao com o banco de dados.", exception);
        }
    }
}
