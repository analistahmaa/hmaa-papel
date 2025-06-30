# Etapa 1: Constrói a aplicação
FROM node:18-alpine as builder

ENV NODE_OPTIONS=--max-old-space-size=4096

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
