import React from 'react';
import { ApiDatePeriod } from '../common/lib/types';
import api from '../common/utils/api/api';
import NormalOpeningHoursForm from '../components/normal-opening-hours-form/NormalOpeningHoursForm';
import useDatePeriodConfig from '../services/useDatePeriodConfig';
import useResource from '../services/useResource';

const AddNormalOpeningHoursPage = ({
  resourceId,
}: {
  resourceId: string;
}): JSX.Element => {
  const resource = useResource(resourceId);
  const datePeriodConfig = useDatePeriodConfig();

  if (!resource || !datePeriodConfig) {
    return <h1>Ladataan...</h1>;
  }

  const submitFn = (data: ApiDatePeriod): Promise<ApiDatePeriod> =>
    api.postDatePeriod(data);

  return (
    <NormalOpeningHoursForm
      datePeriodConfig={datePeriodConfig}
      submitFn={submitFn}
      resource={resource}
    />
  );
};

export default AddNormalOpeningHoursPage;
