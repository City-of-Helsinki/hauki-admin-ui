import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import { DatePeriod } from '../common/lib/types';
import api from '../common/utils/api/api';
import ExceptionOpeningHoursForm from '../components/exception-opening-hours-form/ExceptionOpeningHoursForm';
import useDatePeriodConfig from '../services/useDatePeriodConfig';
import useResource from '../services/useResource';

const AddExceptionOpeningHoursPage = (): JSX.Element => {
  const { id: resourceId } = useParams<{
    id?: string;
  }>();

  const { t } = useTranslation();
  const location = useLocation();
  const copyFrom = location.state?.copyFrom as DatePeriod | undefined;
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
      copyFrom={copyFrom}
    />
  );
};

export default AddExceptionOpeningHoursPage;
