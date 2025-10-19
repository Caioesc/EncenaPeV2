# EncenaPe Backend

Backend Spring Boot para a plataforma EncenaPe.

## Tecnologias

- Java 17
- Spring Boot 3.2
- Spring Security + JWT
- MySQL 8.0
- Flyway

## Como executar

### Com Maven
```bash
mvn spring-boot:run
```

### Com Docker
```bash
docker build -t encenape-backend .
docker run -p 8080:8080 encenape-backend
```

## Configuração

Edite `src/main/resources/application.yml` com suas configurações.

## Endpoints

API documentada em: http://localhost:8080/swagger-ui.html
