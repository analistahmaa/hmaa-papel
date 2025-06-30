# Etapa 1: Constrói a aplicação
FROM node:18-alpine as builder

ENV NODE_OPTIONS=--max-old-space-size=4096

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .


# Etapa 2: Usa Nginx pra servir a build
FROM nginx:alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]