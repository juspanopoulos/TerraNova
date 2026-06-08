package br.com.terranova.resources;

import br.com.terranova.bo.CulturaBO;
import br.com.terranova.dto.request.CulturaRequest;
import br.com.terranova.dto.response.CulturaResponse;
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
@Path("/culturas")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CulturaResource {

    @Inject
    CulturaBO culturaBO;

    @GET
    public List<CulturaResponse> listar() {
        return culturaBO.listar();
    }

    @GET
    @Path("/{id:[0-9]+}")
    public CulturaResponse buscarPorId(@PathParam("id") Long id) {
        return culturaBO.buscarPorId(id);
    }

    @POST
    public Response criar(@Valid CulturaRequest request) {
        return ResourceUtils.created(culturaBO.criar(request));
    }

    @PUT
    @Path("/{id:[0-9]+}")
    public CulturaResponse atualizar(@PathParam("id") Long id, @Valid CulturaRequest request) {
        return culturaBO.atualizar(id, request);
    }

    @DELETE
    @Path("/{id:[0-9]+}")
    public Response deletar(@PathParam("id") Long id) {
        culturaBO.deletar(id);
        return ResourceUtils.noContent();
    }
}
