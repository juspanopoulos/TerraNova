package br.com.terranova.resources;

import br.com.terranova.bo.LeituraSoloBO;
import br.com.terranova.dto.request.LeituraSoloRequest;
import br.com.terranova.dto.response.LeituraSoloResponse;
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
@Path("/leituras-solo")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class LeituraSoloResource {

    @Inject
    LeituraSoloBO leituraSoloBO;

    @GET
    public List<LeituraSoloResponse> listar() {
        return leituraSoloBO.listar();
    }

    @GET
    @Path("/area/{idArea:[0-9]+}/historico")
    public List<LeituraSoloResponse> listarHistoricoPorArea(@PathParam("idArea") Long idArea) {
        return leituraSoloBO.listarHistoricoPorArea(idArea);
    }

    @GET
    @Path("/area/{idArea:[0-9]+}/ultima")
    public LeituraSoloResponse buscarUltimaPorArea(@PathParam("idArea") Long idArea) {
        return leituraSoloBO.buscarUltimaPorArea(idArea);
    }

    @GET
    @Path("/{id:[0-9]+}")
    public LeituraSoloResponse buscarPorId(@PathParam("id") Long id) {
        return leituraSoloBO.buscarPorId(id);
    }

    @POST
    public Response criar(@Valid LeituraSoloRequest request) {
        return ResourceUtils.created(leituraSoloBO.criar(request));
    }

    @PUT
    @Path("/{id:[0-9]+}")
    public LeituraSoloResponse atualizar(@PathParam("id") Long id, @Valid LeituraSoloRequest request) {
        return leituraSoloBO.atualizar(id, request);
    }

    @DELETE
    @Path("/{id:[0-9]+}")
    public Response deletar(@PathParam("id") Long id) {
        leituraSoloBO.deletar(id);
        return ResourceUtils.noContent();
    }
}
