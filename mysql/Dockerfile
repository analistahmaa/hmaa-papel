# mysql/Dockerfile

# Comece com a imagem oficial do MySQL
FROM mysql:8.0

# Copie nosso script SQL para a pasta de inicialização dentro da imagem
# Isso garante que ele será executado na primeira inicialização
COPY init.sql /docker-entrypoint-initdb.d/