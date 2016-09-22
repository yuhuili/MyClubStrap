FROM node:4.5.0

MAINTAINER Gabriel Alacchi

ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80

COPY . /www

WORKDIR /www
RUN npm install --only=production

CMD npm start