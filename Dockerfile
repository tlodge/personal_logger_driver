FROM node:alpine

ADD ./src/server/package.json /package.json
ADD ./src/server/server.js server.js
ADD ./src/server/webpack.config.js webpack.config.js 
ADD ./src/server/www www
ADD ./src/server/views views
ADD ./src/server/build build

RUN apk add --update make gcc g++ python curl git krb5-dev zeromq-dev && \
    npm install && npm run build && apk del gcc g++ make python curl git krb5-dev

LABEL databox.type="driver"

EXPOSE 8080

CMD ["npm","start"]
