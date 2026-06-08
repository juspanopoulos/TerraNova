package br.com.terranova.resources;

import br.com.terranova.bo.IrrigacaoBO;
import br.com.terranova.dto.request.IrrigacaoRequest;
import br.com.terranova.dto.response.IrrigacaoResponse;
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
@Path("/irrigacoes")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class IrrigacaoResource {

    @Inject
    IrrigacaoBO irrigacaoBO;

    @GET
    public List<IrrigacaoResponse> listar() {
        return irrigacaoBO.listar();
    }

    @GET
    @Path("/area/{idArea:[0-9]+}/historico")
    public List<IrrigacaoResponse> listarHistoricoPorArea(@PathParam("idArea") Long idArea) {
        return irrigacaoBO.listarHistoricoPorArea(idArea);
    }

    @GET
    @Path("/{id:[0-9]+}")
    public IrrigacaoResponse buscarPorId(@PathParam("id") Long id) {
        return irrigacaoBO.buscarPorId(id);
    }

    @POST
    public Response criar(@Valid IrrigacaoRequest request) {
        return ResourceUtils.created(irrigacaoBO.criar(request));
    }

    @PUT
    @Path("/{id:[0-9]+}")
    public IrrigacaoResponse atualizar(@PathParam("id") Long id, @Valid IrrigacaoRequest request) {
        return irrigacaoBO.atualizar(id, request);
    }

    @DELETE
    @Path("/{id:[0-9]+}")
    public Response deletar(@PathParam("id") Long id) {
        irrigacaoBO.deletar(id);
        return ResourceUtils.noContent();
    }
}
