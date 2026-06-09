package br.com.terranova.resources;

import br.com.terranova.bo.AnotacaoBO;
import br.com.terranova.dto.request.AnotacaoRequest;
import br.com.terranova.dto.response.AnotacaoResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
@Path("/anotacoes")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AnotacaoItemResource {

    @Inject
    AnotacaoBO anotacaoBO;

    @PUT
    @Path("/{id:[0-9]+}")
    public AnotacaoResponse atualizar(@PathParam("id") Long id, @Valid AnotacaoRequest request) {
        return anotacaoBO.atualizar(id, request);
    }

    @DELETE
    @Path("/{id:[0-9]+}")
    public Response deletar(@PathParam("id") Long id) {
        anotacaoBO.deletar(id);
        return ResourceUtils.noContent();
    }
}
