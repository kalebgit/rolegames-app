#!/bin/bash

echo "➡️  Entrando al directorio backend..."
cd backend || { echo "❌ No se pudo acceder a backend"; exit 1; }

echo "🔙 Volviendo al directorio original..."
cd ..

echo "⚙️  Ejecutando Gradle Wrapper..."
./gradlew wrapper || { echo "❌ Error al ejecutar Gradle Wrapper"; exit 1; }

echo "🧹 Eliminando carpeta mysql-data..."
rm -rf mysql-data

echo "🐳 Levantando contenedores backend y mysql..."
docker compose up -d backend mysql

echo "🧵 Abriendo nueva terminal para instalar librerías frontend (zustand, react-toastify)..."
gnome-terminal -- bash -c "docker compose exec frontend sh -c 'npm install zustand react-toastify'; exec bash"

echo "📄 Abriendo nueva terminal para mostrar la documentación y la URL del frontend..."
gnome-terminal -- bash -c '
echo "🧾 Documentación de los servicios disponibles:"; 
docker compose ps; 
echo "";
echo "🌐 El frontend está disponible en: http://localhost:3000"; 
exec bash
'

