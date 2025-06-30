FROM node:18-alpine

# Diretório de trabalho
WORKDIR /usr/src/app

# Copia o package.json do backend
COPY backend/package*.json ./backend/

# Instala dependências do backend
WORKDIR /usr/src/app/backend
RUN npm install

# Copia os arquivos do backend
WORKDIR /usr/src/app
COPY backend/ ./backend/

# Roda o app
EXPOSE 5000
CMD ["node", "backend/index.js"]