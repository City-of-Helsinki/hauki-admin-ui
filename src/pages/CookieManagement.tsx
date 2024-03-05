/* eslint-disable no-underscore-dangle */
import React from 'react';
import { CookiePage } from 'hds-react';
import { useAppContext } from '../App-context';

import useCookieConsent from '../components/cookie-consent/hooks/useCookieConsent';

const CookieManagement = (): JSX.Element => {
  const { language, setLanguage } = useAppContext();
  const { config } = useCookieConsent({
    language,
    setLanguage,
    isModal: false,
  });

  return <CookiePage contentSource={config} />;
};

export default CookieManagement;
