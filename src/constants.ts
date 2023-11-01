import {
  TimeSpan,
  ResourceState,
  RuleType,
  Language,
  Rule,
  TimeSpanGroup,
  LanguageOption,
} from './common/lib/types';

export const uiRuleLabels: {
  [key in RuleType]: { [x in Language]: string };
} = {
  week_every: { fi: 'Joka viikko', sv: 'Joka viikko', en: 'Joka viikko' },
  week_even: {
    fi: 'Parilliset viikot',
    sv: 'Parilliset viikot',
    en: 'Parilliset viikot',
  },
  week_odd: {
    fi: 'Parittomat viikot',
    sv: 'Parittomat viikot',
    en: 'Parittomat viikot',
  },
};

export const defaultTimeSpan: TimeSpan = {
  description: { fi: null, sv: null, en: null },
  start_time: null,
  end_time: null,
  full_day: false,
  resource_state: ResourceState.OPEN,
};

export const defaultTimeSpanGroup: TimeSpanGroup = {
  rule: { id: undefined, type: 'week_every' as const },
  timeSpans: [defaultTimeSpan],
};

export const defaultRule: Rule = {
  id: undefined,
  group: undefined,
  type: 'week_every' as const,
};

export const defaultNoOpeningHoursTimeSpanGroup: TimeSpanGroup = {
  ...defaultTimeSpanGroup,
  timeSpans: [
    {
      ...defaultTimeSpan,
      resource_state: ResourceState.NO_OPENING_HOURS,
    },
  ],
};

export const languageOptions: LanguageOption[] = [
  { label: 'Suomeksi', value: Language.FI },
  { label: 'Svenska', value: Language.SV },
  { label: 'English', value: Language.EN },
];
