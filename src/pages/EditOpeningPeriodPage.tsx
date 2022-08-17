import React, { useEffect, useState } from 'react';
import api from '../common/utils/api/api';
import { ApiDatePeriod, UiDatePeriodConfig, Resource } from '../common/lib/types';
import OpeningHoursForm from '../components/opening-hours-form/OpeningHoursForm';
import { getDatePeriodFormConfig } from '../services/datePeriodFormConfig';

export default function EditOpeningPeriodPage({
  resourceId,
  datePeriodId,
}: {
  resourceId: string;
  datePeriodId: string;
}): JSX.Element {
  const id = parseInt(datePeriodId, 10);
  const [resource, setResource] = useState<Resource>();
  const [datePeriodConfig, setDatePeriodConfig] = useState<
    UiDatePeriodConfig
  >();
  const [datePeriod, setDatePeriod] = useState<ApiDatePeriod>();

  const submitFn = (updatedDatePeriod: ApiDatePeriod): Promise<ApiDatePeriod> =>
    api.patchDatePeriod(updatedDatePeriod);

  useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      try {
        const [
          apiResource,
          apiDatePeriod,
          uiDatePeriodOptions,
        ] = await Promise.all([
          api.getResource(resourceId),
          api.getDatePeriod(id),
          getDatePeriodFormConfig(),
        ]);
        setResource(apiResource);
        setDatePeriod(apiDatePeriod);
        setDatePeriodConfig(uiDatePeriodOptions);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Edit date-period - data initialization error:', e);
      }
    };

    fetchData();
  }, [id, resourceId]);

  if (!resource || !datePeriodConfig) {
    return <h1>Ladataan...</h1>;
  }

  return (
    <OpeningHoursForm
      datePeriod={datePeriod}
      datePeriodConfig={datePeriodConfig}
      resource={resource}
      submitFn={submitFn}
    />
  );
}
