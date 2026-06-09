package br.com.terranova.bo;

import br.com.terranova.client.IaClient;
import br.com.terranova.dto.integration.ia.ChatIaRequest;
import br.com.terranova.dto.integration.ia.ChatIaResponse;
import br.com.terranova.dto.integration.ia.IaFuncionandoResponse;
import br.com.terranova.dto.integration.ia.ModeloIrrigacaoPayload;
import br.com.terranova.dto.integration.ia.ModeloIrrigacaoResponse;
import br.com.terranova.dto.integration.ia.ModeloProdutividadePayload;
import br.com.terranova.dto.integration.ia.ModeloProdutividadeResponse;
import br.com.terranova.dto.request.PredicaoIaRequest;
import br.com.terranova.dto.request.ia.IaIrrigacaoRequest;
import br.com.terranova.dto.request.ia.IaProdutividadeRequest;
import br.com.terranova.dto.response.PredicaoIaResponse;
import br.com.terranova.dto.response.ia.IaIrrigacaoResponse;
import br.com.terranova.dto.response.ia.IaProdutividadeResponse;
import br.com.terranova.enums.StatusPredicaoIa;
import br.com.terranova.enums.TipoModeloIa;
import br.com.terranova.exceptions.IntegracaoIaException;
import br.com.terranova.exceptions.ValidacaoException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.WebApplicationException;
import java.time.LocalDateTime;
import java.util.Map;
import org.eclipse.microprofile.rest.client.inject.RestClient;

@ApplicationScoped
public class IaBO {

    @Inject
    @RestClient
    IaClient iaClient;

    @Inject
    PredicaoIaBO predicaoIaBO;

    @Inject
    ObjectMapper objectMapper;

    public IaFuncionandoResponse verificarFuncionamento(Map<String, Object> payload) {
        try {
            return iaClient.funcionando(payload == null ? Map.of("teste", "ok") : payload);
        } catch (ProcessingException | WebApplicationException exception) {
            throw new IntegracaoIaException("Nao foi possivel verificar a API de IA.", exception);
        }
    }

    public IaProdutividadeResponse predizerProdutividade(IaProdutividadeRequest request) {
        ModeloProdutividadePayload payload = new ModeloProdutividadePayload(
                request.rainfallMm(),
                request.temperatureCelsius(),
                request.fertilizerUsed(),
                request.irrigationUsed(),
                request.daysToHarvest(),
                request.region(),
                request.soilType(),
                request.crop(),
                request.weatherCondition()
        );

        ModeloProdutividadeResponse resultado;
        try {
            resultado = iaClient.predizerProdutividade(payload);
        } catch (ProcessingException | WebApplicationException exception) {
            throw new IntegracaoIaException("Falha ao consultar o modelo de produtividade.", exception);
        }

        validarStatusIa(resultado.status(), "produtividade");
        PredicaoIaResponse predicao = predicaoIaBO.criar(new PredicaoIaRequest(
                request.idArea(),
                request.idAreaCultura(),
                request.idUsuario(),
                LocalDateTime.now(),
                TipoModeloIa.PRODUTIVIDADE,
                "GS-M1 Yield Prediction",
                "joblib",
                toJson(payload),
                toJson(resultado),
                resultado.produtividade(),
                resultado.classificacao(),
                null,
                null,
                StatusPredicaoIa.SUCESSO,
                null
        ));

        return new IaProdutividadeResponse(
                resultado.status(),
                resultado.produtividade(),
                resultado.classificacao(),
                predicao
        );
    }

    public IaIrrigacaoResponse predizerIrrigacao(IaIrrigacaoRequest request) {
        ModeloIrrigacaoPayload payload = new ModeloIrrigacaoPayload(
                request.latitude(),
                request.longitude(),
                request.soilType(),
                request.soilMoisture(),
                request.cropType(),
                request.cropGrowthStage(),
                request.irrigationType(),
                request.fieldAreaHectare(),
                request.mulchingUsed(),
                request.previousIrrigationMm(),
                request.currentWaterUsage()
        );

        ModeloIrrigacaoResponse resultado;
        try {
            resultado = iaClient.predizerIrrigacao(payload);
        } catch (ProcessingException | WebApplicationException exception) {
            throw new IntegracaoIaException("Falha ao consultar o modelo de irrigacao.", exception);
        }

        validarStatusIa(resultado.status(), "irrigacao");
        PredicaoIaResponse predicao = predicaoIaBO.criar(new PredicaoIaRequest(
                request.idArea(),
                request.idAreaCultura(),
                request.idUsuario(),
                LocalDateTime.now(),
                TipoModeloIa.IRRIGACAO,
                "GS-M2 Irrigation Recommendation",
                "joblib",
                toJson(payload),
                toJson(resultado),
                null,
                null,
                resultado.recomendado(),
                resultado.situacao(),
                StatusPredicaoIa.SUCESSO,
                null
        ));

        return new IaIrrigacaoResponse(
                resultado.status(),
                resultado.recomendado(),
                resultado.consumoAtual(),
                resultado.situacao(),
                predicao
        );
    }

    public ChatIaResponse conversar(ChatIaRequest request) {
        try {
            return iaClient.conversar(request);
        } catch (ProcessingException | WebApplicationException exception) {
            throw new IntegracaoIaException("Falha ao consultar o assistente GAIA.", exception);
        }
    }

    private void validarStatusIa(String status, String modelo) {
        if (!"success".equalsIgnoreCase(status)) {
            throw new IntegracaoIaException("A API de IA retornou status inesperado para o modelo de " + modelo + ".");
        }
    }

    private String toJson(Object valor) {
        try {
            return objectMapper.writeValueAsString(valor);
        } catch (JsonProcessingException exception) {
            throw new ValidacaoException("Nao foi possivel serializar os dados da predicao.", exception);
        }
    }
}
