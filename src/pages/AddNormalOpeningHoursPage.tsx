import React, { useEffect, useState } from 'react';
import {
  Resource,
  UiDatePeriodConfig,
  ApiDatePeriod,
} from '../common/lib/types';
import api from '../common/utils/api/api';
import NormalOpeningHoursForm from '../components/normal-opening-hours-form/NormalOpeningHoursForm';
import { getDatePeriodFormConfig } from '../services/datePeriodFormConfig';

const AddNormalOpeningHoursPage = ({
  resourceId,
}: {
  resourceId: string;
}): JSX.Element => {
  const [resource, setResource] = useState<Resource>();
  const [datePeriodConfig, setDatePeriodConfig] = useState<
    UiDatePeriodConfig
  >();

  useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      try {
        const [apiResource, uiDatePeriodOptions] = await Promise.all([
          api.getResource(resourceId),
          getDatePeriodFormConfig(),
        ]);
        setResource(apiResource);
        setDatePeriodConfig(uiDatePeriodOptions);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Add date-period - data initialization error:', e);
      }
    };

    fetchData();
  }, [resourceId]);

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
