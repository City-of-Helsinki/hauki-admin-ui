import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Notification } from 'hds-react';
import { useHistory } from 'react-router-dom';
import {
  DatePeriod,
  Holiday,
  Language,
  Resource,
  UiDatePeriodConfig,
} from '../../common/lib/types';
import api from '../../common/utils/api/api';
import { SecondaryButton } from '../button/Button';

import OpeningPeriod from './opening-period/OpeningPeriod';
import './ResourceOpeningHours.scss';
import {
  getActiveDatePeriod,
  isHoliday,
} from '../../common/helpers/opening-hours-helpers';
import { getDatePeriodFormConfig } from '../../services/datePeriodFormConfig';
import HolidaysTable from '../holidays-table/HolidaysTable';
import { getHolidays } from '../../services/holidays';

const ExceptionPeriodsList = ({
  datePeriodConfig,
  datePeriods,
  holidays,
  resourceId,
}: {
  datePeriodConfig?: UiDatePeriodConfig;
  datePeriods: DatePeriod[];
  holidays: Holiday[];
  resourceId: number;
}): JSX.Element => (
  <section className="opening-periods-section">
    <header className="exception-periods-header">
      <h3 className="exception-periods-title">Poikkeavat päivät</h3>
    </header>
    <ul className="opening-periods-list">
      <li>
        <HolidaysTable
          datePeriodConfig={datePeriodConfig}
          datePeriods={datePeriods}
          holidays={holidays}
          resourceId={resourceId}
        />
      </li>
    </ul>
  </section>
);

enum PeriodsListTheme {
  DEFAULT = 'DEFAULT',
  LIGHT = 'LIGHT',
}

const OpeningPeriodsList = ({
  id,
  parentId,
  addNewOpeningPeriodButtonDataTest,
  resourceId,
  title,
  datePeriods,
  datePeriodConfig,
  theme,
  notFoundLabel,
  deletePeriod,
  language,
}: {
  id: string;
  parentId?: number;
  addNewOpeningPeriodButtonDataTest?: string;
  resourceId: number;
  title: string;
  datePeriods: DatePeriod[];
  datePeriodConfig?: UiDatePeriodConfig;
  theme: PeriodsListTheme;
  notFoundLabel: string;
  deletePeriod: (id: number) => Promise<void>;
  language: Language;
}): JSX.Element => {
  const openingPeriodsHeaderClassName =
    theme === PeriodsListTheme.LIGHT
      ? 'opening-periods-header-light'
      : 'opening-periods-header';

  const history = useHistory();
  const currentDatePeriod = getActiveDatePeriod(
    new Date().toISOString().split('T')[0],
    datePeriods
  );

  return (
    <section className="opening-periods-section">
      <header className={openingPeriodsHeaderClassName}>
        <h3 className="opening-periods-header-title">{title}</h3>
        <p className="period-count">{datePeriods.length} aukioloaikaa</p>
        <SecondaryButton
          dataTest={addNewOpeningPeriodButtonDataTest}
          size="small"
          className="opening-period-header-button"
          light
          onClick={(): void => {
            if (parentId) {
              history.push(
                `/resource/${parentId}/child/${resourceId}/period/new`
              );
            } else {
              history.push(`/resource/${resourceId}/period/new`);
            }
          }}>
          Lisää aukioloaika +
        </SecondaryButton>
      </header>
      {datePeriodConfig && (
        <ul className="opening-periods-list" data-test={id}>
          {datePeriods.length > 0 ? (
            datePeriods.map((datePeriod: DatePeriod, index) => (
              <li key={datePeriod.id}>
                <OpeningPeriod
                  current={currentDatePeriod === datePeriod}
                  datePeriodConfig={datePeriodConfig}
                  datePeriod={datePeriod}
                  resourceId={resourceId}
                  language={language}
                  deletePeriod={deletePeriod}
                  initiallyOpen={index <= 10}
                  parentId={parentId}
                />
              </li>
            ))
          ) : (
            <li>
              <OpeningPeriodsNotFound text={notFoundLabel} />
            </li>
          )}
        </ul>
      )}
    </section>
  );
};

const OpeningPeriodsNotFound = ({ text }: { text: string }): JSX.Element => (
  <p className="opening-periods-not-found">{text}</p>
);

type ResourceOpeningHours = [DatePeriod[], DatePeriod[], DatePeriod[]];

/**
 *  Groups date periods by normal opening hours, holidays and exceptions
 *
 * @param datePeriods Date periods to group
 * @param holidays Holidays to group with
 * @returns Tuple of normal opening hours, holidays and exceptions
 */
const groupWithType = (
  datePeriods: DatePeriod[],
  holidays: Holiday[]
): ResourceOpeningHours =>
  datePeriods.reduce(
    (
      [openingHours, storedHolidays, exceptions]: ResourceOpeningHours,
      current
    ): ResourceOpeningHours => {
      if (current.override) {
        return isHoliday(current, holidays)
          ? [openingHours, [...storedHolidays, current], exceptions]
          : [openingHours, storedHolidays, [...exceptions, current]];
      }
      return [[...openingHours, current], storedHolidays, exceptions];
    },
    [[], [], []]
  );

export default function ResourceOpeningHours({
  language,
  parentId,
  resource,
}: {
  language: Language;
  parentId?: number;
  resource: Resource;
}): JSX.Element | null {
  const resourceId = resource.id;
  const [error, setError] = useState<Error | undefined>(undefined);
  const [datePeriodConfig, setDatePeriodConfig] = useState<
    UiDatePeriodConfig
  >();
  const [
    [defaultPeriods, holidayDatePeriods],
    setDividedDatePeriods,
  ] = useState<ResourceOpeningHours>([[], [], []]);
  const holidays = useMemo(() => getHolidays(), []);
  const fetchDatePeriods = useCallback(
    async (id: number): Promise<void> => {
      try {
        const [apiDatePeriods, uiDatePeriodOptions] = await Promise.all([
          api.getDatePeriods(id),
          getDatePeriodFormConfig(),
        ]);
        const datePeriodLists = groupWithType(apiDatePeriods, holidays);
        setDividedDatePeriods(datePeriodLists);
        setDatePeriodConfig(uiDatePeriodOptions);
      } catch (e) {
        setError(e as Error);
      }
    },
    [holidays]
  );

  useEffect(() => {
    fetchDatePeriods(resourceId);
  }, [resourceId, fetchDatePeriods]);

  const deletePeriod = async (datePeriodId: number): Promise<void> => {
    await api.deleteDatePeriod(datePeriodId);
    fetchDatePeriods(resourceId);
  };

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
        parentId={parentId}
        addNewOpeningPeriodButtonDataTest="add-new-opening-period-button"
        resourceId={resourceId}
        title="Aukioloajat"
        datePeriods={defaultPeriods}
        datePeriodConfig={datePeriodConfig}
        theme={PeriodsListTheme.DEFAULT}
        notFoundLabel="Ei aukiolojaksoja."
        deletePeriod={deletePeriod}
        language={language}
      />
      <ExceptionPeriodsList
        datePeriodConfig={datePeriodConfig}
        datePeriods={holidayDatePeriods}
        holidays={holidays}
        resourceId={resourceId}
      />
    </>
  );
}
