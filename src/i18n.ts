import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fi from './language/fi.json';
import en from './language/en.json';
import sv from './language/sv.json';

i18n
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    lng: 'fi',
    fallbackLng: 'fi',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      fi: { translation: fi },
      en: { translation: en },
      sv: { translation: sv },
    },
  });

export default i18n;
