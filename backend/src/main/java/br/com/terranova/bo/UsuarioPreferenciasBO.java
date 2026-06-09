package br.com.terranova.bo;

import br.com.terranova.dao.UsuarioPreferenciasDAO;
import br.com.terranova.dto.request.UsuarioPreferenciasRequest;
import br.com.terranova.dto.response.UsuarioPreferenciasResponse;
import br.com.terranova.entities.UsuarioPreferencias;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.List;

@ApplicationScoped
public class UsuarioPreferenciasBO {

    @Inject
    UsuarioBO usuarioBO;

    @Inject
    UsuarioPreferenciasDAO preferenciasDAO;

    public UsuarioPreferenciasResponse buscar(Long idUsuario) {
        usuarioBO.buscarEntidade(idUsuario);
        return toResponse(preferenciasDAO.buscarPorUsuario(idUsuario).orElseGet(() -> padrao(idUsuario)));
    }

    public UsuarioPreferenciasResponse salvar(Long idUsuario, UsuarioPreferenciasRequest request) {
        usuarioBO.buscarEntidade(idUsuario);
        UsuarioPreferencias atual = preferenciasDAO.buscarPorUsuario(idUsuario).orElseGet(() -> padrao(idUsuario));
        atual.setDarkMode(request.darkMode() == null ? atual.isDarkMode() : request.darkMode());
        atual.setReducedMotion(request.reducedMotion() == null ? atual.isReducedMotion() : request.reducedMotion());
        atual.setEmailNotifications(request.emailNotifications() == null ? atual.isEmailNotifications() : request.emailNotifications());
        atual.setDateRangeStart(valorOuAtual(request.dateRangeStart(), atual.getDateRangeStart()));
        atual.setDateRangeEnd(valorOuAtual(request.dateRangeEnd(), atual.getDateRangeEnd()));
        atual.setSelectedMonth(valorOuAtual(request.selectedMonth(), atual.getSelectedMonth()));
        atual.setAlertLevels(join(request.alertLevels()));
        atual.setAlertTypes(join(request.alertTypes()));
        atual.setSoilSector(valorOuAtual(request.soilSector(), "all"));
        atual.setGrowthCrop(valorOuAtual(request.growthCrop(), "all"));
        return toResponse(preferenciasDAO.salvar(atual));
    }

    private UsuarioPreferencias padrao(Long idUsuario) {
        LocalDate hoje = LocalDate.now();
        UsuarioPreferencias preferencias = new UsuarioPreferencias();
        preferencias.setIdUsuario(idUsuario);
        preferencias.setDarkMode(false);
        preferencias.setReducedMotion(false);
        preferencias.setEmailNotifications(true);
        preferencias.setDateRangeStart(hoje.minusDays(30).toString());
        preferencias.setDateRangeEnd(hoje.toString());
        preferencias.setSelectedMonth(YearMonth.from(hoje).toString());
        preferencias.setAlertLevels("");
        preferencias.setAlertTypes("");
        preferencias.setSoilSector("all");
        preferencias.setGrowthCrop("all");
        return preferencias;
    }

    private String valorOuAtual(String valor, String atual) {
        String normalizado = BoUtils.normalizar(valor);
        return normalizado == null ? atual : normalizado;
    }

    private String join(List<String> valores) {
        if (valores == null || valores.isEmpty()) {
            return "";
        }
        return String.join(",", valores.stream().map(BoUtils::normalizar).filter(v -> v != null).toList());
    }

    private List<String> split(String valor) {
        String normalizado = BoUtils.normalizar(valor);
        if (normalizado == null) {
            return List.of();
        }
        return Arrays.stream(normalizado.split(",")).filter(item -> !item.isBlank()).toList();
    }

    private UsuarioPreferenciasResponse toResponse(UsuarioPreferencias preferencias) {
        return new UsuarioPreferenciasResponse(
                preferencias.getIdUsuario(),
                preferencias.isDarkMode(),
                preferencias.isReducedMotion(),
                preferencias.isEmailNotifications(),
                preferencias.getDateRangeStart(),
                preferencias.getDateRangeEnd(),
                preferencias.getSelectedMonth(),
                split(preferencias.getAlertLevels()),
                split(preferencias.getAlertTypes()),
                preferencias.getSoilSector(),
                preferencias.getGrowthCrop(),
                preferencias.getDataAtualizacao()
        );
    }
}
