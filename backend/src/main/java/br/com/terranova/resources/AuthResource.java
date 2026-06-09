package br.com.terranova.resources;

import br.com.terranova.bo.UsuarioBO;
import br.com.terranova.bo.CadastroPlataformaBO;
import br.com.terranova.dto.request.CadastroPlataformaRequest;
import br.com.terranova.dto.request.LoginRequest;
import br.com.terranova.dto.response.CadastroPlataformaResponse;
import br.com.terranova.dto.response.LoginResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@ApplicationScoped
@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    UsuarioBO usuarioBO;

    @Inject
    CadastroPlataformaBO cadastroPlataformaBO;

    @POST
    @Path("/login")
    public LoginResponse login(@Valid LoginRequest request) {
        return new LoginResponse(usuarioBO.autenticar(request.email(), request.senha()));
    }

    @POST
    @Path("/register")
    public CadastroPlataformaResponse cadastrar(@Valid CadastroPlataformaRequest request) {
        return cadastroPlataformaBO.cadastrar(request);
    }
}
