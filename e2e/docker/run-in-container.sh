#!/usr/bin/env bash
# Runs inside the Playwright container of compose.e2e.yaml. Builds and serves the app from a copy
# of the read-only mounted source (/src), so nothing on the host is modified except the mounted
# report, test-results and a11y-baseline directories.
set -euo pipefail

echo "Copying sources..."
tar -C /src \
  --exclude=./.git \
  --exclude=./node_modules \
  --exclude=./build \
  --exclude=./report \
  --exclude=./test-results \
  --exclude=./e2e/a11y-baseline \
  --exclude=./.env.local \
  --exclude='./.env.*.local' \
  --exclude=./public/env-config.js \
  --exclude=./public/test-env-config.js \
  -cf - . | tar -C /app -xf -

# The Playwright image ships Node without corepack; install the repo's pinned pnpm.
npm install -g --silent "pnpm@${PNPM_VERSION}"
pnpm install --frozen-lockfile --ignore-scripts

# Runtime config for the app build: local API, no analytics or error reporting.
cat > .env.local <<EOF
API_URL=${API_URL}
USE_AXE=false
MATOMO_ENABLED=false
SENTRY_DSN=
FEEDBACK_EMAILS=
EOF
pnpm update-runtime-env
pnpm exec vite build

pnpm exec vite preview --host 127.0.0.1 --port 3000 --strictPort > /tmp/preview.log 2>&1 &
for _ in $(seq 1 60); do
  curl -sf -o /dev/null http://127.0.0.1:3000/ && break
  sleep 1
done
curl -sf -o /dev/null http://127.0.0.1:3000/ || { cat /tmp/preview.log; exit 1; }

exec pnpm exec playwright test "$@"
