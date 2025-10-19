# Multi-stage build para otimizar o tamanho da imagem
FROM maven:3.9.5-openjdk-17-slim AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração do Maven
COPY pom.xml .
COPY src ./src

# Baixar dependências (cache layer)
RUN mvn dependency:go-offline -B

# Compilar a aplicação
RUN mvn clean package -DskipTests

# Imagem final
FROM openjdk:17-jre-slim

# Instalar dependências necessárias
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Criar usuário não-root
RUN groupadd -r encenape && useradd -r -g encenape encenape

# Definir diretório de trabalho
WORKDIR /app

# Copiar o JAR da aplicação
COPY --from=build /app/target/*.jar app.jar

# Alterar propriedade dos arquivos
RUN chown -R encenape:encenape /app

# Mudar para usuário não-root
USER encenape

# Expor porta
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# Comando para executar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
