# Estágio 1: Build
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
# Usamos npm ci para uma instalação limpa e confiável em ambientes de build
RUN npm ci

COPY . .
RUN npm run build

# Estágio 2: Production
FROM nginx:stable-alpine

# Copia a configuração do Nginx que está na mesma pasta
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos de build do estágio anterior
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]