package br.com.terranova.exceptions.mappers;

import br.com.terranova.exceptions.ApiErrorResponse;
import br.com.terranova.exceptions.ApiException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.time.OffsetDateTime;

@Provider
public class ApiExceptionMapper implements ExceptionMapper<ApiException> {

    @Context
    UriInfo uriInfo;

    @Override
    public Response toResponse(ApiException exception) {
        return Response.status(exception.getStatus())
                .type(MediaType.APPLICATION_JSON)
                .entity(new ApiErrorResponse(
                        exception.getStatus(),
                        exception.getCodigo(),
                        exception.getMessage(),
                        caminho(),
                        OffsetDateTime.now()
                ))
                .build();
    }

    private String caminho() {
        return uriInfo == null ? null : uriInfo.getPath();
    }
}
