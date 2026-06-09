package br.com.terranova.resources;

import br.com.terranova.bo.AssistenteBO;
import br.com.terranova.dto.request.AssistenteChatPersistidoRequest;
import br.com.terranova.dto.response.AssistenteConversaResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
@Path("/assistente/conversas")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AssistenteConversaResource {

    @Inject
    AssistenteBO assistenteBO;

    @POST
    @Path("/{idConversa:[0-9]+}/chat")
    public AssistenteConversaResponse conversar(
            @PathParam("idConversa") Long idConversa,
            @Valid AssistenteChatPersistidoRequest request
    ) {
        return assistenteBO.conversar(idConversa, request);
    }

    @DELETE
    @Path("/{idConversa:[0-9]+}")
    public Response deletar(@PathParam("idConversa") Long idConversa) {
        assistenteBO.deletarConversa(idConversa);
        return ResourceUtils.noContent();
    }
}
