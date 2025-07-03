# Estágio 1: Build
# Usando a imagem Node completa para máxima compatibilidade, não a 'slim' ou 'alpine'
FROM node:18 AS build

WORKDIR /app

# Copia os manifestos de pacotes
COPY package.json package-lock.json ./

# Limpa o cache do npm e instala as dependências de forma limpa
# O '--verbose' nos dará mais logs se falhar.
RUN npm cache clean --force && npm install --verbose

# Copia o resto do código
COPY . .

# Comando de diagnóstico: Lista os arquivos no diretório para garantir que tudo foi copiado
RUN ls -la

# Executa o build
RUN npm run build

# Estágio 2: Production
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# A configuração do Nginx virá do docker-compose se necessário, ou podemos adicionar aqui
# Por enquanto, vamos focar em fazer o build passar.
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]