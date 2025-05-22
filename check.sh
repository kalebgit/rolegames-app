#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color



echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}        Iniciando RoleGames App Completa            ${NC}"
echo -e "${BLUE}====================================================${NC}"

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null
then
    echo -e "${YELLOW}Docker y/o Docker Compose no están instalados.${NC}"
    echo -e "${YELLOW}Por favor, instálalos antes de continuar.${NC}"
    exit 1
fi

# Crear directorio para datos MySQL si no existe
if [ ! -d "./mysql-data" ]
then
    echo -e "${BLUE}Creando directorio para datos MySQL...${NC}"
    mkdir -p ./mysql-data
    # Asegurar permisos adecuados para MySQL
    chmod 777 ./mysql-data
fi

# Estructura de directorios esperada
if [ ! -d "./backend" ] || [ ! -d "./frontend" ]
then
    echo -e "${YELLOW}Estructura de directorios incorrecta.${NC}"
    echo -e "${YELLOW}Asegúrate de que existan los directorios 'backend' y 'frontend'.${NC}"
    exit 1
fi

# Copiar Dockerfiles si no existen
if [ ! -f "./backend/Dockerfile" ]
then
    echo -e "${BLUE}Creando Dockerfile para el backend...${NC}"
    cp Dockerfile.backend ./backend/Dockerfile
fi

if [ ! -f "./frontend/Dockerfile" ]
then
    echo -e "${BLUE}Creando Dockerfile para el frontend...${NC}"
    cp Dockerfile.frontend ./frontend/Dockerfile
fi

# Iniciar todo
echo -e "${BLUE}Iniciando contenedores...${NC}"
docker-compose up -d

echo -e "\n${GREEN}¡RoleGames está en funcionamiento!${NC}"
echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}Backend: http://localhost:8080${NC}"
echo -e "${GREEN}Base de datos MySQL: localhost:3306${NC}"
echo -e "\n${BLUE}Puedes ver los logs con: docker-compose logs -f${NC}"
