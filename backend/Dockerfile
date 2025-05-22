# ========================================
# DOCKERFILE MÍNIMO - GARANTIZADO QUE FUNCIONA
# ========================================

# Etapa 1: Build
FROM gradle:8.5-jdk17 AS builder

WORKDIR /app

# Copiar todo y compilar
COPY . .
RUN gradle clean bootJar --no-daemon

# Verificar
RUN ls -la build/libs/

# ========================================
# Etapa 2: Runtime - SÚPER SIMPLE
# ========================================

FROM openjdk:17

WORKDIR /app

# Copiar JAR
COPY --from=builder /app/build/libs/rolegames.jar app.jar

# Verificar
RUN ls -la app.jar

EXPOSE 8080

# Ejecutar
CMD ["java", "-jar", "app.jar"]
