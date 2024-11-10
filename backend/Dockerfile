FROM node:20-alpine AS builder
WORKDIR /src/usr/app
COPY package*.json ./
# Устанавливаем зависимости
RUN npm ci
# Копируем исходный код и собираем приложение
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /var/www/app
COPY ./package*.json ./
RUN npm i --omit=dev
COPY --from=builder /src/usr/app/dist ./dist
EXPOSE 3000
CMD ["node", "./dist/main.js"]
