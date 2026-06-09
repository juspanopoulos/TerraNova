package br.com.terranova.dao;

import br.com.terranova.connection.ConnectionFactory;
import br.com.terranova.entities.UsuarioPreferencias;
import br.com.terranova.exceptions.BancoDadosException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Optional;

@ApplicationScoped
public class UsuarioPreferenciasDAO {

    @Inject
    ConnectionFactory connectionFactory;

    public Optional<UsuarioPreferencias> buscarPorUsuario(Long idUsuario) {
        String sql = """
                SELECT id_usuario, st_dark_mode, st_reduced_motion, st_email_notifications,
                       ds_date_range_start, ds_date_range_end, ds_selected_month,
                       ds_alert_levels, ds_alert_types, ds_soil_sector, ds_growth_crop,
                       dt_atualizacao
                FROM TN_USUARIO_PREFERENCIA
                WHERE id_usuario = ?
                """;
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, idUsuario);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapear(resultSet)) : Optional.empty();
            }
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao buscar preferencias do usuario.", exception);
        }
    }

    public UsuarioPreferencias salvar(UsuarioPreferencias preferencias) {
        String sql = """
                MERGE INTO TN_USUARIO_PREFERENCIA destino
                USING (SELECT ? id_usuario FROM dual) origem
                ON (destino.id_usuario = origem.id_usuario)
                WHEN MATCHED THEN UPDATE SET
                    st_dark_mode = ?,
                    st_reduced_motion = ?,
                    st_email_notifications = ?,
                    ds_date_range_start = ?,
                    ds_date_range_end = ?,
                    ds_selected_month = ?,
                    ds_alert_levels = ?,
                    ds_alert_types = ?,
                    ds_soil_sector = ?,
                    ds_growth_crop = ?,
                    dt_atualizacao = ?
                WHEN NOT MATCHED THEN INSERT
                    (id_usuario, st_dark_mode, st_reduced_motion, st_email_notifications,
                     ds_date_range_start, ds_date_range_end, ds_selected_month,
                     ds_alert_levels, ds_alert_types, ds_soil_sector, ds_growth_crop, dt_atualizacao)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;
        LocalDateTime agora = LocalDateTime.now();
        preferencias.setDataAtualizacao(agora);
        try (Connection connection = connectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            int index = 1;
            statement.setLong(index++, preferencias.getIdUsuario());
            setCampos(statement, index, preferencias);
            index += 11;
            statement.setLong(index++, preferencias.getIdUsuario());
            setCampos(statement, index, preferencias);
            statement.executeUpdate();
            return preferencias;
        } catch (SQLException exception) {
            throw new BancoDadosException("Erro ao salvar preferencias do usuario.", exception);
        }
    }

    private void setCampos(PreparedStatement statement, int start, UsuarioPreferencias preferencias) throws SQLException {
        int index = start;
        statement.setString(index++, flag(preferencias.isDarkMode()));
        statement.setString(index++, flag(preferencias.isReducedMotion()));
        statement.setString(index++, flag(preferencias.isEmailNotifications()));
        statement.setString(index++, preferencias.getDateRangeStart());
        statement.setString(index++, preferencias.getDateRangeEnd());
        statement.setString(index++, preferencias.getSelectedMonth());
        statement.setString(index++, preferencias.getAlertLevels());
        statement.setString(index++, preferencias.getAlertTypes());
        statement.setString(index++, preferencias.getSoilSector());
        statement.setString(index++, preferencias.getGrowthCrop());
        DaoUtils.setLocalDateTime(statement, index, preferencias.getDataAtualizacao());
    }

    private UsuarioPreferencias mapear(ResultSet resultSet) throws SQLException {
        UsuarioPreferencias preferencias = new UsuarioPreferencias();
        preferencias.setIdUsuario(resultSet.getLong("id_usuario"));
        preferencias.setDarkMode(booleanFlag(resultSet.getString("st_dark_mode")));
        preferencias.setReducedMotion(booleanFlag(resultSet.getString("st_reduced_motion")));
        preferencias.setEmailNotifications(booleanFlag(resultSet.getString("st_email_notifications")));
        preferencias.setDateRangeStart(resultSet.getString("ds_date_range_start"));
        preferencias.setDateRangeEnd(resultSet.getString("ds_date_range_end"));
        preferencias.setSelectedMonth(resultSet.getString("ds_selected_month"));
        preferencias.setAlertLevels(resultSet.getString("ds_alert_levels"));
        preferencias.setAlertTypes(resultSet.getString("ds_alert_types"));
        preferencias.setSoilSector(resultSet.getString("ds_soil_sector"));
        preferencias.setGrowthCrop(resultSet.getString("ds_growth_crop"));
        preferencias.setDataAtualizacao(DaoUtils.getLocalDateTime(resultSet, "dt_atualizacao"));
        return preferencias;
    }

    private String flag(boolean value) {
        return value ? "S" : "N";
    }

    private boolean booleanFlag(String value) {
        return "S".equalsIgnoreCase(value);
    }
}
