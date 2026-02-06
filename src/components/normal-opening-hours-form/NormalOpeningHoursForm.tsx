import React from 'react';
import { useTranslation } from 'react-i18next';
import { DatePeriod, ResourceState } from '../../common/lib/types';
import { formatDate } from '../../common/utils/date-time/format';
import { defaultTimeSpan, defaultTimeSpanGroup } from '../../constants';
import OpeningHoursForm, {
  FormConfig,
  OpeningHoursFormProps,
} from '../opening-hours-form/OpeningHoursForm';

const NormalOpeningHoursForm = ({
  copyFrom,
  ...props
}: Omit<OpeningHoursFormProps, 'config'> & {
  copyFrom?: DatePeriod;
}): JSX.Element => {
  const { t } = useTranslation();

  const config: FormConfig = {
    exception: false,
    defaultValues: copyFrom
      ? {
          ...copyFrom,
          // Clear dates when copying - user will set new dates
          startDate: formatDate(new Date().toISOString()),
          endDate: null,
          // Remove ID so it creates a new period
          id: undefined,
        }
      : {
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
          success: t('OpeningHours.SubmitSuccessNotification'),
          error: t('OpeningHours.SubmitErrorNotification'),
        },
      },
      title: {
        placeholders: {
          fi: t('OpeningHours.TitlePlaceholderInFinnish'),
          sv: t('OpeningHours.TitlePlaceholderInSwedish'),
          en: t('OpeningHours.TitlePlaceholderInEnglish'),
        },
      },
    },
  };

  return <OpeningHoursForm config={config} {...props} />;
};

export default NormalOpeningHoursForm;
