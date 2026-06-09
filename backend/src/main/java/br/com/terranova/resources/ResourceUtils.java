package br.com.terranova.resources;

import jakarta.ws.rs.core.Response;

final class ResourceUtils {

    private ResourceUtils() {
    }

    static Response created(Object entity) {
        return Response.status(Response.Status.CREATED).entity(entity).build();
    }

    static Response noContent() {
        return Response.noContent().build();
    }
}
