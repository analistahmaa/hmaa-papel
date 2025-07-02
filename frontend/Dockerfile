# Estágio 1: Construir a aplicação React
FROM node:18-alpine AS build

WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package.json package-lock.json ./
RUN npm install

# Copia o resto do código-fonte
COPY . .

# Gera os arquivos estáticos de produção na pasta /build
RUN npm run build


# Estágio 2: Servir a aplicação com Nginx
FROM nginx:stable-alpine

# Copia SOMENTE os arquivos estáticos gerados no estágio 'build' para a pasta do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expõe a porta 80, que o Nginx usa por padrão
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]