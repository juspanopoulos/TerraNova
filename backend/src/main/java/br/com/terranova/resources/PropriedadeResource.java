package br.com.terranova.resources;

import br.com.terranova.bo.PropriedadeBO;
import br.com.terranova.dto.request.PropriedadeRequest;
import br.com.terranova.dto.response.PropriedadeResponse;
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
@Path("/propriedades")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class PropriedadeResource {

    @Inject
    PropriedadeBO propriedadeBO;

    @GET
    public List<PropriedadeResponse> listar() {
        return propriedadeBO.listar();
    }

    @GET
    @Path("/{id:[0-9]+}")
    public PropriedadeResponse buscarPorId(@PathParam("id") Long id) {
        return propriedadeBO.buscarPorId(id);
    }

    @POST
    public Response criar(@Valid PropriedadeRequest request) {
        return ResourceUtils.created(propriedadeBO.criar(request));
    }

    @PUT
    @Path("/{id:[0-9]+}")
    public PropriedadeResponse atualizar(@PathParam("id") Long id, @Valid PropriedadeRequest request) {
        return propriedadeBO.atualizar(id, request);
    }

    @DELETE
    @Path("/{id:[0-9]+}")
    public Response deletar(@PathParam("id") Long id) {
        propriedadeBO.deletar(id);
        return ResourceUtils.noContent();
    }
}
