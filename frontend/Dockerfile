# Estágio 1: Build
FROM node:18-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Production
FROM nginx:stable-alpine
# Copia a configuração que está junto com este Dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copia os arquivos de build
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]