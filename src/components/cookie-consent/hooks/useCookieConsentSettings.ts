import { CookieConsentChangeEvent, CookieConsentReactProps } from 'hds-react';
import { useTranslation } from 'react-i18next';
import siteSettings from '../siteSettings.json';

export enum CookieConsentGroup {
  SHARED = 'shared',
  STATISTICS = 'statistics',
}

const useCookieConsentSettings = () => {
  const { i18n } = useTranslation();
  const { language } = i18n;

  const cookieConsentProps: CookieConsentReactProps = {
    onChange: (changeEvent: CookieConsentChangeEvent) => {
      const { acceptedGroups } = changeEvent;

      const hasStatisticsConsent =
        acceptedGroups.indexOf(CookieConsentGroup.STATISTICS) > -1;

      if (hasStatisticsConsent) {
        // start tracking
        // eslint-disable-next-line no-underscore-dangle
        window._paq.push(['setConsentGiven']);
        // eslint-disable-next-line no-underscore-dangle
        window._paq.push(['setCookieConsentGiven']);
      } else {
        // tell matomo to forget consent
        // eslint-disable-next-line no-underscore-dangle
        window._paq.push(['forgetConsentGiven']);
      }
    },
    siteSettings,
    options: { focusTargetSelector: `#main`, language },
  };

  return cookieConsentProps;
};

export default useCookieConsentSettings;
