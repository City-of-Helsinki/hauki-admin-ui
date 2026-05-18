# ===============================================
FROM registry.access.redhat.com/ubi9/nodejs-22 AS staticbuilder
# ===============================================

WORKDIR /app

USER root

# Offical image has npm log verbosity as info. More info - https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL warn

# Install pnpm via corepack into a shared location so non-root users can use it
ENV COREPACK_HOME=/usr/local/share/corepack
RUN corepack enable && corepack prepare pnpm@11.1.2 --activate \
    && chmod -R a+rX "$COREPACK_HOME"

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY ./scripts /app/scripts
COPY ./public /app/public

RUN chown -R default:root /app

# Use non-root user
USER default

RUN pnpm install --frozen-lockfile --ignore-scripts && pnpm store prune
RUN pnpm update-runtime-env

# Copy all files
COPY eslint.config.mjs tsconfig.json tsconfig.build.json index.html vite.config.mts vite.config.build.ts .prettierrc.json .env* /app/
COPY ./src /app/src
COPY ./test /app/test

ARG REACT_APP_SENTRY_RELEASE

ENV REACT_APP_RELEASE=${REACT_APP_SENTRY_RELEASE:-""}

# Build application
RUN pnpm build

# Process nginx configuration with APP_VERSION substitution
COPY nginx/nginx.conf /app/nginx.conf.template
RUN export APP_VERSION=$(pnpm --silent app:version | tr -d '\n') && \
    envsubst '${APP_VERSION},${REACT_APP_RELEASE}' < /app/nginx.conf.template > /app/nginx.conf

# =============================
FROM registry.access.redhat.com/ubi9/nginx-124 as production
# =============================

USER root

RUN chgrp -R 0 /usr/share/nginx/html && \
    chmod -R g=u /usr/share/nginx/html

# Copy static build
COPY --from=staticbuilder /app/build /usr/share/nginx/html

# Copy nginx config
COPY --from=staticbuilder /app/nginx.conf /etc/nginx/nginx.conf
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
