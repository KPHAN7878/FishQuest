#!/bin/bash

# FOR REMOTE MACHINE "ubuntu@api.fishquest.net" ONLY
COMPOSE="/usr/local/bin/docker-compose --ansi never"
DOCKER="/usr/bin/docker"

cd /home/ubuntu/fishquest/
$COMPOSE run certbot renew --dry-run && $COMPOSE kill -s SIGHUP webserver
$DOCKER system prune -af
