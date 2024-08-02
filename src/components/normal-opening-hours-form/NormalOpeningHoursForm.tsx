import React from 'react';
import { ResourceState } from '../../common/lib/types';
import { formatDate } from '../../common/utils/date-time/format';
import { defaultTimeSpan, defaultTimeSpanGroup } from '../../constants';
import OpeningHoursForm, {
  FormConfig,
  OpeningHoursFormProps,
} from '../opening-hours-form/OpeningHoursForm';
import i18n from '../../i18n';

const config: FormConfig = {
  exception: false,
  defaultValues: {
    fixed: false,
    endDate: null,
    startDate: formatDate(new Date().toISOString()),
    name: {
      fi: null,
      sv: null,
      en: null,
    },
    openingHours: [
      {
        weekdays: [1, 2, 3, 4, 5],
        timeSpanGroups: [defaultTimeSpanGroup],
      },
      {
        weekdays: [6, 7],
        timeSpanGroups: [
          {
            ...defaultTimeSpanGroup,
            timeSpans: [
              {
                ...defaultTimeSpan,
                resource_state: ResourceState.CLOSED,
              },
            ],
          },
        ],
      },
    ],
    override: false,
  },
  texts: {
    submit: {
      notifications: {
        success: i18n.t('OpeningHours.SubmitSuccessNotification'),
        error: i18n.t('OpeningHours.SubmitErrorNotification'),
      },
    },
    title: {
      placeholders: {
        fi: i18n.t('TitlePlaceholderInFinnish'),
        sv: i18n.t('TitlePlaceholderInSwedish'),
        en: i18n.t('TitlePlaceholderInEnglish'),
      },
    },
  },
};

const NormalOpeningHoursForm = (
  props: Omit<OpeningHoursFormProps, 'config'>
): JSX.Element => {
  return <OpeningHoursForm config={config} {...props} />;
};

export default NormalOpeningHoursForm;
