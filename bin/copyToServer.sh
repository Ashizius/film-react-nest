#!/bin/bash
cd ../
scp ./docker-compose.yml ashizius@84.252.143.187:/home/ashizius/nest-app
scp ./.env ashizius@84.252.143.187:/home/ashizius/nest-app
scp ./frontend/.env ashizius@84.252.143.187:/home/ashizius/nest-app/frontend/
scp ./backend/.env ashizius@84.252.143.187:/home/ashizius/nest-app/backend/
