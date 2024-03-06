# ===============================================
FROM registry.access.redhat.com/ubi8/nodejs-18 AS staticbuilder
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
RUN chown -R default:root /app

# Use non-root user
USER default

RUN yarn && yarn cache clean --force

# Copy all files
COPY .eslintrc.js .eslintignore tsconfig.json tsconfig.eslint.json .prettierrc.json .env* /app/
COPY ./src /app/src
COPY ./test /app/test
COPY ./public /app/public

# Build application
RUN yarn build

# =============================
FROM registry.access.redhat.com/ubi8/nginx-120 as production
# =============================

USER root

RUN chgrp -R 0 /usr/share/nginx/html && \
    chmod -R g=u /usr/share/nginx/html

# Copy static build
COPY --from=staticbuilder /app/build /usr/share/nginx/html

# Copy nginx config
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Env-script and .env file
WORKDIR /usr/share/nginx/html
COPY ./scripts/env.sh .
COPY .env .

# Make script executable
RUN chmod +x env.sh

USER 1001

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]

EXPOSE 8000
