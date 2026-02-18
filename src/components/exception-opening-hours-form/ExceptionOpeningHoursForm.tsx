import React from 'react';
import { useTranslation } from 'react-i18next';
import { DatePeriod, ResourceState } from '../../common/lib/types';
import { formatDate } from '../../common/utils/date-time/format';
import OpeningHoursForm, {
  FormConfig,
  OpeningHoursFormProps,
} from '../opening-hours-form/OpeningHoursForm';

const ExceptionOpeningHoursForm = ({
  copyFrom,
  ...props
}: Omit<OpeningHoursFormProps, 'config'> & {
  copyFrom?: DatePeriod;
}): JSX.Element => {
  const { t } = useTranslation();

  const config: FormConfig = {
    exception: true,
    defaultValues: copyFrom
      ? {
          ...copyFrom,
          // Reset dates to today when copying
          startDate: formatDate(new Date().toISOString()),
          endDate: formatDate(new Date().toISOString()),
          // Remove ID so it creates a new period
          id: undefined,
        }
      : {
          startDate: formatDate(new Date().toISOString()),
          endDate: formatDate(new Date().toISOString()),
          fixed: true,
          name: { fi: '', sv: '', en: '' },
          override: true,
          resourceState: ResourceState.CLOSED,
          openingHours: [],
        },
    texts: {
      submit: {
        notifications: {
          success: t('OpeningHours.ExceptionPeriodSubmitSuccess'),
          error: t('OpeningHours.ExceptionPeriodSubmitError'),
        },
      },
      title: {
        placeholders: {
          fi: 'Esim. koulutuspäivä',
          sv: 'T.ex. utbildningsdag',
          en: 'E.g. training day',
        },
      },
    },
  };

  return <OpeningHoursForm config={config} {...props} />;
};

export default ExceptionOpeningHoursForm;
