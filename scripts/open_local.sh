#!/bin/bash

PARAMS=$(node ./scripts/generate-auth-params.mjs)

URL="http://localhost:3000/resource/$HAUKI_RESOURCE?$PARAMS"

echo $URL

open $URL
