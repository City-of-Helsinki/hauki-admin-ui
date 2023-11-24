/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from 'react';
import { ContentSource } from 'hds-react';
import { Language } from '../../../common/lib/types';

type Props = {
  language: Language | undefined;
  setLanguage: ((language: Language) => void) | undefined;
  isModal?: boolean;
};

const useCookieConsent = ({
  language,
  setLanguage,
  isModal = true,
}: Props): { config: ContentSource } => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    language ?? Language.FI
  );

  useEffect(() => {
    if (language) {
      const newLanguage =
        Language[language.toUpperCase() as keyof typeof Language];

      if (newLanguage !== currentLanguage) {
        setCurrentLanguage(newLanguage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const onLanguageChange = (lang: string) => {
    const newLanguage = Language[lang.toUpperCase() as keyof typeof Language];

    setCurrentLanguage(newLanguage);

    if (setLanguage) {
      setLanguage(newLanguage);
    }
  };

  const config: ContentSource = {
    siteName: 'Aukiolot',
    currentLanguage,
    optionalCookies: {
      groups: [
        {
          commonGroup: 'statistics',
          cookies: [{ commonCookie: 'matomo' }],
        },
      ],
    },
    language: { onLanguageChange },
    onAllConsentsGiven: (consents) => {
      if (consents.matomo) {
        //  start tracking
        window._paq.push(['setConsentGiven']);
        window._paq.push(['setCookieConsentGiven']);
      }
    },
    onConsentsParsed: (consents) => {
      /* istanbul ignore next */
      if (consents.matomo === undefined) {
        // tell matomo to wait for consent:
        window._paq.push(['requireConsent']);
        window._paq.push(['requireCookieConsent']);
      } else if (consents.matomo === false) {
        // tell matomo to forget conset
        window._paq.push(['forgetConsentGiven']);
      }
    },
    focusTargetSelector: isModal ? `#main` : undefined,
  };

  return { config };
};

export default useCookieConsent;
