# ========================================
# DOCKERFILE SIMPLE CON BOOTRUN
# ========================================

FROM gradle:8.5-jdk17

WORKDIR /app

# Copiar archivos de configuración primero (para cache de Docker)
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle.kts .
COPY settings.gradle.kts .

# Hacer ejecutable el wrapper
RUN chmod +x ./gradlew

# Descargar dependencias (esto se cachea si no cambian)
RUN ./gradlew dependencies --no-daemon || true

# Copiar código fuente
COPY src/ src/

# Exponer puerto
EXPOSE 8080

# Ejecutar directamente con bootRun
CMD ["./gradlew", "bootRun", "--no-daemon"]
