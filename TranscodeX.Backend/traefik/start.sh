#!/bin/sh

echo "[INFO] Generating dynamic.yml from template..."
envsubst < /etc/traefik/dynamic.template.yml > /etc/traefik/dynamic.yml

echo "[INFO] Starting Traefik..."
exec traefik --configFile=/etc/traefik/traefik.yml
