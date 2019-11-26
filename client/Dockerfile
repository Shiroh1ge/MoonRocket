FROM nginx:alpine
FROM node:12

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app
RUN npm i --unsafe-perm -g @angular/cli

WORKDIR /usr/src/app
ADD . /usr/src/app

EXPOSE 4200
