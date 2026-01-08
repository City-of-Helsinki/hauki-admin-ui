# ===============================================
FROM registry.access.redhat.com/ubi9/nodejs-22 AS staticbuilder
# ===============================================

WORKDIR /app

USER root
RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN yum -y install yarn

# Offical image has npm log verbosity as info. More info - https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL warn

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Yarn
ENV YARN_VERSION 1.19.1
RUN yarn policies set-version $YARN_VERSION

# Install dependencies
COPY package.json yarn.lock /app/
COPY ./scripts /app/scripts
COPY ./public /app/public

RUN chown -R default:root /app

# Use non-root user
USER default

RUN yarn install --frozen-lockfile --ignore-scripts && yarn cache clean --force
RUN yarn update-runtime-env

# Copy all files
COPY .eslintrc.js .eslintignore tsconfig.json tsconfig.build.json index.html vite.config.mts .prettierrc.json .env* /app/
COPY ./src /app/src
COPY ./test /app/test

# Build application
RUN yarn build

# =============================
FROM registry.access.redhat.com/ubi9/nginx-120 as production
# =============================

USER root

RUN chgrp -R 0 /usr/share/nginx/html && \
    chmod -R g=u /usr/share/nginx/html

# Copy static build
COPY --from=staticbuilder /app/build /usr/share/nginx/html

# Copy nginx config
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
RUN mkdir /etc/nginx/env
COPY ./nginx/nginx_env.conf  /etc/nginx/env/

# Env-script and .env file
WORKDIR /usr/share/nginx/html
COPY ./scripts/env.sh .
COPY .env .

# Copy package.json so env.sh can read it
COPY package.json .

# Make script executable
RUN chmod +x env.sh

USER 1001

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]

EXPOSE 8000
