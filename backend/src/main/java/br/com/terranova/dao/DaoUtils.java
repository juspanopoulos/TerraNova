package br.com.terranova.dao;

import br.com.terranova.exceptions.BancoDadosException;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

final class DaoUtils {

    private DaoUtils() {
    }

    static Long generatedId(PreparedStatement statement) throws SQLException {
        try (ResultSet keys = statement.getGeneratedKeys()) {
            if (keys.next()) {
                return keys.getLong(1);
            }
        }
        throw new BancoDadosException("Nao foi possivel recuperar o ID gerado pelo banco de dados.");
    }

    static LocalDateTime getLocalDateTime(ResultSet resultSet, String column) throws SQLException {
        Timestamp value = resultSet.getTimestamp(column);
        return value == null ? null : value.toLocalDateTime();
    }

    static LocalDate getLocalDate(ResultSet resultSet, String column) throws SQLException {
        Date value = resultSet.getDate(column);
        return value == null ? null : value.toLocalDate();
    }

    static void setLocalDateTime(PreparedStatement statement, int index, LocalDateTime value) throws SQLException {
        if (value == null) {
            statement.setTimestamp(index, null);
            return;
        }
        statement.setTimestamp(index, Timestamp.valueOf(value));
    }

    static void setLocalDate(PreparedStatement statement, int index, LocalDate value) throws SQLException {
        if (value == null) {
            statement.setDate(index, null);
            return;
        }
        statement.setDate(index, Date.valueOf(value));
    }

    static <E extends Enum<E>> E getEnum(ResultSet resultSet, String column, Class<E> enumType) throws SQLException {
        String value = resultSet.getString(column);
        return value == null ? null : Enum.valueOf(enumType, value);
    }

    static void setEnum(PreparedStatement statement, int index, Enum<?> value) throws SQLException {
        if (value == null) {
            statement.setString(index, null);
            return;
        }
        statement.setString(index, value.name());
    }
}
