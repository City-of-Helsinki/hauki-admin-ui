#!/usr/bin/env bash
# Runs the e2e and accessibility tests locally in Docker (see compose.e2e.yaml).
#
#   pnpm test:e2e:docker                          # all tests
#   pnpm test:e2e:docker e2e/tests/accessibility.spec.ts --project=chromium
#   A11Y_UPDATE_BASELINE=1 pnpm test:e2e:docker   # rewrite accessibility baselines
#   KEEP_E2E_STACK=1 pnpm test:e2e:docker         # leave the API and database running
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/../.."

PLAYWRIGHT_VERSION=$(node -p "require('./package.json').devDependencies['@playwright/test'].replace(/^[^0-9]*/, '')")
PNPM_VERSION=$(node -p "require('./package.json').packageManager.split('@')[1].split('+')[0]")
export PLAYWRIGHT_VERSION PNPM_VERSION

mkdir -p report test-results e2e/a11y-baseline

compose=(docker compose -f compose.e2e.yaml)

status=0
"${compose[@]}" run --rm --build e2e "$@" || status=$?

if [ -z "${KEEP_E2E_STACK:-}" ]; then
  "${compose[@]}" down
fi

exit "$status"
