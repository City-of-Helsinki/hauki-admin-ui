/* eslint-disable no-underscore-dangle */
import { CookieModal } from 'hds-react';
import React, { FC } from 'react';
import { useAppContext } from '../../App-context';
import useCookieConsent from './hooks/useCookieConsent';

const CookieConsent: FC = () => {
  const { language, setLanguage } = useAppContext();
  const { config } = useCookieConsent({
    language,
    setLanguage,
  });

  return <CookieModal contentSource={config} />;
};

export default CookieConsent;
