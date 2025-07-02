# Estágio 1: Build - Usando uma imagem Debian-based mais robusta
FROM node:18-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# O comando de build agora será lido do package.json modificado
RUN npm run build


# Estágio 2: Production - Servindo com Nginx
FROM nginx:stable-alpine

# Copia a configuração do proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos de build do estágio anterior
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]