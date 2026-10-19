import type { ThirdPartyLicensesConfig } from '@city-of-helsinki/license-notices';

/**
 * Everything about the third-party license notices that is specific to this
 * repository. The generator itself comes from the license-notices package and
 * knows nothing about this project.
 */
export const thirdPartyLicensesConfig: ThirdPartyLicensesConfig = {
  repositoryUrl: 'https://github.com/City-of-Helsinki/hauki-admin-ui',

  licenseDecisions: {
    'date-holidays': {
      declared: '(ISC AND CC-BY-3.0)',
      license: '(ISC AND CC-BY-SA-3.0)',
      note:
        'Declares "(ISC AND CC-BY-3.0)", but its own LICENSE file and README ' +
        'state that the holiday data it contains is available under ' +
        'CC BY-SA 3.0. The code is ISC. The attributions the data requires ' +
        'are included in its license file.',
    },
  },

  sassResolvedPackages: ['hds-design-tokens'],
};
