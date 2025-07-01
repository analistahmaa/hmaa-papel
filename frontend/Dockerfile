# Estágio 1: Construir a aplicação React
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copia os arquivos de dependência e instala
COPY package.json package-lock.json ./
RUN npm install

# Copia o resto do código-fonte
COPY . .

# Gera os arquivos estáticos de produção na pasta /build
RUN npm run build


# Estágio 2: Servir a aplicação com Nginx
FROM nginx:1.27-alpine

# Copia a configuração do Nginx que criamos (para lidar com as rotas do React)
# Vamos precisar criar este arquivo
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos gerados no estágio 'builder' para a pasta do Nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Expõe a porta 80, que o Nginx usa por padrão
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]