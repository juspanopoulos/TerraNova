package br.com.terranova.exceptions.mappers;

import br.com.terranova.exceptions.ApiErrorResponse;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.time.OffsetDateTime;
import java.util.stream.Collectors;

@Provider
public class ConstraintViolationMapper implements ExceptionMapper<ConstraintViolationException> {

    @Context
    UriInfo uriInfo;

    @Override
    public Response toResponse(ConstraintViolationException exception) {
        String mensagem = exception.getConstraintViolations().stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .collect(Collectors.joining("; "));

        if (mensagem.isBlank()) {
            mensagem = "Dados invalidos na requisicao.";
        }

        return Response.status(Response.Status.BAD_REQUEST)
                .type(MediaType.APPLICATION_JSON)
                .entity(new ApiErrorResponse(
                        Response.Status.BAD_REQUEST.getStatusCode(),
                        "VALIDACAO",
                        mensagem,
                        caminho(),
                        OffsetDateTime.now()
                ))
                .build();
    }

    private String caminho() {
        return uriInfo == null ? null : uriInfo.getPath();
    }
}
