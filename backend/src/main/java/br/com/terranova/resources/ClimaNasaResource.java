package br.com.terranova.resources;

import br.com.terranova.bo.NasaClimaBO;
import br.com.terranova.dto.response.clima.ColetaNasaResponse;
import br.com.terranova.exceptions.ValidacaoException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

@ApplicationScoped
@Path("/clima/nasa")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ClimaNasaResource {

    @Inject
    NasaClimaBO nasaClimaBO;

    @POST
    @Path("/areas/{idArea:[0-9]+}/coletar")
    public ColetaNasaResponse coletarEPersistir(
            @PathParam("idArea") Long idArea,
            @QueryParam("dataReferencia") String dataReferencia
    ) {
        return nasaClimaBO.coletarEPersistir(idArea, parseData(dataReferencia));
    }

    private LocalDate parseData(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(valor);
        } catch (DateTimeParseException exception) {
            throw new ValidacaoException("dataReferencia deve estar no formato yyyy-MM-dd.", exception);
        }
    }
}
