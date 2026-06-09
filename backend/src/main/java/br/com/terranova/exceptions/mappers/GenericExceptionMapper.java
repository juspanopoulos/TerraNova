package br.com.terranova.exceptions.mappers;

import br.com.terranova.exceptions.ApiErrorResponse;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.time.OffsetDateTime;
import org.jboss.logging.Logger;

@Provider
public class GenericExceptionMapper implements ExceptionMapper<Exception> {

    private static final Logger LOGGER = Logger.getLogger(GenericExceptionMapper.class);

    @Context
    UriInfo uriInfo;

    @Override
    public Response toResponse(Exception exception) {
        if (exception instanceof WebApplicationException webApplicationException) {
            int status = webApplicationException.getResponse().getStatus();
            return criarResposta(status, "ERRO_HTTP", mensagemHttp(status));
        }

        LOGGER.error("Erro inesperado na API TerraNova.", exception);
        return criarResposta(
                Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(),
                "ERRO_INTERNO",
                "Ocorreu um erro inesperado no servidor."
        );
    }

    private Response criarResposta(int status, String erro, String mensagem) {
        return Response.status(status)
                .type(MediaType.APPLICATION_JSON)
                .entity(new ApiErrorResponse(status, erro, mensagem, caminho(), OffsetDateTime.now()))
                .build();
    }

    private String mensagemHttp(int status) {
        return switch (status) {
            case 400 -> "Requisição inválida.";
            case 401 -> "Autenticação necessária.";
            case 403 -> "Acesso negado.";
            case 404 -> "Recurso não encontrado.";
            case 405 -> "Método HTTP não permitido para este recurso.";
            default -> "Erro HTTP ao processar a requisição.";
        };
    }

    private String caminho() {
        return uriInfo == null ? null : uriInfo.getPath();
    }
}
