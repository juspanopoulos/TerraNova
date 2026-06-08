package br.com.terranova.resources;

import br.com.terranova.bo.IaBO;
import br.com.terranova.dto.integration.ia.ChatIaRequest;
import br.com.terranova.dto.integration.ia.ChatIaResponse;
import br.com.terranova.dto.integration.ia.IaFuncionandoResponse;
import br.com.terranova.dto.request.ia.IaIrrigacaoRequest;
import br.com.terranova.dto.request.ia.IaProdutividadeRequest;
import br.com.terranova.dto.response.ia.IaIrrigacaoResponse;
import br.com.terranova.dto.response.ia.IaProdutividadeResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.Map;

@ApplicationScoped
@Path("/ia")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class IaResource {

    @Inject
    IaBO iaBO;

    @POST
    @Path("/funcionando")
    public IaFuncionandoResponse verificarFuncionamento(Map<String, Object> payload) {
        return iaBO.verificarFuncionamento(payload);
    }

    @POST
    @Path("/produtividade")
    public IaProdutividadeResponse predizerProdutividade(@Valid IaProdutividadeRequest request) {
        return iaBO.predizerProdutividade(request);
    }

    @POST
    @Path("/irrigacao")
    public IaIrrigacaoResponse predizerIrrigacao(@Valid IaIrrigacaoRequest request) {
        return iaBO.predizerIrrigacao(request);
    }

    @POST
    @Path("/chat")
    public ChatIaResponse conversar(@Valid ChatIaRequest request) {
        return iaBO.conversar(request);
    }
}
