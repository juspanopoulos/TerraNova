package br.com.terranova.resources;

import br.com.terranova.bo.PredicaoIaBO;
import br.com.terranova.dto.request.PredicaoIaRequest;
import br.com.terranova.dto.response.PredicaoIaResponse;
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
@Path("/predicoes-ia")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class PredicaoIaResource {

    @Inject
    PredicaoIaBO predicaoIaBO;

    @GET
    public List<PredicaoIaResponse> listar() {
        return predicaoIaBO.listar();
    }

    @GET
    @Path("/area/{idArea:[0-9]+}")
    public List<PredicaoIaResponse> listarPorArea(@PathParam("idArea") Long idArea) {
        return predicaoIaBO.listarPorArea(idArea);
    }

    @GET
    @Path("/{id:[0-9]+}")
    public PredicaoIaResponse buscarPorId(@PathParam("id") Long id) {
        return predicaoIaBO.buscarPorId(id);
    }

    @POST
    public Response criar(@Valid PredicaoIaRequest request) {
        return ResourceUtils.created(predicaoIaBO.criar(request));
    }

    @PUT
    @Path("/{id:[0-9]+}")
    public PredicaoIaResponse atualizar(@PathParam("id") Long id, @Valid PredicaoIaRequest request) {
        return predicaoIaBO.atualizar(id, request);
    }

    @DELETE
    @Path("/{id:[0-9]+}")
    public Response deletar(@PathParam("id") Long id) {
        predicaoIaBO.deletar(id);
        return ResourceUtils.noContent();
    }
}
