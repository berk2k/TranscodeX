FROM traefik:v3.0

RUN apk add --no-cache gettext

# traefik.yml yerine traefik.template.yml dosyasını kopyala
COPY traefik.template.yml /etc/traefik/traefik.template.yml
COPY dynamic.template.yml /etc/traefik/dynamic.template.yml
COPY start.sh /start.sh

RUN chmod +x /start.sh

ENTRYPOINT ["/start.sh"]
