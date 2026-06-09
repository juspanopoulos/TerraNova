package br.com.terranova.client;

import br.com.terranova.dto.integration.ia.IaFuncionandoResponse;
import br.com.terranova.dto.integration.ia.ModeloIrrigacaoPayload;
import br.com.terranova.dto.integration.ia.ModeloIrrigacaoResponse;
import br.com.terranova.dto.integration.ia.ModeloProdutividadePayload;
import br.com.terranova.dto.integration.ia.ModeloProdutividadeResponse;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.Map;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@RegisterRestClient(configKey = "terranova-ia")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface IaClient {

    @POST
    @Path("/api/funcionando")
    IaFuncionandoResponse funcionando(Map<String, Object> payload);

    @POST
    @Path("/modelo1/predict")
    ModeloProdutividadeResponse predizerProdutividade(ModeloProdutividadePayload payload);

    @POST
    @Path("/modelo2/predict")
    ModeloIrrigacaoResponse predizerIrrigacao(ModeloIrrigacaoPayload payload);

}
