# backend/Dockerfile

FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# ==========================================================
#           ADICIONANDO O SCRIPT "WAIT-FOR-IT"
# ==========================================================
# Copia o script para dentro da imagem
COPY wait-for-it.sh ./

# Dá permissão de execução para o script
RUN chmod +x ./wait-for-it.sh

# A porta que a aplicação Node vai usar
EXPOSE 5000

# O comando de início será definido no docker-compose.yml
# CMD ["node", "index.js"]