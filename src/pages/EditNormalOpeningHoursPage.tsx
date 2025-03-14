import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import api from '../common/utils/api/api';
import { ApiDatePeriod } from '../common/lib/types';
import NormalOpeningHoursForm from '../components/normal-opening-hours-form/NormalOpeningHoursForm';
import useResource from '../services/useResource';
import useDatePeriod from '../services/useDatePeriod';
import useDatePeriodConfig from '../services/useDatePeriodConfig';

const EditNormalOpeningHoursPage = (): JSX.Element => {
  const { t } = useTranslation();

  const { id: resourceId, datePeriodId } = useParams<{
    id?: string;
    datePeriodId?: string;
  }>();

  const resource = useResource(resourceId);
  const datePeriodConfig = useDatePeriodConfig();
  const datePeriod = useDatePeriod(datePeriodId);

  const submitFn = (updatedDatePeriod: ApiDatePeriod): Promise<ApiDatePeriod> =>
    api.patchDatePeriod(updatedDatePeriod);

  if (!resource || !datePeriodConfig || !datePeriod) {
    return <h1>{t('Common.IsLoading')}</h1>;
  }

  return (
    <NormalOpeningHoursForm
      datePeriod={datePeriod}
      datePeriodConfig={datePeriodConfig}
      resource={resource}
      submitFn={submitFn}
    />
  );
};

export default EditNormalOpeningHoursPage;
