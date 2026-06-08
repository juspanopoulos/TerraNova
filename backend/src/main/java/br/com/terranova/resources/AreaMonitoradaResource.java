package br.com.terranova.resources;

import br.com.terranova.bo.AreaMonitoradaBO;
import br.com.terranova.dto.request.AreaMonitoradaRequest;
import br.com.terranova.dto.response.AreaMonitoradaResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@ApplicationScoped
@Path("/areas-monitoradas")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AreaMonitoradaResource {

    @Inject
    AreaMonitoradaBO areaMonitoradaBO;

    @GET
    public List<AreaMonitoradaResponse> listar() {
        return areaMonitoradaBO.listar();
    }

    @GET
    @Path("/{id:[0-9]+}")
    public AreaMonitoradaResponse buscarPorId(@PathParam("id") Long id) {
        return areaMonitoradaBO.buscarPorId(id);
    }

    @POST
    public Response criar(@Valid AreaMonitoradaRequest request) {
        return ResourceUtils.created(areaMonitoradaBO.criar(request));
    }

    @PUT
    @Path("/{id:[0-9]+}")
    public AreaMonitoradaResponse atualizar(@PathParam("id") Long id, @Valid AreaMonitoradaRequest request) {
        return areaMonitoradaBO.atualizar(id, request);
    }

    @DELETE
    @Path("/{id:[0-9]+}")
    public Response deletar(@PathParam("id") Long id) {
        areaMonitoradaBO.deletar(id);
        return ResourceUtils.noContent();
    }
}
