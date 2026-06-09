package br.com.terranova.resources;

import br.com.terranova.bo.AnotacaoBO;
import br.com.terranova.dto.request.AnotacaoRequest;
import br.com.terranova.dto.response.AnotacaoResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@ApplicationScoped
@Path("/usuarios/{idUsuario:[0-9]+}/anotacoes")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AnotacaoResource {

    @Inject
    AnotacaoBO anotacaoBO;

    @GET
    public List<AnotacaoResponse> listar(@PathParam("idUsuario") Long idUsuario) {
        return anotacaoBO.listarPorUsuario(idUsuario);
    }

    @POST
    public Response criar(@PathParam("idUsuario") Long idUsuario, @Valid AnotacaoRequest request) {
        return ResourceUtils.created(anotacaoBO.criar(idUsuario, request));
    }
}
