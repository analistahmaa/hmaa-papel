# Usa uma imagem oficial e leve do Nginx
FROM nginx:stable-alpine

# Limpa a configuração padrão para evitar conflitos
RUN rm /etc/nginx/conf.d/default.conf

# Copia a nossa configuração personalizada para o local correto
COPY default.conf /etc/nginx/conf.d/