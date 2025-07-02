# Usa uma imagem oficial do MySQL como base
FROM mysql:8.0

# Copia nosso arquivo de configuração personalizado.
# Ele será lido pelo servidor na inicialização.
COPY my.cnf /etc/mysql/conf.d/my-custom.cnf

# Copia nosso script SQL para o diretório de inicialização.
COPY init.sql /docker-entrypoint-initdb.d/