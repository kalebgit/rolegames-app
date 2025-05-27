# 📦 Manual de Instalación y Ejecución

Este proyecto utiliza contenedores Docker para facilitar la ejecución de los servicios de backend, base de datos y frontend. A continuación, se describen los pasos necesarios para preparar el entorno y ejecutar el sistema.

---

## ✅ Requisitos Previos

- [Docker](https://www.docker.com/) instalado en el sistema.
- (Opcional) En Linux/macOS, tener `gnome-terminal`, `konsole`, u otro emulador de terminal compatible.

---

## 🚀 Instrucciones para Linux/macOS

1. Abre una terminal y navega al directorio raíz del proyecto.
2. Asegúrate de que el archivo `run.sh` tenga permisos de ejecución:
```bash
   chmod +x run.sh

```
 ¿Qué hace el script run.sh?
1. Entra en el directorio backend y luego regresa.
2. Ejecuta el Gradle Wrapper (./gradlew wrapper).
3. Elimina el directorio mysql-data.
4. Inicia solo los contenedores backend y mysql usando Docker Compose.
5. Abre una nueva terminal para instalar las dependencias zustand y react-toastify en el frontend.
6. Abre otra terminal con la documentación del estado de los contenedores y la URL del frontend.

## 🪟 Instrucciones para Windows
1. Abre el símbolo del sistema (cmd) y navega al directorio raíz del proyecto.
2. Ejecuta el script:
```cmd
run.bat
```
📌 ¿Qué hace el script run.bat?
1. Entra en el directorio backend y luego regresa.
2. Ejecuta el Gradle Wrapper (gradlew wrapper).
3. Elimina la carpeta mysql-data.
4. Inicia solo los contenedores backend y mysql con Docker Compose.
5. Abre una nueva terminal que instala las dependencias zustand y react-toastify en el frontend.
6. Abre otra terminal con la documentación del estado de los servicios y la URL del frontend (http://localhost:3000).


## URL del Frontend
Una vez que el entorno esté en ejecución, puedes acceder al frontend desde:
```txt

http://localhost:3000

```


