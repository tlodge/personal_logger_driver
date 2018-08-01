FROM node:alpine

RUN apk add --update make gcc g++ python curl git krb5-dev zeromq-dev && \
    npm install zeromq --zmq-external --save && \
    apk del make gcc g++ python curl git krb5-dev

ADD ./src/server/package.json /package.json
RUN npm install

ADD ./src/server/server.js server.js
ADD ./src/server/webpack.config.js webpack.config.js 
ADD ./src/server/www www
ADD ./src/server/views views
ADD ./src/server/build build
RUN npm run build

LABEL databox.type="driver"

EXPOSE 8080

CMD ["npm","start"]
