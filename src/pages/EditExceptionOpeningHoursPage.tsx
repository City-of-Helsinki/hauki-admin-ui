import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import api from '../common/utils/api/api';
import { ApiDatePeriod } from '../common/lib/types';
import ExceptionOpeningHoursForm from '../components/exception-opening-hours-form/ExceptionOpeningHoursForm';
import useResource from '../services/useResource';
import useDatePeriodConfig from '../services/useDatePeriodConfig';
import useDatePeriod from '../services/useDatePeriod';

const EditExceptionOpeningHoursPage = (): JSX.Element => {
  const { id: resourceId, datePeriodId } = useParams<{
    id?: string;
    datePeriodId?: string;
  }>();

  const { t } = useTranslation();
  const resource = useResource(resourceId);
  const datePeriodConfig = useDatePeriodConfig();
  const datePeriod = useDatePeriod(datePeriodId);

  const submitFn = (updatedDatePeriod: ApiDatePeriod): Promise<ApiDatePeriod> =>
    api.patchDatePeriod(updatedDatePeriod);

  if (!resource || !datePeriodConfig || !datePeriod) {
    return <h1>{t('Common.IsLoading')}</h1>;
  }

  return (
    <ExceptionOpeningHoursForm
      datePeriod={datePeriod}
      datePeriodConfig={datePeriodConfig}
      resource={resource}
      submitFn={submitFn}
    />
  );
};

export default EditExceptionOpeningHoursPage;
