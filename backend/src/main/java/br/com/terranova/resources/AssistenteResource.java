package br.com.terranova.resources;

import br.com.terranova.bo.AssistenteBO;
import br.com.terranova.dto.request.AssistenteConversaRequest;
import br.com.terranova.dto.response.AssistenteConversaResponse;
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
@Path("/usuarios/{idUsuario:[0-9]+}/assistente/conversas")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AssistenteResource {

    @Inject
    AssistenteBO assistenteBO;

    @GET
    public List<AssistenteConversaResponse> listar(@PathParam("idUsuario") Long idUsuario) {
        return assistenteBO.listarConversas(idUsuario);
    }

    @POST
    public Response criar(
            @PathParam("idUsuario") Long idUsuario,
            @Valid AssistenteConversaRequest request
    ) {
        return ResourceUtils.created(assistenteBO.criarConversa(idUsuario, request));
    }
}
