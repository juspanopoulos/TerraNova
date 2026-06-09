package br.com.terranova.resources;

import br.com.terranova.bo.DashboardBO;
import br.com.terranova.dto.response.dashboard.RelatorioAreaResponse;
import br.com.terranova.dto.response.dashboard.RelatorioOperacionalResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@ApplicationScoped
@Path("/relatorios")
@Produces(MediaType.APPLICATION_JSON)
public class RelatorioResource {

    @Inject
    DashboardBO dashboardBO;

    @GET
    @Path("/operacional")
    public RelatorioOperacionalResponse operacional() {
        return dashboardBO.relatorioOperacional();
    }

    @GET
    @Path("/areas/{idArea:[0-9]+}")
    public RelatorioAreaResponse area(@PathParam("idArea") Long idArea) {
        return dashboardBO.relatorioArea(idArea);
    }
}
