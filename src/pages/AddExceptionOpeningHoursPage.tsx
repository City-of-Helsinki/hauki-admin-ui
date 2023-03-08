import React from 'react';
import api from '../common/utils/api/api';
import ExceptionOpeningHoursForm from '../components/exception-opening-hours-form/ExceptionOpeningHoursForm';
import useDatePeriodConfig from '../services/useDatePeriodConfig';
import useResource from '../services/useResource';

const AddExceptionOpeningHoursPage = ({
  resourceId,
}: {
  resourceId: string;
}): JSX.Element => {
  const resource = useResource(resourceId);
  const datePeriodConfig = useDatePeriodConfig();

  if (!resource || !datePeriodConfig) {
    return <h1>Ladataan...</h1>;
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
