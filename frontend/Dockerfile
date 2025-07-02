# Estágio 1: Build - Constrói a aplicação React
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Production - Serve os arquivos com Nginx
FROM nginx:stable-alpine

# Copia a nossa configuração personalizada do Nginx.
# Como o nginx.conf agora está na mesma pasta do Dockerfile, isso funciona.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos de build do estágio anterior para a pasta do Nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]