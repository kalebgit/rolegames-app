FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias primero para aprovechar la cache de Docker
COPY package.json package-lock.json* ./
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Puerto donde se ejecutará la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

