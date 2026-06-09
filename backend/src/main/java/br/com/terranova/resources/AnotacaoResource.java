package br.com.terranova.resources;

import br.com.terranova.bo.AnotacaoBO;
import br.com.terranova.dto.request.AnotacaoRequest;
import br.com.terranova.dto.response.AnotacaoResponse;
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
@Path("/")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AnotacaoResource {

    @Inject
    AnotacaoBO anotacaoBO;

    @GET
    @Path("usuarios/{idUsuario:[0-9]+}/anotacoes")
    public List<AnotacaoResponse> listar(@PathParam("idUsuario") Long idUsuario) {
        return anotacaoBO.listarPorUsuario(idUsuario);
    }

    @POST
    @Path("usuarios/{idUsuario:[0-9]+}/anotacoes")
    public Response criar(@PathParam("idUsuario") Long idUsuario, @Valid AnotacaoRequest request) {
        return ResourceUtils.created(anotacaoBO.criar(idUsuario, request));
    }

    @PUT
    @Path("anotacoes/{id:[0-9]+}")
    public AnotacaoResponse atualizar(@PathParam("id") Long id, @Valid AnotacaoRequest request) {
        return anotacaoBO.atualizar(id, request);
    }

    @DELETE
    @Path("anotacoes/{id:[0-9]+}")
    public Response deletar(@PathParam("id") Long id) {
        anotacaoBO.deletar(id);
        return ResourceUtils.noContent();
    }
}
