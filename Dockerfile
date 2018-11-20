FROM node:alpine

WORKDIR /app
COPY . /app
RUN yarn install
EXPOSE 3000

