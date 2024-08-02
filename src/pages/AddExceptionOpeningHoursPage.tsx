import React from 'react';
import { useTranslation } from 'react-i18next';
import api from '../common/utils/api/api';
import ExceptionOpeningHoursForm from '../components/exception-opening-hours-form/ExceptionOpeningHoursForm';
import useDatePeriodConfig from '../services/useDatePeriodConfig';
import useResource from '../services/useResource';

const AddExceptionOpeningHoursPage = ({
  resourceId,
}: {
  resourceId: string;
}): JSX.Element => {
  const { t } = useTranslation();
  const resource = useResource(resourceId);
  const datePeriodConfig = useDatePeriodConfig();

  if (!resource || !datePeriodConfig) {
    return <h1>{t('Common.IsLoading')}</h1>;
  }

  return (
    <ExceptionOpeningHoursForm
      datePeriodConfig={datePeriodConfig}
      resource={resource}
      submitFn={api.postDatePeriod}
    />
  );
};

export default AddExceptionOpeningHoursPage;
