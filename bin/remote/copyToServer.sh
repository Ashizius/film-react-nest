#!/bin/bash
SITE_URL="ashizius.nomorepartiesco.ru"
echo -n "Enter username: "
read username
cd ../../
ssh $username@$SITE_URL 'mkdir -p /home/'$username'/nest-app/frontend/'
ssh $username@$SITE_URL 'mkdir -p /home/'$username'/nest-app/backend/public'
ssh $username@$SITE_URL 'mkdir -p /home/'$username'/nest-app/nginx'
ssh $username@$SITE_URL 'mkdir -p /home/'$username'/nest-app/bin/setup'
scp ./docker-compose.yml $username@$SITE_URL:/home/$username/nest-app
scp ./nginx/*.conf $username@$SITE_URL:/home/$username/nest-app/nginx
scp ./bin/setup/*.sh $username@$SITE_URL:/home/$username/nest-app/bin/setup
scp ./bin/*.sh $username@$SITE_URL:/home/$username/nest-app/bin
scp ./.env $username@$SITE_URL:/home/$username/nest-app
scp ./frontend/.env $username@$SITE_URL:/home/$username/nest-app/frontend/
scp ./backend/public $username@$SITE_URL:/home/$username/nest-app/backend/public
scp ./backend/.env $username@$SITE_URL:/home/$username/nest-app/backend/
scp ./backend/.env $username@$SITE_URL:/home/$username/nest-app/backend/
