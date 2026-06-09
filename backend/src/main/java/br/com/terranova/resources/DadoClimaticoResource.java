package br.com.terranova.resources;

import br.com.terranova.bo.DadoClimaticoBO;
import br.com.terranova.dto.request.DadoClimaticoRequest;
import br.com.terranova.dto.response.DadoClimaticoResponse;
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
@Path("/dados-climaticos")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class DadoClimaticoResource {

    @Inject
    DadoClimaticoBO dadoClimaticoBO;

    @GET
    public List<DadoClimaticoResponse> listar() {
        return dadoClimaticoBO.listar();
    }

    @GET
    @Path("/area/{idArea:[0-9]+}/historico")
    public List<DadoClimaticoResponse> listarHistoricoPorArea(@PathParam("idArea") Long idArea) {
        return dadoClimaticoBO.listarHistoricoPorArea(idArea);
    }

    @GET
    @Path("/{id:[0-9]+}")
    public DadoClimaticoResponse buscarPorId(@PathParam("id") Long id) {
        return dadoClimaticoBO.buscarPorId(id);
    }

    @POST
    public Response criar(@Valid DadoClimaticoRequest request) {
        return ResourceUtils.created(dadoClimaticoBO.criar(request));
    }

    @PUT
    @Path("/{id:[0-9]+}")
    public DadoClimaticoResponse atualizar(@PathParam("id") Long id, @Valid DadoClimaticoRequest request) {
        return dadoClimaticoBO.atualizar(id, request);
    }

    @DELETE
    @Path("/{id:[0-9]+}")
    public Response deletar(@PathParam("id") Long id) {
        dadoClimaticoBO.deletar(id);
        return ResourceUtils.noContent();
    }
}
