FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env.production .env
ENV NODE_ENV production

RUN npm run-script build

EXPOSE 4000
CMD [ "node", "dist/index.js" ]
USER node
