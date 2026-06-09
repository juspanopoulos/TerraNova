package br.com.terranova.resources;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

@QuarkusTest
class HealthResourceTest {

    @Test
    void deveRetornarStatusDaApi() {
        given()
                .when().get("/api/health")
                .then()
                .statusCode(200)
                .body("status", equalTo("UP"))
                .body("service", equalTo("terranova-api"));
    }
}
