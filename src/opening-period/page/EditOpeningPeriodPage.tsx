import React, { useEffect, useState } from 'react';
import { Notification } from 'hds-react';
import api from '../../common/utils/api/api';
import {
  DatePeriod,
  DatePeriodOptions,
  Resource,
} from '../../common/lib/types';
import {
  ResourceInfo,
  ResourceTitle,
  ResourceAddress,
  ResourceInfoSubTitle,
} from '../../resource/page/ResourcePage';
import OpeningPeriodForm from '../form/OpeningPeriodForm';

export default function EditOpeningPeriodPage({
  resourceId,
  datePeriodId,
}: {
  resourceId: string;
  datePeriodId: string;
}): JSX.Element {
  const id = parseInt(datePeriodId, 10);
  const [resource, setResource] = useState<Resource>();
  const [datePeriod, setDatePeriod] = useState<DatePeriod>();
  const [datePeriodOptions, setDatePeriodOptions] = useState<
    DatePeriodOptions
  >();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasDataLoadingError, setHasDataLoadingError] = useState<boolean>(
    false
  );

  const submitFn = (updatedDatePeriod: DatePeriod): Promise<DatePeriod> =>
    api.putDatePeriod(updatedDatePeriod);

  useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      try {
        const [
          apiResource,
          apiDatePeriod,
          apiDatePeriodOptions,
        ] = await Promise.all([
          api.getResource(resourceId),
          api.getDatePeriod(id),
          api.getDatePeriodFormOptions(),
        ]);
        setResource(apiResource);
        setDatePeriod(apiDatePeriod);
        setDatePeriodOptions(apiDatePeriodOptions);
        setIsLoading(false);
      } catch (e) {
        setHasDataLoadingError(true);
        setIsLoading(false);
        // eslint-disable-next-line no-console
        console.error('Edit date-period - data initialization error:', e);
      }
    };

    fetchData();
  }, [id, resourceId]);

  if (hasDataLoadingError) {
    return (
      <>
        <h1 className="resource-info-title">Virhe</h1>
        <Notification
          dataTestId="error-retrieving-resource-info"
          label="Toimipisteen tietoja ei saatu ladattua."
          type="error">
          Tarkista toimipisteen id tai aukiolojakson id.
        </Notification>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <h1 className="resource-info-title">Aukiolojakson muokkaus</h1>
        <p>Sivua ladataan...</p>
      </>
    );
  }

  return (
    <>
      <ResourceInfo>
        <ResourceTitle resource={resource}>
          <ResourceInfoSubTitle text="Toimipisteen aukiolojakson muokkaus" />
        </ResourceTitle>
        <ResourceAddress resource={resource} />
      </ResourceInfo>
      {resource && datePeriod && datePeriodOptions && (
        <OpeningPeriodForm
          formId="edit-opening-period-form"
          datePeriod={datePeriod}
          resourceId={resource.id}
          datePeriodOptions={datePeriodOptions}
          submitFn={submitFn}
          successTextAndLabel={{
            label: 'Aukiolojakson muutokset tallennettu onnistuneesti.',
            text: 'Aukiolojakson muutokset tallennettu onnistuneesti.',
          }}
          errorTextAndLabel={{
            label: 'Aukiolojakson muokkaus epäonnistui',
            text:
              'Aukiolojakson muokkaus epäonnistui. Yritä myöhemmin uudestaan.',
          }}
        />
      )}
    </>
  );
}
