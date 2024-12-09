# Etapa 1: Construcción
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios para la instalación de dependencias
COPY package*.json ./
COPY . .

# Instalar dependencias y compilar Storybook
RUN npm install --frozen-lockfile
RUN npm run build-storybook

# Etapa 2: Servidor
FROM nginx:stable-alpine

# Copiar los artefactos compilados desde la etapa de construcción
COPY --from=builder /app/storybook-static /usr/share/nginx/html

# Exponer el puerto 80 para servir Storybook
EXPOSE 80

# Comando para iniciar el servidor
CMD ["nginx", "-g", "daemon off;"]
