FROM traefik:v3.0


RUN apk add --no-cache bash gettext


COPY traefik.yml /etc/traefik/traefik.yml
COPY dynamic.template.yml /etc/traefik/dynamic.template.yml


ENTRYPOINT [ "sh", "-c", "envsubst < /etc/traefik/dynamic.template.yml > /etc/traefik/dynamic.yml && traefik --configFile=/etc/traefik/traefik.yml" ]
