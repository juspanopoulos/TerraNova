package br.com.terranova.entities;

import java.time.LocalDateTime;

public class UsuarioPreferencias {

    private Long idUsuario;
    private boolean darkMode;
    private boolean reducedMotion;
    private boolean emailNotifications;
    private String dateRangeStart;
    private String dateRangeEnd;
    private String selectedMonth;
    private String alertLevels;
    private String alertTypes;
    private String soilSector;
    private String growthCrop;
    private LocalDateTime dataAtualizacao;

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public boolean isDarkMode() {
        return darkMode;
    }

    public void setDarkMode(boolean darkMode) {
        this.darkMode = darkMode;
    }

    public boolean isReducedMotion() {
        return reducedMotion;
    }

    public void setReducedMotion(boolean reducedMotion) {
        this.reducedMotion = reducedMotion;
    }

    public boolean isEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public String getDateRangeStart() {
        return dateRangeStart;
    }

    public void setDateRangeStart(String dateRangeStart) {
        this.dateRangeStart = dateRangeStart;
    }

    public String getDateRangeEnd() {
        return dateRangeEnd;
    }

    public void setDateRangeEnd(String dateRangeEnd) {
        this.dateRangeEnd = dateRangeEnd;
    }

    public String getSelectedMonth() {
        return selectedMonth;
    }

    public void setSelectedMonth(String selectedMonth) {
        this.selectedMonth = selectedMonth;
    }

    public String getAlertLevels() {
        return alertLevels;
    }

    public void setAlertLevels(String alertLevels) {
        this.alertLevels = alertLevels;
    }

    public String getAlertTypes() {
        return alertTypes;
    }

    public void setAlertTypes(String alertTypes) {
        this.alertTypes = alertTypes;
    }

    public String getSoilSector() {
        return soilSector;
    }

    public void setSoilSector(String soilSector) {
        this.soilSector = soilSector;
    }

    public String getGrowthCrop() {
        return growthCrop;
    }

    public void setGrowthCrop(String growthCrop) {
        this.growthCrop = growthCrop;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }
}
