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

      const hasStatisticsConsent = acceptedGroups.includes(
        CookieConsentGroup.STATISTICS
      );

       
      if (!window._paq) {
        return;
      }

      if (hasStatisticsConsent) {
        // start tracking
         
        window._paq.push(['setConsentGiven']);
         
        window._paq.push(['setCookieConsentGiven']);
      } else {
        // tell matomo to forget consent
         
        window._paq.push(['forgetConsentGiven']);
      }
    },
    siteSettings,
    options: { focusTargetSelector: `#main`, language },
  };

  return cookieConsentProps;
};

export default useCookieConsentSettings;
