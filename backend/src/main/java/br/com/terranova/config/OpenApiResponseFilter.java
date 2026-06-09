package br.com.terranova.config;

import java.util.List;
import java.util.Map;
import java.util.Set;
import org.eclipse.microprofile.openapi.OASFactory;
import org.eclipse.microprofile.openapi.OASFilter;
import org.eclipse.microprofile.openapi.models.Components;
import org.eclipse.microprofile.openapi.models.OpenAPI;
import org.eclipse.microprofile.openapi.models.Operation;
import org.eclipse.microprofile.openapi.models.PathItem;
import org.eclipse.microprofile.openapi.models.Paths;
import org.eclipse.microprofile.openapi.models.media.Content;
import org.eclipse.microprofile.openapi.models.media.MediaType;
import org.eclipse.microprofile.openapi.models.media.Schema;
import org.eclipse.microprofile.openapi.models.responses.APIResponse;
import org.eclipse.microprofile.openapi.models.responses.APIResponses;

public class OpenApiResponseFilter implements OASFilter {

    private static final String JSON = "application/json";
    private static final String API_ERROR_SCHEMA = "#/components/schemas/ApiErrorResponse";
    private static final List<String> SUCCESS_CODES = List.of("200", "201", "202", "204");
    private static final Set<String> POST_OK_PATHS = Set.of(
            "/auth/login",
            "/ia/funcionando"
    );
    private static final Set<String> BODY_REFERENCE_PATHS = Set.of(
            "/alertas",
            "/areas-culturas",
            "/areas-monitoradas",
            "/dados-climaticos",
            "/irrigacoes",
            "/leituras-solo",
            "/predicoes-ia",
            "/propriedades",
            "/recomendacoes",
            "/usuarios",
            "/ia/produtividade",
            "/ia/irrigacao"
    );
    private static final Set<String> CONFLICT_PATHS = Set.of(
            "/auth/register",
            "/usuarios",
            "/usuarios/{id}"
    );
    private static final Set<String> EXTERNAL_INTEGRATION_PATHS = Set.of(
            "/clima/nasa/areas/{idArea}/coletar",
            "/ia/funcionando",
            "/ia/produtividade",
            "/ia/irrigacao"
    );

    @Override
    public void filterOpenAPI(OpenAPI openAPI) {
        if (openAPI == null) {
            return;
        }

        ensureErrorSchema(openAPI);

        Paths paths = openAPI.getPaths();
        if (paths == null || paths.getPathItems() == null) {
            return;
        }

        for (Map.Entry<String, PathItem> entry : paths.getPathItems().entrySet()) {
            configurePath(normalizePath(entry.getKey()), entry.getValue());
        }
    }

    private void configurePath(String path, PathItem item) {
        if (item == null) {
            return;
        }

        configureOperation(path, "GET", item.getGET());
        configureOperation(path, "PUT", item.getPUT());
        configureOperation(path, "POST", item.getPOST());
        configureOperation(path, "PATCH", item.getPATCH());
        configureOperation(path, "DELETE", item.getDELETE());
    }

    private void configureOperation(String path, String method, Operation operation) {
        if (operation == null) {
            return;
        }

        if ("DELETE".equals(method)) {
            setSuccessResponse(operation, "204", "Recurso removido com sucesso, sem corpo de resposta.", false);
        } else if ("POST".equals(method) && createsResource(path)) {
            setSuccessResponse(operation, "201", "Recurso criado com sucesso.", true);
        } else {
            setSuccessResponse(operation, "200", "Operacao realizada com sucesso.", true);
        }

        addErrorResponses(path, operation);
    }

    private boolean createsResource(String path) {
        return !POST_OK_PATHS.contains(path);
    }

    private void setSuccessResponse(Operation operation, String code, String description, boolean allowContent) {
        APIResponses responses = ensureResponses(operation);
        APIResponse response = responses.getAPIResponse(code);
        if (response == null) {
            response = firstExistingSuccessResponse(responses);
        }
        if (response == null) {
            response = OASFactory.createAPIResponse();
        }

        response.setDescription(description);
        if (!allowContent) {
            response.setContent(null);
        }

        responses.addAPIResponse(code, response);
        for (String successCode : SUCCESS_CODES) {
            if (!successCode.equals(code)) {
                responses.removeAPIResponse(successCode);
            }
        }
    }

    private APIResponse firstExistingSuccessResponse(APIResponses responses) {
        for (String code : SUCCESS_CODES) {
            APIResponse response = responses.getAPIResponse(code);
            if (response != null) {
                return response;
            }
        }
        return null;
    }

    private void addErrorResponses(String path, Operation operation) {
        APIResponses responses = ensureResponses(operation);
        addErrorResponse(responses, "400", "Requisicao invalida ou dados de entrada inconsistentes.");

        if ("/auth/login".equals(path)) {
            addErrorResponse(responses, "401", "Credenciais invalidas ou ausentes.");
        }

        if (hasPathParameter(path) || BODY_REFERENCE_PATHS.contains(path)) {
            addErrorResponse(responses, "404", "Recurso relacionado nao encontrado.");
        }

        if (CONFLICT_PATHS.contains(path)) {
            addErrorResponse(responses, "409", "Conflito com o estado atual do recurso.");
        }

        addErrorResponse(responses, "500", "Erro interno ao processar a requisicao.");

        if (EXTERNAL_INTEGRATION_PATHS.contains(path)) {
            addErrorResponse(responses, "502", "Falha ao consultar servico externo.");
        }
    }

    private boolean hasPathParameter(String path) {
        return path != null && path.contains("{");
    }

    private void addErrorResponse(APIResponses responses, String code, String description) {
        if (responses.getAPIResponse(code) != null) {
            return;
        }
        responses.addAPIResponse(code, errorResponse(description));
    }

    private APIResponses ensureResponses(Operation operation) {
        APIResponses responses = operation.getResponses();
        if (responses == null) {
            responses = OASFactory.createAPIResponses();
            operation.setResponses(responses);
        }
        return responses;
    }

    private APIResponse errorResponse(String description) {
        Schema schema = OASFactory.createSchema().ref(API_ERROR_SCHEMA);
        MediaType mediaType = OASFactory.createMediaType().schema(schema);
        Content content = OASFactory.createContent().addMediaType(JSON, mediaType);
        return OASFactory.createAPIResponse()
                .description(description)
                .content(content);
    }

    private void ensureErrorSchema(OpenAPI openAPI) {
        Components components = openAPI.getComponents();
        if (components == null) {
            components = OASFactory.createComponents();
            openAPI.setComponents(components);
        }
        if (components.getSchemas() != null && components.getSchemas().containsKey("ApiErrorResponse")) {
            return;
        }

        Schema schema = OASFactory.createSchema()
                .addType(Schema.SchemaType.OBJECT)
                .addProperty("status", schema(Schema.SchemaType.INTEGER, "int32"))
                .addProperty("erro", schema(Schema.SchemaType.STRING, null))
                .addProperty("mensagem", schema(Schema.SchemaType.STRING, null))
                .addProperty("caminho", schema(Schema.SchemaType.STRING, null))
                .addProperty("timestamp", schema(Schema.SchemaType.STRING, "date-time"));
        components.addSchema("ApiErrorResponse", schema);
    }

    private Schema schema(Schema.SchemaType type, String format) {
        Schema schema = OASFactory.createSchema().addType(type);
        if (format != null) {
            schema.setFormat(format);
        }
        return schema;
    }

    private String normalizePath(String path) {
        if (path == null) {
            return "";
        }
        return path.replaceAll("\\{([^}:]+):[^}]+}", "{$1}");
    }
}
