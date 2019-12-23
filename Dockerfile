FROM node:13.1.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY .env .
COPY dist/ .

CMD [ "npm" ,"run", "start:prod"]