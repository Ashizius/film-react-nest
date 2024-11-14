#!/bin/bash
SITE_URL="ashizius.nomorepartiesco.ru"
cd ..
mkdir -p certbot/www
mkdir -p certbot/conf
sudo docker compose up -d
sudo docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ --dry-run -d $SITE_URL
#sudo docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ --dry-run -d ashizius.nomorepartiesco.ru