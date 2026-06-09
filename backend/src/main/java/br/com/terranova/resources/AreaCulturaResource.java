package br.com.terranova.resources;

import br.com.terranova.bo.AreaCulturaBO;
import br.com.terranova.dto.request.AreaCulturaRequest;
import br.com.terranova.dto.response.AreaCulturaResponse;
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
@Path("/areas-culturas")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AreaCulturaResource {

    @Inject
    AreaCulturaBO areaCulturaBO;

    @GET
    public List<AreaCulturaResponse> listar() {
        return areaCulturaBO.listar();
    }

    @GET
    @Path("/ativos")
    public List<AreaCulturaResponse> listarAtivos() {
        return areaCulturaBO.listarAtivos();
    }

    @GET
    @Path("/{id:[0-9]+}")
    public AreaCulturaResponse buscarPorId(@PathParam("id") Long id) {
        return areaCulturaBO.buscarPorId(id);
    }

    @POST
    public Response criar(@Valid AreaCulturaRequest request) {
        return ResourceUtils.created(areaCulturaBO.criar(request));
    }

    @PUT
    @Path("/{id:[0-9]+}")
    public AreaCulturaResponse atualizar(@PathParam("id") Long id, @Valid AreaCulturaRequest request) {
        return areaCulturaBO.atualizar(id, request);
    }

    @DELETE
    @Path("/{id:[0-9]+}")
    public Response deletar(@PathParam("id") Long id) {
        areaCulturaBO.deletar(id);
        return ResourceUtils.noContent();
    }
}
