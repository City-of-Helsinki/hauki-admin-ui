import React, { useEffect, useState } from 'react';
import { partition } from 'lodash';
import { Notification } from 'hds-react';
import {
  Language,
  Resource,
  UiDatePeriodConfig,
  ActiveDatePeriod,
} from '../../common/lib/types';
import api from '../../common/utils/api/api';
import {
  apiDatePeriodToDatePeriod,
  getActiveDatePeriods,
  isHolidayOrEve,
} from '../../common/helpers/opening-hours-helpers';
import { getDatePeriodFormConfig } from '../../services/datePeriodFormConfig';
import HolidaysTable from '../holidays-table/HolidaysTable';
import { getHolidays } from '../../services/holidays';
import OpeningPeriodsList from '../opening-periods-list/OpeningPeriodsList';
import OpeningPeriodsSection from '../opening-periods-section/OpeningPeriodsSection';

const ResourceOpeningHours = ({
  language,
  parentId,
  resource,
  holidaysTableInitiallyOpen = false,
}: {
  language: Language;
  parentId?: number;
  resource: Resource;
  holidaysTableInitiallyOpen?: boolean;
}): JSX.Element | null => {
  const resourceId = resource.id;
  const [error, setError] = useState<Error | undefined>(undefined);
  const [datePeriodConfig, setDatePeriodConfig] =
    useState<UiDatePeriodConfig>();
  const [[normalDatePeriods, exceptions], setDividedDatePeriods] = useState<
    [ActiveDatePeriod[], ActiveDatePeriod[]]
  >([[], []]);
  const [isLoading, setLoading] = useState(false);
  const fetchDatePeriods = async (id: number): Promise<void> => {
    setLoading(true);
    try {
      const [apiDatePeriods, uiDatePeriodOptions] = await Promise.all([
        api.getDatePeriods(id),
        getDatePeriodFormConfig(),
      ]);
      const datePeriods = apiDatePeriods.map(apiDatePeriodToDatePeriod);
      const activeDatePeriods = getActiveDatePeriods(
        new Date().toISOString().split('T')[0],
        datePeriods
      );
      const datePeriodLists = partition(
        datePeriods.map((datePeriod) => ({
          ...datePeriod,
          isActive: activeDatePeriods.includes(datePeriod),
        })),
        (datePeriod) => !datePeriod.override
      );
      setDividedDatePeriods(datePeriodLists);
      setDatePeriodConfig(uiDatePeriodOptions);
    } catch (e) {
      setError(e as Error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDatePeriods(resourceId);
  }, [resourceId]);

  const deletePeriod = async (datePeriodId: number): Promise<void> => {
    await api.deleteDatePeriod(datePeriodId);
    fetchDatePeriods(resourceId);
  };

  const holidays = getHolidays();
  const [holidayDatePeriods, exceptionDatePeriods] = partition(
    exceptions,
    (datePeriod) => isHolidayOrEve(datePeriod, holidays)
  );

  if (error) {
    return (
      <>
        <h1 className="resource-info-title">Virhe</h1>
        <Notification
          label="Toimipisteen aukiolojaksoja ei saatu ladattua."
          type="error">
          Tarkista toimipiste-id.
        </Notification>
      </>
    );
  }

  return (
    <>
      <OpeningPeriodsList
        id="resource-opening-periods-list"
        addDatePeriodButtonText="Lisää aukioloaika +"
        addNewOpeningPeriodButtonDataTest="add-new-opening-period-button"
        title="Aukioloajat"
        datePeriods={normalDatePeriods}
        datePeriodConfig={datePeriodConfig}
        theme="DEFAULT"
        emptyState="Ei määriteltyjä aukioloaikoja. Aloita painamalla “Lisää aukioloaika” -painiketta."
        deletePeriod={deletePeriod}
        language={language}
        isLoading={isLoading}
        newUrl={
          parentId
            ? `/resource/${parentId}/child/${resourceId}/period/new`
            : `/resource/${resourceId}/period/new`
        }
        editUrl={(datePeriod) =>
          parentId
            ? `/resource/${parentId}/child/${resourceId}/period/${datePeriod.id}`
            : `/resource/${resourceId}/period/${datePeriod.id}`
        }
      />
      <OpeningPeriodsList
        id="resource-exception-opening-periods-list"
        addDatePeriodButtonText="Lisää poikkeava päivä +"
        addNewOpeningPeriodButtonDataTest="add-new-exception-opening-period-button"
        datePeriodConfig={datePeriodConfig}
        datePeriods={exceptionDatePeriods}
        deletePeriod={deletePeriod}
        isLoading={isLoading}
        language={language}
        emptyState="Ei poikkeavia päiviä. Voit lisätä poikkeavan päivän painamalla “Lisää poikkeava päivä“ -painiketta."
        theme="LIGHT"
        title="Poikkeavat päivät"
        newUrl={
          parentId
            ? `/resource/${parentId}/child/${resourceId}/exception/new`
            : `/resource/${resourceId}/exception/new`
        }
        editUrl={(datePeriod) =>
          parentId
            ? `/resource/${parentId}/child/${resourceId}/exception/${datePeriod.id}`
            : `/resource/${resourceId}/exception/${datePeriod.id}`
        }
      />
      <OpeningPeriodsSection
        addNewOpeningPeriodButtonDataTest="edit-holidays-button"
        addDatePeriodButtonText="Muokkaa juhlapyhiä"
        datePeriods={holidayDatePeriods}
        isLoading={isLoading}
        newUrl={`/resource/${
          parentId ? `${parentId}/child/${resourceId}` : resourceId
        }/holidays`}
        title="Juhlapyhät"
        theme="LIGHT">
        <HolidaysTable
          datePeriodConfig={datePeriodConfig}
          datePeriods={holidayDatePeriods}
          holidays={holidays}
          initiallyOpen={holidaysTableInitiallyOpen}
        />
      </OpeningPeriodsSection>
    </>
  );
};

export default ResourceOpeningHours;
