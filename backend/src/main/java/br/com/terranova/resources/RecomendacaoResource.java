package br.com.terranova.resources;

import br.com.terranova.bo.RecomendacaoBO;
import br.com.terranova.dto.request.RecomendacaoRequest;
import br.com.terranova.dto.response.RecomendacaoResponse;
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
@Path("/recomendacoes")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class RecomendacaoResource {

    @Inject
    RecomendacaoBO recomendacaoBO;

    @GET
    public List<RecomendacaoResponse> listar() {
        return recomendacaoBO.listar();
    }

    @GET
    @Path("/pendentes")
    public List<RecomendacaoResponse> listarPendentes() {
        return recomendacaoBO.listarPendentes();
    }

    @GET
    @Path("/{id:[0-9]+}")
    public RecomendacaoResponse buscarPorId(@PathParam("id") Long id) {
        return recomendacaoBO.buscarPorId(id);
    }

    @POST
    public Response criar(@Valid RecomendacaoRequest request) {
        return ResourceUtils.created(recomendacaoBO.criar(request));
    }

    @PUT
    @Path("/{id:[0-9]+}")
    public RecomendacaoResponse atualizar(@PathParam("id") Long id, @Valid RecomendacaoRequest request) {
        return recomendacaoBO.atualizar(id, request);
    }

    @PATCH
    @Path("/{id:[0-9]+}/aplicar")
    public RecomendacaoResponse aplicar(@PathParam("id") Long id) {
        return recomendacaoBO.aplicar(id);
    }

    @PATCH
    @Path("/{id:[0-9]+}/ignorar")
    public RecomendacaoResponse ignorar(@PathParam("id") Long id) {
        return recomendacaoBO.ignorar(id);
    }

    @DELETE
    @Path("/{id:[0-9]+}")
    public Response deletar(@PathParam("id") Long id) {
        recomendacaoBO.deletar(id);
        return ResourceUtils.noContent();
    }
}
