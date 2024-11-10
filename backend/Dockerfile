FROM node:20-alpine AS production
WORKDIR /var/www/app
COPY ./package*.json ./
RUN npm i --omit=dev
#COPY  ./dist ./dist
#COPY  ./public ./public
EXPOSE 3000
CMD ["node", "./dist/main.js"]
