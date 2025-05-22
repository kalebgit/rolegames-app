FROM node:18-alpine

WORKDIR /app

# para poder instalar npm
RUN mkdir -p ~/.npm-global
RUN npm config set prefix '~/.npm-global'
RUN export PATH="$HOME/.npm-global/bin:$PATH" >> ~/.bashrc
RUN source ~/.bashrc



# Actualizar npm a la última versión
RUN npm install -g npm

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Verificar contenido de package.json
RUN cat package.json

# Limpiar cache de npm
RUN npm cache clean --force

# Instalar dependencias incluyendo devDependencies
RUN npm install

# Verificar que vite se instaló correctamente
RUN ls -la node_modules/.bin/
RUN npm list vite || echo "Vite no está en la lista"
ENV PATH /app/node_modules/.bin:$PATH

# Copiar el resto del código fuente
COPY . .

# Puerto donde se ejecutará la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
