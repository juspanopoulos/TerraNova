package br.com.terranova.bo;

import br.com.terranova.dao.AreaMonitoradaDAO;
import br.com.terranova.dao.DadoClimaticoDAO;
import br.com.terranova.dto.request.DadoClimaticoRequest;
import br.com.terranova.dto.response.DadoClimaticoResponse;
import br.com.terranova.entities.DadoClimatico;
import br.com.terranova.enums.FonteApi;
import br.com.terranova.exceptions.EntidadeNaoEncontradaException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class DadoClimaticoBO {

    @Inject
    DadoClimaticoDAO dadoClimaticoDAO;

    @Inject
    AreaMonitoradaDAO areaMonitoradaDAO;

    public List<DadoClimaticoResponse> listar() {
        return dadoClimaticoDAO.listar().stream().map(this::toResponse).toList();
    }

    public List<DadoClimaticoResponse> listarHistoricoPorArea(Long idArea) {
        validarArea(idArea);
        return dadoClimaticoDAO.buscarHistoricoPorArea(idArea).stream().map(this::toResponse).toList();
    }

    public DadoClimaticoResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    DadoClimatico buscarEntidade(Long id) {
        BoUtils.validarId(id, "idDado");
        return BoUtils.obterOuFalhar(dadoClimaticoDAO.buscarPorId(id), "Dado climatico", id);
    }

    public DadoClimaticoResponse criar(DadoClimaticoRequest request) {
        validarArea(request.idArea());
        return toResponse(dadoClimaticoDAO.inserir(toEntity(request)));
    }

    public DadoClimaticoResponse atualizar(Long id, DadoClimaticoRequest request) {
        buscarEntidade(id);
        validarArea(request.idArea());
        DadoClimatico dado = toEntity(request);
        dado.setIdDado(id);
        return toResponse(dadoClimaticoDAO.atualizar(dado));
    }

    public void deletar(Long id) {
        buscarEntidade(id);
        if (!dadoClimaticoDAO.deletar(id)) {
            throw new EntidadeNaoEncontradaException("Dado climatico nao encontrado para exclusao.");
        }
    }

    private void validarArea(Long idArea) {
        BoUtils.validarId(idArea, "idArea");
        BoUtils.obterOuFalhar(areaMonitoradaDAO.buscarPorId(idArea), "Area monitorada", idArea);
    }

    private DadoClimatico toEntity(DadoClimaticoRequest request) {
        BoUtils.valorObrigatorio(request.temperatura(), "temperatura");
        BoUtils.validarIntervalo(request.temperatura(), BigDecimal.valueOf(-100), BigDecimal.valueOf(80), "temperatura");
        BoUtils.percentualObrigatorio(request.umidade(), "umidade");
        BoUtils.validarNaoNegativo(request.precipitacao(), "precipitacao");
        BoUtils.validarNaoNegativo(request.indiceUv(), "indiceUv");
        BoUtils.validarNaoNegativo(request.velocidadeVentoKmh(), "velocidadeVentoKmh");
        BoUtils.validarNaoNegativo(request.radiacaoSolar(), "radiacaoSolar");

        LocalDateTime dataColeta = BoUtils.dataHoraOuAgora(request.dataColeta());

        DadoClimatico dado = new DadoClimatico();
        dado.setIdArea(request.idArea());
        dado.setDataColeta(dataColeta);
        dado.setDataReferencia(request.dataReferencia() == null ? dataColeta.toLocalDate() : request.dataReferencia());
        dado.setTemperatura(request.temperatura());
        dado.setUmidade(request.umidade());
        dado.setPrecipitacao(request.precipitacao());
        dado.setIndiceUv(request.indiceUv());
        dado.setVelocidadeVentoKmh(request.velocidadeVentoKmh());
        dado.setRadiacaoSolar(request.radiacaoSolar());
        dado.setFonteApi(request.fonteApi() == null ? FonteApi.MANUAL : request.fonteApi());
        return dado;
    }

    private DadoClimaticoResponse toResponse(DadoClimatico dado) {
        return new DadoClimaticoResponse(
                dado.getIdDado(),
                dado.getIdArea(),
                dado.getDataColeta(),
                dado.getDataReferencia(),
                dado.getTemperatura(),
                dado.getUmidade(),
                dado.getPrecipitacao(),
                dado.getIndiceUv(),
                dado.getVelocidadeVentoKmh(),
                dado.getRadiacaoSolar(),
                dado.getFonteApi()
        );
    }
}
