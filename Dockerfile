FROM node:alpine

RUN mkdir -p /app
WORKDIR /app
COPY . /app

ENV NODE_ENV production

EXPOSE 3001
CMD npm start
