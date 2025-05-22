#!/bin/bash

# =================================================================
# SCRIPT DE BUILD Y DEPLOYMENT PARA ROLEGAMES
# =================================================================

set -e  # Salir si hay errores

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# =================================================================
# VERIFICACIONES INICIALES
# =================================================================

log "Iniciando proceso de build para RoleGames..."

# Verificar que Docker está instalado y funcionando
if ! command -v docker &> /dev/null; then
    error "Docker no está instalado o no está en PATH"
fi

if ! docker info &> /dev/null; then
    error "Docker no está funcionando. ¿Está el servicio iniciado?"
fi

# Verificar que Docker Compose está disponible
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    error "Docker Compose no está instalado"
fi

# =================================================================
# FUNCIONES DE BUILD
# =================================================================

# Función para build local de backend (sin Docker)
build_backend_local() {
    log "Compilando backend localmente..."
    
    cd backend
    
    # Verificar que Gradle wrapper existe
    if [ ! -f "./gradlew" ]; then
        error "Gradle wrapper no encontrado en backend/"
    fi
    
    # Hacer ejecutable el wrapper
    chmod +x ./gradlew
    
    # Limpiar build anterior
    log "Limpiando build anterior..."
    ./gradlew clean
    
    # Compilar
    log "Compilando aplicación..."
    ./gradlew bootJar --no-daemon --info
    
    # Verificar que el JAR se creó
    if [ ! -f "build/libs/*.jar" ]; then
        error "No se pudo crear el JAR"
    fi
    
    JAR_FILE=$(ls build/libs/*.jar)
    success "JAR creado exitosamente: $JAR_FILE"
    
    cd ..
}

# Función para test del backend
test_backend() {
    log "Ejecutando tests del backend..."
    
    cd backend
    ./gradlew test --no-daemon
    
    if [ $? -eq 0 ]; then
        success "Todos los tests pasaron"
    else
        warning "Algunos tests fallaron, continuando..."
    fi
    
    cd ..
}

# Función para build de frontend
build_frontend_local() {
    log "Compilando frontend localmente..."
    
    cd frontend
    
    # Verificar que npm está instalado
    if ! command -v npm &> /dev/null; then
        error "npm no está instalado"
    fi
    
    # Instalar dependencias
    log "Instalando dependencias..."
    npm install
    
    # Build de producción
    log "Creando build de producción..."
    npm run build
    
    success "Frontend compilado exitosamente"
    
    cd ..
}

# =================================================================
# FUNCIONES DE DOCKER
# =================================================================

# Función para build con Docker
build_with_docker() {
    log "Construyendo imágenes Docker..."
    
    # Build sin cache para asegurar build limpio
    docker-compose build --no-cache
    
    success "Imágenes Docker construidas exitosamente"
}

# Función para iniciar servicios
start_services() {
    log "Iniciando servicios..."
    
    # Crear volúmenes si no existen
    docker volume create rolegames_mysql_data 2>/dev/null || true
    
    # Iniciar en modo detached
    docker-compose up -d
    
    # Esperar a que los servicios estén listos
    log "Esperando a que los servicios estén listos..."

    if ! command -v timeout &> /dev/null; then
      install_timeout
    fi 
    # Esperar MySQL
    log "Esperando MySQL..."
    timeout 60 bash -c 'until docker-compose exec mysql mysqladmin ping -h localhost --silent; do sleep 2; done'
    
    # Esperar Backend
    log "Esperando Backend..."
    timeout 120 bash -c 'until curl -f http://localhost:8080/api/hello &>/dev/null; do sleep 2; done'
    
    # Esperar Frontend
    log "Esperando Frontend..."
    timeout 60 bash -c 'until curl -f http://localhost:3000 &>/dev/null; do sleep 2; done'
    
    success "Todos los servicios están listos!"
    echo
    echo "==================================================================="
    echo "🎮 RoleGames está funcionando!"
    echo "Frontend: http://localhost:3000"
    echo "Backend:  http://localhost:8080"
    echo "API Test: http://localhost:8080/api/hello"
    echo "==================================================================="
}

# Función para detener servicios
stop_services() {
    log "Deteniendo servicios..."
    docker-compose down
    success "Servicios detenidos"
}

# Función para limpiar todo
clean_all() {
    log "Limpiando contenedores, imágenes y volúmenes..."
    
    docker-compose down -v --rmi all --remove-orphans
    docker system prune -f
    
    success "Limpieza completada"
}

# Función para mostrar logs
show_logs() {
    log "Mostrando logs de servicios..."
    docker-compose logs -f
}

# Función para reiniciar solo el backend
restart_backend() {
    log "Reiniciando backend..."
    docker-compose restart backend
    success "Backend reiniciado"
}

install_timeout() {
    echo "timeout no encontrado. Instalando..."
    
    if command -v apt-get &> /dev/null; then
        apt-get update && apt-get install -y coreutils
    elif command -v yum &> /dev/null; then
        yum install -y coreutils
    elif command -v apk &> /dev/null; then
        apk add --no-cache coreutils
    else
        echo "No se pudo instalar timeout automáticamente"
        return 1
    fi
}

# =================================================================
# MENÚ PRINCIPAL
# =================================================================

show_help() {
    echo "Uso: $0 [OPCIÓN]"
    echo ""
    echo "Opciones disponibles:"
    echo "  build-local     Compilar backend y frontend localmente"
    echo "  build-docker    Compilar con Docker"
    echo "  start           Iniciar todos los servicios"
    echo "  stop            Detener todos los servicios"
    echo "  restart         Reiniciar todos los servicios"
    echo "  restart-backend Reiniciar solo el backend"
    echo "  logs            Mostrar logs en tiempo real"
    echo "  test            Ejecutar tests"
    echo "  clean           Limpiar todo (contenedores, imágenes, volúmenes)"
    echo "  full-deploy     Build completo + inicio de servicios"
    echo "  help            Mostrar esta ayuda"
    echo ""
}

# =================================================================
# PROCESAMIENTO DE ARGUMENTOS
# =================================================================

case "${1:-help}" in
    "build-local")
        build_backend_local
        build_frontend_local
        ;;
    "build-docker")
        build_with_docker
        ;;
    "start")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        build_with_docker
        start_services
        ;;
    "restart-backend")
        restart_backend
        ;;
    "logs")
        show_logs
        ;;
    "test")
        test_backend
        ;;
    "clean")
        clean_all
        ;;
    "full-deploy")
        log "Iniciando deployment completo..."
        clean_all
        build_with_docker
        start_services
        ;;
    "help"|*)
        show_help
        ;;
esac
