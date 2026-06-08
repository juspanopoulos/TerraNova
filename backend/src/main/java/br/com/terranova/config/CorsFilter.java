package br.com.terranova.config;

import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@Provider
@Priority(Priorities.HEADER_DECORATOR)
public class CorsFilter implements ContainerResponseFilter {

    @ConfigProperty(name = "terranova.cors.allowed-origins", defaultValue = "*")
    String allowedOrigins;

    @ConfigProperty(name = "terranova.cors.allowed-methods", defaultValue = "GET,POST,PUT,PATCH,DELETE,OPTIONS")
    String allowedMethods;

    @ConfigProperty(name = "terranova.cors.allowed-headers", defaultValue = "Content-Type,Authorization")
    String allowedHeaders;

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext)
            throws IOException {
        String origin = requestContext.getHeaderString("Origin");
        String allowedOrigin = resolveAllowedOrigin(origin);

        if (allowedOrigin != null) {
            responseContext.getHeaders().putSingle("Access-Control-Allow-Origin", allowedOrigin);
            responseContext.getHeaders().putSingle("Vary", "Origin");
        }

        responseContext.getHeaders().putSingle("Access-Control-Allow-Methods", allowedMethods);
        responseContext.getHeaders().putSingle("Access-Control-Allow-Headers", allowedHeaders);
        responseContext.getHeaders().putSingle("Access-Control-Max-Age", "3600");
    }

    private String resolveAllowedOrigin(String origin) {
        if (allowedOrigins == null || allowedOrigins.isBlank()) {
            return null;
        }

        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .toList();

        if (origins.contains("*")) {
            return "*";
        }

        if (origin != null && origins.contains(origin)) {
            return origin;
        }

        return null;
    }
}
