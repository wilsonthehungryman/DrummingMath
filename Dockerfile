FROM php:5.6.30-fpm-alpine

RUN apk update && apk add build-base

RUN apk add zlib-dev git zip \
  && docker-php-ext-install zip

COPY . /app
WORKDIR /app

ENV PATH="~/.composer/vendor/bin:./vendor/bin:${PATH}"
