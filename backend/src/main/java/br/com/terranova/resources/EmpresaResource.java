package br.com.terranova.resources;

import br.com.terranova.bo.EmpresaBO;
import br.com.terranova.dto.request.EmpresaRequest;
import br.com.terranova.dto.response.EmpresaResponse;
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
@Path("/empresas")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class EmpresaResource {

    @Inject
    EmpresaBO empresaBO;

    @GET
    public List<EmpresaResponse> listar() {
        return empresaBO.listar();
    }

    @GET
    @Path("/{id:[0-9]+}")
    public EmpresaResponse buscarPorId(@PathParam("id") Long id) {
        return empresaBO.buscarPorId(id);
    }

    @POST
    public Response criar(@Valid EmpresaRequest request) {
        return ResourceUtils.created(empresaBO.criar(request));
    }

    @PUT
    @Path("/{id:[0-9]+}")
    public EmpresaResponse atualizar(@PathParam("id") Long id, @Valid EmpresaRequest request) {
        return empresaBO.atualizar(id, request);
    }

    @DELETE
    @Path("/{id:[0-9]+}")
    public Response deletar(@PathParam("id") Long id) {
        empresaBO.deletar(id);
        return ResourceUtils.noContent();
    }
}
