package br.com.terranova.resources;

import br.com.terranova.bo.DashboardBO;
import br.com.terranova.dto.response.dashboard.DashboardAreaResumoResponse;
import br.com.terranova.dto.response.dashboard.DashboardResumoResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@ApplicationScoped
@Path("/dashboard")
@Produces(MediaType.APPLICATION_JSON)
public class DashboardResource {

    @Inject
    DashboardBO dashboardBO;

    @GET
    @Path("/resumo")
    public DashboardResumoResponse resumo() {
        return dashboardBO.resumo();
    }

    @GET
    @Path("/areas/{idArea:[0-9]+}")
    public DashboardAreaResumoResponse resumoArea(@PathParam("idArea") Long idArea) {
        return dashboardBO.resumoArea(idArea);
    }
}
