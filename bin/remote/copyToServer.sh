#!/bin/bash
SITE_URL="ashizius.nomorepartiesco.ru"
APP_FOLDER="nest-app"
echo -n "Enter username: "
read username
cd ../../

ssh $username@$SITE_URL 'mkdir -p /home/'$username'/'$APP_FOLDER'/frontend'
ssh $username@$SITE_URL 'mkdir -p /home/'$username'/'$APP_FOLDER'/backend/public'
ssh $username@$SITE_URL 'mkdir -p /home/'$username'/'$APP_FOLDER'/nginx'
ssh $username@$SITE_URL 'mkdir -p /home/'$username'/'$APP_FOLDER'/bin/setup'

ssh $username@$SITE_URL 'mkdir -p /home/'$username'/'$APP_FOLDER'/certbot/www'
ssh $username@$SITE_URL 'mkdir -p /home/'$username'/'$APP_FOLDER'/certbot/conf'

scp ./docker-compose.yml $username@$SITE_URL:/home/$username/$APP_FOLDER
scp ./nginx/*.conf $username@$SITE_URL:/home/$username/$APP_FOLDER/nginx
scp ./bin/setup/*.sh $username@$SITE_URL:/home/$username/$APP_FOLDER/bin/setup
scp ./bin/*.sh $username@$SITE_URL:/home/$username/$APP_FOLDER/bin
scp ./.env $username@$SITE_URL:/home/$username/$APP_FOLDER
scp ./frontend/.env $username@$SITE_URL:/home/$username/$APP_FOLDER/frontend/
scp ./backend/public/* $username@$SITE_URL:/home/$username/$APP_FOLDER/backend/public/
scp ./backend/.env $username@$SITE_URL:/home/$username/$APP_FOLDER/backend/
scp ./backend/.env $username@$SITE_URL:/home/$username/$APP_FOLDER/backend/

echo connect over ssh and execute "sudo docker compose down && sudo docker compose pull && sudo docker compose up -d"
echo -n "---PRESS ENRTER---"
read somerandominput