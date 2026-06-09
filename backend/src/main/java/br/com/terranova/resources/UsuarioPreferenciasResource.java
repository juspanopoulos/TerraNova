package br.com.terranova.resources;

import br.com.terranova.bo.UsuarioPreferenciasBO;
import br.com.terranova.dto.request.UsuarioPreferenciasRequest;
import br.com.terranova.dto.response.UsuarioPreferenciasResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@ApplicationScoped
@Path("/usuarios/{idUsuario:[0-9]+}/preferencias")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UsuarioPreferenciasResource {

    @Inject
    UsuarioPreferenciasBO preferenciasBO;

    @GET
    public UsuarioPreferenciasResponse buscar(@PathParam("idUsuario") Long idUsuario) {
        return preferenciasBO.buscar(idUsuario);
    }

    @PUT
    public UsuarioPreferenciasResponse salvar(
            @PathParam("idUsuario") Long idUsuario,
            @Valid UsuarioPreferenciasRequest request
    ) {
        return preferenciasBO.salvar(idUsuario, request);
    }
}
