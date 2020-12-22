FROM node:14-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

ENV MONGO_ATLAS_PW=secret
ENV MONGO_ATLAS_CLUSTER=secret
ENV MONGO_DB_NAME=secret
ENV JWT_KEY=secret

CMD [ "node","server.js" ]