import React, { useCallback, useEffect, useState } from 'react';
import { partition } from 'lodash';
import { Notification } from 'hds-react';
import {
  Language,
  Resource,
  UiDatePeriodConfig,
  DatePeriod,
  DatePeriodType,
} from '../../common/lib/types';
import api from '../../common/utils/api/api';
import {
  apiDatePeriodToDatePeriod,
  getActiveDatePeriods,
  isHolidayOrEve,
} from '../../common/helpers/opening-hours-helpers';
import { getDatePeriodFormConfig } from '../../services/datePeriodFormConfig';
import { getHolidays } from '../../services/holidays';
import OpeningPeriodsList from '../opening-periods-list/OpeningPeriodsList';
import {
  DatePeriodSelectState,
  useSelectedDatePeriodsContext,
} from '../../common/selectedDatePeriodsContext/SelectedDatePeriodsContext';
import { PrimaryButton } from '../button/Button';

const ResourceOpeningHours = ({
  language,
  parentId,
  resource,
}: {
  language: Language;
  parentId?: number;
  resource: Resource;
}): JSX.Element | null => {
  const resourceId = resource.id;
  const [error, setError] = useState<Error | undefined>(undefined);
  const [datePeriodConfig, setDatePeriodConfig] =
    useState<UiDatePeriodConfig>();
  const [[normalDatePeriods, exceptions], setDividedDatePeriods] = useState<
    [DatePeriod[], DatePeriod[]]
  >([[], []]);
  const [isLoading, setLoading] = useState(false);
  const {
    addDatePeriods,
    clearDatePeriods,
    datePeriodSelectState,
    selectedDatePeriods,
    updateSelectedDatePeriods,
  } = useSelectedDatePeriodsContext();

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

  const allDatePeriodsSelected =
    selectedDatePeriods.length ===
      normalDatePeriods.length + exceptions.length &&
    selectedDatePeriods.length > 0;

  const onChangeHandler = (): void => {
    if (!allDatePeriodsSelected) {
      const allDatePeriods = [...normalDatePeriods, ...exceptions];
      addDatePeriods(allDatePeriods);
    } else {
      clearDatePeriods();
    }
  };

  // used to add the type to the datePeriods
  const filterDatePeriodsAndAddType = useCallback(
    (datePeriods: DatePeriod[], type: DatePeriodType): DatePeriod[] => {
      return datePeriods
        .filter((dp) => selectedDatePeriods.some((d) => d.id === dp.id))
        .map((dp) => ({ ...dp, type }));
    },
    [selectedDatePeriods]
  );

  // this is the ONLY place where we still have the information about the datePeriod type!
  useEffect(() => {
    const selectedNormalDatePeriods = filterDatePeriodsAndAddType(
      normalDatePeriods,
      DatePeriodType.NORMAL
    );
    const selectedExceptionDatePeriods = filterDatePeriodsAndAddType(
      exceptionDatePeriods,
      DatePeriodType.EXCEPTION
    );
    const selectedHolidaynDatePeriods = filterDatePeriodsAndAddType(
      holidayDatePeriods,
      DatePeriodType.HOLIDAY
    );

    const joinedData: DatePeriod[] = [
      ...selectedNormalDatePeriods,
      ...selectedExceptionDatePeriods,
      ...selectedHolidaynDatePeriods,
    ];

    updateSelectedDatePeriods(joinedData);
  }, [
    exceptionDatePeriods,
    filterDatePeriodsAndAddType,
    holidayDatePeriods,
    normalDatePeriods,
    selectedDatePeriods,
    updateSelectedDatePeriods,
  ]);

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
      {datePeriodSelectState === DatePeriodSelectState.ACTIVE && (
        <PrimaryButton
          onClick={onChangeHandler}
          style={{ marginBottom: 'var(--spacing-m)' }}>
          {allDatePeriodsSelected ? 'Poista valinnat' : 'Valitse kaikki'}
        </PrimaryButton>
      )}
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
      <OpeningPeriodsList
        id="resource-holiday-opening-periods-list"
        addDatePeriodButtonText="Muokkaa juhlapyhiä"
        addNewOpeningPeriodButtonDataTest="edit-holidays-button"
        datePeriodConfig={datePeriodConfig}
        datePeriods={holidayDatePeriods}
        deletePeriod={deletePeriod}
        isLoading={isLoading}
        language={language}
        emptyState="Ei juhlapyhiä."
        theme="LIGHT"
        title="Juhlapyhät"
        newUrl={`/resource/${
          parentId ? `${parentId}/child/${resourceId}` : resourceId
        }/holidays`}
      />
    </>
  );
};

export default ResourceOpeningHours;
