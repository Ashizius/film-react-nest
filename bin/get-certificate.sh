#!/bin/bash
SITE_URL="ashizius.nomorepartiesco.ru"
cd ..
mkdir -p certbot/www
mkdir -p certbot/conf
sudo docker-compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d $SITE_URL
cd nginx/
mv default.conf default_without-ssl.conf
mv default_ssl.conf default.conf

docker-compose restart
