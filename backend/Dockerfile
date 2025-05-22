FROM gradle:8.5-jdk17 AS build

WORKDIR /app

# Copiar archivos de configuración de Gradle primero para aprovechar la cache de Docker
COPY build.gradle settings.gradle gradle.properties* ./
COPY gradle/ ./gradle/

# Descargar dependencias
RUN gradle dependencies --no-daemon

# Copiar código fuente y compilar
COPY src ./src
RUN gradle bootJar --no-daemon

# Configurar imagen final
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copiar el JAR compilado
COPY --from=build /app/build/libs/*.jar app.jar

# Puerto donde se ejecutará la aplicación
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
