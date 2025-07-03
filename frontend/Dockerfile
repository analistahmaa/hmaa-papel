# Estágio 1: Build do Frontend React
FROM node:18 AS build

WORKDIR /app

# Copia package.json e package-lock.json do contexto de build (que é a pasta frontend)
COPY package*.json ./

# Usamos npm ci para uma instalação limpa e confiável em ambientes de build
RUN npm ci

# Copia o restante do código do frontend para o WORKDIR /app
COPY . .

# Executa o build do aplicativo React
# Isso criará a pasta 'build' dentro de /app
RUN npm run build

# Estágio 2: Production com Nginx
FROM nginx:stable-alpine

# Copia a configuração do Nginx que está na mesma pasta do Dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos de build do estágio anterior (que estão em /app/build)
# para o diretório de serviço do Nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]