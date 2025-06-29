FROM traefik:v3.0

RUN apk add --no-cache gettext

COPY traefik.yml /etc/traefik/traefik.yml
COPY dynamic.template.yml /etc/traefik/dynamic.template.yml
COPY start.sh /start.sh

RUN chmod +x /start.sh

ENTRYPOINT ["/start.sh"]
