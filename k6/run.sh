cd $(dirname "$0")

export API_URL=https://hauki-api-test.agw.arodevtest.hel.fi/v1
# export API_URL=http://localhost:8000/v1
export HAUKI_USER='dev@hel.fi';
export HAUKI_RESOURCE='tprek:41835';

export AUTH_PARAMS=$(node ../scripts/generate-auth-params.js)

k6 run "$@" 
