import React from 'react';
import api from '../common/utils/api/api';
import { ApiDatePeriod } from '../common/lib/types';
import ExceptionOpeningHoursForm from '../components/exception-opening-hours-form/ExceptionOpeningHoursForm';
import useResource from '../services/useResource';
import useDatePeriodConfig from '../services/useDatePeriodConfig';
import useDatePeriod from '../services/useDatePeriod';

const EditExceptionOpeningHoursPage = ({
  resourceId,
  datePeriodId,
}: {
  resourceId: string;
  datePeriodId: string;
}): JSX.Element => {
  const resource = useResource(resourceId);
  const datePeriodConfig = useDatePeriodConfig();
  const datePeriod = useDatePeriod(datePeriodId);

  const submitFn = (updatedDatePeriod: ApiDatePeriod): Promise<ApiDatePeriod> =>
    api.patchDatePeriod(updatedDatePeriod);

  if (!resource || !datePeriodConfig || !datePeriod) {
    return <h1>Ladataan...</h1>;
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
