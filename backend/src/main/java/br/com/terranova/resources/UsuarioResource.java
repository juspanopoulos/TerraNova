package br.com.terranova.resources;

import br.com.terranova.bo.UsuarioBO;
import br.com.terranova.dto.request.UsuarioRequest;
import br.com.terranova.dto.response.UsuarioResponse;
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
@Path("/usuarios")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UsuarioResource {

    @Inject
    UsuarioBO usuarioBO;

    @GET
    public List<UsuarioResponse> listar() {
        return usuarioBO.listar();
    }

    @GET
    @Path("/{id:[0-9]+}")
    public UsuarioResponse buscarPorId(@PathParam("id") Long id) {
        return usuarioBO.buscarPorId(id);
    }

    @POST
    public Response criar(@Valid UsuarioRequest request) {
        return ResourceUtils.created(usuarioBO.criar(request));
    }

    @PUT
    @Path("/{id:[0-9]+}")
    public UsuarioResponse atualizar(@PathParam("id") Long id, @Valid UsuarioRequest request) {
        return usuarioBO.atualizar(id, request);
    }

    @DELETE
    @Path("/{id:[0-9]+}")
    public Response deletar(@PathParam("id") Long id) {
        usuarioBO.deletar(id);
        return ResourceUtils.noContent();
    }
}
