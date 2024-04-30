export const apiUrl = process.env.API_URL || 'https://hauki-api.dev.hel.ninja';

export const e2eTestUrl =
  process.env.E2E_TESTS_ENV_URL ?? 'http://localhost:3000';

export const testData = {
  HAUKI_USER: 'cypress_test_user',
  HAUKI_ORGANIZATION: 'test:cypress',
  HAUKI_SOURCE: 'test',
  HAUKI_RESOURCE: 'test:1',
};
