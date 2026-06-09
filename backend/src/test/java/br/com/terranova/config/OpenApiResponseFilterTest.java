package br.com.terranova.config;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.eclipse.microprofile.openapi.OASFactory;
import org.eclipse.microprofile.openapi.models.OpenAPI;
import org.eclipse.microprofile.openapi.models.Operation;
import org.eclipse.microprofile.openapi.models.PathItem;
import org.eclipse.microprofile.openapi.models.Paths;
import org.eclipse.microprofile.openapi.models.responses.APIResponse;
import org.eclipse.microprofile.openapi.models.responses.APIResponses;
import org.junit.jupiter.api.Test;

class OpenApiResponseFilterTest {

    private final OpenApiResponseFilter filter = new OpenApiResponseFilter();

    @Test
    void deveDocumentarPostDeCriacaoComo201() {
        APIResponses responses = responsesFor("/usuarios", pathItem().POST(operation()), PathItem::getPOST);

        assertNotNull(responses.getAPIResponse("201"));
        assertNull(responses.getAPIResponse("200"));
        assertNotNull(responses.getAPIResponse("400"));
        assertNotNull(responses.getAPIResponse("404"));
        assertNotNull(responses.getAPIResponse("409"));
        assertNotNull(responses.getAPIResponse("500"));
    }

    @Test
    void deveDocumentarDeleteComo204Sem200() {
        APIResponses responses = responsesFor("/usuarios/{id}", pathItem().DELETE(operation()), PathItem::getDELETE);

        assertNotNull(responses.getAPIResponse("204"));
        assertNull(responses.getAPIResponse("200"));
        assertNull(responses.getAPIResponse("204").getContent());
        assertNotNull(responses.getAPIResponse("404"));
    }

    @Test
    void deveManterLoginComo200Com401Possivel() {
        APIResponses responses = responsesFor("/auth/login", pathItem().POST(operation()), PathItem::getPOST);

        assertNotNull(responses.getAPIResponse("200"));
        assertNull(responses.getAPIResponse("201"));
        assertNotNull(responses.getAPIResponse("401"));
    }

    @Test
    void deveDiferenciarPostDeProcessamentoEPostComPersistencia() {
        APIResponses chatResponses = responsesFor("/ia/chat", pathItem().POST(operation()), PathItem::getPOST);
        APIResponses predictionResponses = responsesFor("/ia/produtividade", pathItem().POST(operation()), PathItem::getPOST);

        assertNotNull(chatResponses.getAPIResponse("200"));
        assertNull(chatResponses.getAPIResponse("201"));
        assertNotNull(chatResponses.getAPIResponse("502"));

        assertNotNull(predictionResponses.getAPIResponse("201"));
        assertNull(predictionResponses.getAPIResponse("200"));
        assertNotNull(predictionResponses.getAPIResponse("404"));
        assertNotNull(predictionResponses.getAPIResponse("502"));
    }

    private APIResponses responsesFor(String path, PathItem pathItem, OperationSelector selector) {
        Paths paths = OASFactory.createPaths().addPathItem(path, pathItem);
        OpenAPI openAPI = OASFactory.createOpenAPI().paths(paths);

        filter.filterOpenAPI(openAPI);

        return selector.select(openAPI.getPaths().getPathItem(path)).getResponses();
    }

    private PathItem pathItem() {
        return OASFactory.createPathItem();
    }

    private Operation operation() {
        APIResponse response = OASFactory.createAPIResponse().description("Auto-generated");
        return OASFactory.createOperation()
                .responses(OASFactory.createAPIResponses().addAPIResponse("200", response));
    }

    @FunctionalInterface
    private interface OperationSelector {
        Operation select(PathItem pathItem);
    }
}
