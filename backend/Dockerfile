# syntax=docker/dockerfile:1

FROM maven:3.9.15-eclipse-temurin-25 AS build

WORKDIR /workspace

COPY pom.xml .
COPY src ./src

RUN mvn -B -ntp package -DskipTests

FROM eclipse-temurin:25-jre

WORKDIR /app

ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV PORT=8080

COPY --from=build /workspace/target/quarkus-app/lib/ ./lib/
COPY --from=build /workspace/target/quarkus-app/*.jar ./
COPY --from=build /workspace/target/quarkus-app/app/ ./app/
COPY --from=build /workspace/target/quarkus-app/quarkus/ ./quarkus/

EXPOSE 8080

CMD ["sh", "-c", "java $JAVA_OPTS -Dquarkus.http.host=0.0.0.0 -Dquarkus.http.port=${PORT:-8080} -jar quarkus-run.jar"]
