import { LanguageStrings, Rule } from './common/lib/types';

// eslint-disable-next-line import/prefer-default-export
export const uiFrequencyRules: { label: LanguageStrings; value: Rule }[] = [
  {
    value: 'week_every',
    label: { fi: 'Joka viikko', sv: 'Joka viikko', en: 'Joka viikko' },
  },
  {
    value: 'week_even',
    label: {
      fi: 'Parilliset viikot',
      sv: 'Parilliset viikot',
      en: 'Parilliset viikot',
    },
  },
  {
    value: 'week_odd',
    label: {
      fi: 'Parittomat viikot',
      sv: 'Parittomat viikot',
      en: 'Parittomat viikot',
    },
  },
];
