/// <reference types="jest" />

import { parseAuthParams } from './auth-context';

describe('Auth Context', () => {
  describe('parseAuthParams', () => {
    it('parses auth parameters from query string', () => {
      expect(
        parseAuthParams(
          '?hsa_source=tprek&hsa_username=admin@hel.fi&hsa_signature=1234567&hsa_valid_until=2020-11-05T16%3A20%3A00&hsa_created_at=2020-11-05T16%3A10%3A00&hsa_organization=12345&hsa_resource=tprek%3A8215'
        )
      ).toEqual({
        hsa_username: 'admin@hel.fi',
        hsa_signature: '1234567',
        hsa_valid_until: '2020-11-05T16:20:00',
        hsa_created_at: '2020-11-05T16:10:00',
        hsa_organization: '12345',
        hsa_resource: 'tprek:8215',
        hsa_source: 'tprek',
      });
    });

    it('returns undefined when a required parameter is missing', () => {
      expect(
        parseAuthParams(
          '?hsa_username=admin@hel.fi&hsa_signature=1234567&hsa_valid_until=2020-11-05T16%3A20%3A00&hsa_created_at=2020-11-05T16%3A10%3A00'
        )
      ).toEqual(undefined);
    });
  });
});
