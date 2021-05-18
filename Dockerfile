FROM node:14

COPY package*.json ./

COPY . .

RUN npm install

CMD node apiservice/server.js
