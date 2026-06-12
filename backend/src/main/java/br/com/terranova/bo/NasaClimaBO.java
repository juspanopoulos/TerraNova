package br.com.terranova.bo;

import br.com.terranova.client.NasaPowerClient;
import br.com.terranova.dao.AreaMonitoradaDAO;
import br.com.terranova.dao.PropriedadeDAO;
import br.com.terranova.dto.integration.nasa.NasaPowerResponse;
import br.com.terranova.dto.request.DadoClimaticoRequest;
import br.com.terranova.dto.response.DadoClimaticoResponse;
import br.com.terranova.dto.response.clima.ColetaNasaResponse;
import br.com.terranova.entities.AreaMonitorada;
import br.com.terranova.entities.Propriedade;
import br.com.terranova.enums.FonteApi;
import br.com.terranova.exceptions.IntegracaoClimaException;
import br.com.terranova.exceptions.ValidacaoException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.WebApplicationException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import org.eclipse.microprofile.rest.client.inject.RestClient;

@ApplicationScoped
public class NasaClimaBO {

    private static final String PARAMETROS = "T2M,RH2M,PRECTOTCORR,ALLSKY_SFC_UVA,WS2M,ALLSKY_SFC_SW_DWN";
    private static final BigDecimal NASA_MISSING_VALUE = BigDecimal.valueOf(-999);
    private static final BigDecimal MPS_TO_KMH = BigDecimal.valueOf(3.6);
    private static final ZoneId DATA_REFERENCIA_ZONE = ZoneId.of("America/Sao_Paulo");
    private static final ZoneOffset DATA_COLETA_ZONE = ZoneOffset.UTC;

    @Inject
    @RestClient
    NasaPowerClient nasaPowerClient;

    @Inject
    AreaMonitoradaDAO areaMonitoradaDAO;

    @Inject
    PropriedadeDAO propriedadeDAO;

    @Inject
    DadoClimaticoBO dadoClimaticoBO;

    public ColetaNasaResponse coletarEPersistir(Long idArea, LocalDate dataReferencia) {
        BoUtils.validarId(idArea, "idArea");
        AreaMonitorada area = BoUtils.obterOuFalhar(areaMonitoradaDAO.buscarPorId(idArea), "Area monitorada", idArea);
        Propriedade propriedade = BoUtils.obterOuFalhar(
                propriedadeDAO.buscarPorId(area.getIdPropriedade()), "Propriedade", area.getIdPropriedade());
        validarCoordenadas(propriedade);

        LocalDate dataConsulta = dataReferencia == null ? LocalDate.now(DATA_REFERENCIA_ZONE).minusDays(5) : dataReferencia;
        DadoClimaticoResponse dadoExistente = dadoClimaticoBO
                .buscarPorAreaDataReferenciaFonte(idArea, dataConsulta, FonteApi.NASA)
                .orElse(null);
        if (dadoExistente != null) {
            return new ColetaNasaResponse(
                    idArea,
                    dataConsulta,
                    propriedade.getLatitude(),
                    propriedade.getLongitude(),
                    dadoExistente
            );
        }

        String dataNasa = dataConsulta.format(DateTimeFormatter.BASIC_ISO_DATE);

        NasaPowerResponse resposta;
        try {
            resposta = nasaPowerClient.buscarDadosDiarios(
                    PARAMETROS,
                    "AG",
                    propriedade.getLongitude().toPlainString(),
                    propriedade.getLatitude().toPlainString(),
                    dataNasa,
                    dataNasa,
                    "JSON"
            );
        } catch (ProcessingException | WebApplicationException exception) {
            throw new IntegracaoClimaException("Falha ao consultar a NASA POWER.", exception);
        }

        Map<String, Map<String, BigDecimal>> parametros = extrairParametros(resposta);
        BigDecimal ventoMs = valor(parametros, "WS2M", dataNasa, false);
        BigDecimal ventoKmh = ventoMs == null ? null : arredondar(ventoMs.multiply(MPS_TO_KMH));

        DadoClimaticoResponse dadoPersistido = dadoClimaticoBO.criar(new DadoClimaticoRequest(
                idArea,
                LocalDateTime.now(DATA_COLETA_ZONE),
                dataConsulta,
                valor(parametros, "T2M", dataNasa, true),
                valor(parametros, "RH2M", dataNasa, true),
                valor(parametros, "PRECTOTCORR", dataNasa, false),
                valor(parametros, "ALLSKY_SFC_UVA", dataNasa, false),
                ventoKmh,
                valor(parametros, "ALLSKY_SFC_SW_DWN", dataNasa, false),
                FonteApi.NASA
        ));

        return new ColetaNasaResponse(
                idArea,
                dataConsulta,
                propriedade.getLatitude(),
                propriedade.getLongitude(),
                dadoPersistido
        );
    }

    private void validarCoordenadas(Propriedade propriedade) {
        if (propriedade.getLatitude() == null || propriedade.getLongitude() == null) {
            throw new ValidacaoException("A propriedade da area precisa ter latitude e longitude para coleta NASA.");
        }
    }

    private Map<String, Map<String, BigDecimal>> extrairParametros(NasaPowerResponse resposta) {
        if (resposta == null || resposta.properties() == null || resposta.properties().parameter() == null) {
            throw new IntegracaoClimaException("A NASA POWER retornou resposta sem parametros climaticos.");
        }
        return resposta.properties().parameter();
    }

    private BigDecimal valor(Map<String, Map<String, BigDecimal>> parametros, String parametro, String data, boolean obrigatorio) {
        BigDecimal valor = null;
        if (parametros.containsKey(parametro)) {
            valor = parametros.get(parametro).get(data);
        }
        if (valor == null || valor.compareTo(NASA_MISSING_VALUE) == 0) {
            if (obrigatorio) {
                throw new IntegracaoClimaException("Parametro NASA indisponivel: " + parametro + ".");
            }
            return null;
        }
        return arredondar(valor);
    }

    private BigDecimal arredondar(BigDecimal valor) {
        return valor.setScale(2, RoundingMode.HALF_UP);
    }
}
