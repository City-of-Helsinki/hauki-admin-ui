cd $(dirname "$0")

export HAUKI_USER='dev@hel.fi';
export HAUKI_RESOURCE='tprek:41683'; #40759 41835 41683
export API_URL=https://hauki-api.test.hel.ninja/v1
# export API_URL=http://localhost:8000/v1

export AUTH_PARAMS=$(node ../scripts/generate-auth-params.mjs)

k6 run "$@" 
