import React, { useEffect, useState } from 'react';
import { Notification } from 'hds-react';
import { useHistory } from 'react-router-dom';
import {
  DatePeriod,
  Language,
  Resource,
  UiDatePeriodConfig,
} from '../../common/lib/types';
import api from '../../common/utils/api/api';
import { SecondaryButton } from '../button/Button';

import OpeningPeriod from './opening-period/OpeningPeriod';
import './ResourceOpeningHours.scss';

enum PeriodsListTheme {
  DEFAULT = 'DEFAULT',
  LIGHT = 'LIGHT',
}

const sortByUpcoming = (dates: DatePeriod[], now: string): DatePeriod[] => {
  if (dates.length === 0) {
    return [];
  }

  let found: DatePeriod & {
    start_date: string;
    end_date: string;
  } = {
    ...dates[0],
    start_date: dates[0].start_date ?? '1975-01-01',
    end_date: dates[0].end_date ?? '2045-01-01',
  };

  for (let i = 1; i < dates.length; i += 1) {
    const date: DatePeriod & {
      start_date: string;
      end_date: string;
    } = {
      ...dates[i],
      start_date: dates[i].start_date ?? '1975-01-01',
      end_date: dates[i].end_date ?? '2045-01-01',
    };
    if (
      date.start_date <= now &&
      date.end_date >= now &&
      date.start_date > found.start_date &&
      new Date(date.end_date).getTime() - new Date(date.start_date).getTime() <
        new Date(found.end_date).getTime() -
          new Date(found.start_date).getTime()
    ) {
      found = date;
    }
  }

  const result = [found];
  const newDates = dates.filter((d) => d.id !== found.id);

  if (dates.length === 0) {
    return result;
  }

  const newStartDate = newDates
    .sort((a, b) =>
      (a.start_date ?? '1975-01-01').localeCompare(b.start_date ?? '1975-01-01')
    )
    .filter((d) => (d.start_date ?? '1975-01-01') >= now)[0]?.start_date;

  return [
    ...result,
    ...sortByUpcoming(
      newDates,
      found.start_date <= now ? newStartDate ?? now : found.start_date
    ),
  ];
};

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
            sortByUpcoming(datePeriods, new Date().toISOString()).map(
              (datePeriod: DatePeriod, index) => (
                <li key={datePeriod.id}>
                  <OpeningPeriod
                    current={false}
                    datePeriodConfig={datePeriodConfig}
                    datePeriod={datePeriod}
                    resourceId={resourceId}
                    language={language}
                    deletePeriod={deletePeriod}
                    initiallyOpen={index <= 10}
                    parentId={parentId}
                  />
                </li>
              )
            )
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

const partitionByOverride = (datePeriods: DatePeriod[]): DatePeriod[][] =>
  datePeriods.reduce(
    ([defaults = [], exceptions = []]: DatePeriod[][], current: DatePeriod) => {
      return current.override
        ? [defaults, [...exceptions, current]]
        : [[...defaults, current], exceptions];
    },
    [[], []]
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
  const [[defaultPeriods], setDividedDatePeriods] = useState<DatePeriod[][]>([
    [],
    [],
  ]);
  const fetchDatePeriods = async (id: number): Promise<void> => {
    try {
      const [apiDatePeriods, uiDatePeriodOptions] = await Promise.all([
        api.getDatePeriods(id),
        api.getDatePeriodFormConfig(),
      ]);
      const datePeriodLists = partitionByOverride(apiDatePeriods);
      setDividedDatePeriods(datePeriodLists);
      setDatePeriodConfig(uiDatePeriodOptions);
    } catch (e) {
      setError(e as Error);
    }
  };

  useEffect(() => {
    fetchDatePeriods(resourceId);
  }, [resourceId]);

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
  );
}
