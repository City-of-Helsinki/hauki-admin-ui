import { describe, expect, it } from 'vitest';

import { thirdPartyLicensesConfig } from '../thirdPartyLicenses.config';

describe('thirdPartyLicensesConfig', () => {
  // The correction is the one decision in the notices that a reader cannot
  // verify from the bundle alone, so losing it has to fail a test.
  it('corrects the data license date-holidays declares to CC BY-SA 3.0', () => {
    const decision =
      thirdPartyLicensesConfig.licenseDecisions?.['date-holidays'];

    expect(decision?.declared).toBe('(ISC AND CC-BY-3.0)');
    expect(decision?.license).toBe('(ISC AND CC-BY-SA-3.0)');
  });

  it('lists the Sass-inlined packages the bundler cannot see', () => {
    expect(thirdPartyLicensesConfig.sassResolvedPackages).toContain(
      'hds-design-tokens'
    );
  });
});
