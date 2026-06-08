package br.com.terranova.client;

import br.com.terranova.dto.integration.nasa.NasaPowerResponse;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@RegisterRestClient(configKey = "nasa-power")
@Path("/api/temporal/daily/point")
@Produces(MediaType.APPLICATION_JSON)
public interface NasaPowerClient {

    @GET
    NasaPowerResponse buscarDadosDiarios(
            @QueryParam("parameters") String parameters,
            @QueryParam("community") String community,
            @QueryParam("longitude") String longitude,
            @QueryParam("latitude") String latitude,
            @QueryParam("start") String start,
            @QueryParam("end") String end,
            @QueryParam("format") String format
    );
}
