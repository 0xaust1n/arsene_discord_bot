FROM node:18.19-buster-slim as base
WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./yarn.lock ./
COPY . .
CMD ["yarn"]
CMD ["yarn", "dev"]