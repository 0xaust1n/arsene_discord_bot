FROM node:22-slim AS base
WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./yarn.lock ./
RUN corepack enable && yarn
COPY . .
CMD ["yarn", "dev"]