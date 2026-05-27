# ============================================================
# STAGE 1: Build the Static Assets
# ============================================================
FROM helsinki.azurecr.io/ubi10/nodejs-24-pnpm-builder-base AS staticbuilder

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# 1. Copy dependency manifests
# corepack in the base image uses the pnpm version from package.json packageManager
COPY --chown=default:root package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=default:root ./scripts ./scripts
COPY --chown=default:root ./public ./public

# 2. Install dependencies and create a build-time public/env-config.js
# (Vite's HTML plugin resolves <script src="/env-config.js"> in index.html
# against public/ at build time. The file's *contents* are overwritten at
# container start by the base image's env.sh with the real runtime values.)
RUN pnpm install --frozen-lockfile --ignore-scripts && pnpm store prune
RUN pnpm update-runtime-env

# 3. Copy remaining source files
COPY --chown=default:root index.html vite.config.mts vite.config.build.ts eslint.config.mjs tsconfig.json tsconfig.build.json .prettierrc.json .env* ./
COPY --chown=default:root ./src ./src
COPY --chown=default:root ./test ./test

# 4. Build
ARG REACT_APP_SENTRY_RELEASE
ENV SENTRY_RELEASE=${REACT_APP_SENTRY_RELEASE:-""}
RUN pnpm build


# ============================================================
# STAGE 2: Production Runtime
# ============================================================
FROM helsinki.azurecr.io/ubi10/nginx-126-spa-standard AS production

ARG REACT_APP_SENTRY_RELEASE
ENV SENTRY_RELEASE=${REACT_APP_SENTRY_RELEASE:-""}

# Copy compiled assets
COPY --from=staticbuilder /app/build /usr/share/nginx/html

# Hauki-specific nginx include (large_client_header_buffers for long OIDC headers)
COPY --chown=1001:0 .prod/includes/large-headers.conf /etc/nginx/includes/

# Runtime env injection inputs (env.sh from base image reads these)
WORKDIR /usr/share/nginx/html
COPY .env .
COPY package.json .

# Inherited from base image:
#   - env.sh at /usr/share/nginx/html/env.sh
#   - USER 1001
#   - EXPOSE 8080
#   - ENTRYPOINT/CMD
