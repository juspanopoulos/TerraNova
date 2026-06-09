package br.com.terranova.resources;

import br.com.terranova.bo.AlertaBO;
import br.com.terranova.dto.request.AlertaRequest;
import br.com.terranova.dto.response.AlertaResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@ApplicationScoped
@Path("/alertas")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AlertaResource {

    @Inject
    AlertaBO alertaBO;

    @GET
    public List<AlertaResponse> listar() {
        return alertaBO.listar();
    }

    @GET
    @Path("/abertos")
    public List<AlertaResponse> listarAbertos() {
        return alertaBO.listarAbertos();
    }

    @GET
    @Path("/{id:[0-9]+}")
    public AlertaResponse buscarPorId(@PathParam("id") Long id) {
        return alertaBO.buscarPorId(id);
    }

    @POST
    public Response criar(@Valid AlertaRequest request) {
        return ResourceUtils.created(alertaBO.criar(request));
    }

    @PUT
    @Path("/{id:[0-9]+}")
    public AlertaResponse atualizar(@PathParam("id") Long id, @Valid AlertaRequest request) {
        return alertaBO.atualizar(id, request);
    }

    @PATCH
    @Path("/{id:[0-9]+}/resolver")
    public AlertaResponse resolver(@PathParam("id") Long id) {
        return alertaBO.resolver(id);
    }

    @DELETE
    @Path("/{id:[0-9]+}")
    public Response deletar(@PathParam("id") Long id) {
        alertaBO.deletar(id);
        return ResourceUtils.noContent();
    }
}
