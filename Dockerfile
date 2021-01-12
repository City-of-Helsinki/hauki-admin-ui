# ===============================================
FROM helsinkitest/node:12-slim as staticbuilder
# ===============================================

# Offical image has npm log verbosity as info. More info - https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL warn

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Yarn
ENV YARN_VERSION 1.19.1
RUN yarn policies set-version $YARN_VERSION

USER root
RUN apt-install.sh build-essential

# Use non-root user
USER appuser

# Install dependencies
COPY --chown=appuser:appuser package.json yarn.lock /app/
RUN yarn && yarn cache clean --force

# Copy all files
COPY --chown=appuser:appuser . .

# Build application
RUN yarn build

# =============================
FROM registry.access.redhat.com/ubi8/nginx-118 as production
# =============================

USER root

RUN chgrp -R 0 /usr/share/nginx/html && \
    chmod -R g=u /usr/share/nginx/html

# Copy static build
COPY --from=staticbuilder --chown=nginx:nginx /app/build /usr/share/nginx/html

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
