import React from 'react';
import { useAppContext } from '../../App-context';
import { isHolidayOrEve } from '../../common/helpers/opening-hours-helpers';
import {
  DatePeriod,
  UiDatePeriodConfig,
  Language,
} from '../../common/lib/types';
import { formatDate } from '../../common/utils/date-time/format';
import { Holiday, isHoliday } from '../../services/holidays';
import HolidayOpeningHours from '../holiday-opening-hours/HolidayOpeningHours';
import OpeningPeriodAccordion from '../opening-period-accordion/OpeningPeriodAccordion';
import './HolidaysTable.scss';

const findHolidayDatePeriod = (holiday: Holiday, datePeriods: DatePeriod[]) =>
  datePeriods.find((dp) => isHolidayOrEve(dp, [holiday]));

export const UpcomingHolidayNotification = ({
  datePeriodConfig,
  datePeriods,
  holidays,
}: {
  datePeriodConfig?: UiDatePeriodConfig;
  datePeriods: DatePeriod[];
  holidays: Holiday[];
}): JSX.Element => {
  const { language = Language.FI } = useAppContext();
  const nextHoliday = holidays.find(isHoliday);

  if (!nextHoliday) {
    throw new Error('Holiday not found');
  }

  const datePeriod = findHolidayDatePeriod(nextHoliday, datePeriods);

  return (
    <div className="upcoming-holidays">
      <span>
        Seuraava juhlapyhä: <strong>{nextHoliday.name[language]}</strong>
      </span>
      <span className="upcoming-holidays-divider">—</span>
      <HolidayOpeningHours
        datePeriodConfig={datePeriodConfig}
        datePeriod={datePeriod}
      />
    </div>
  );
};

const HolidaysTable = ({
  datePeriodConfig,
  datePeriods,
  holidays,
  initiallyOpen,
}: {
  datePeriodConfig?: UiDatePeriodConfig;
  datePeriods: DatePeriod[];
  holidays: Holiday[];
  initiallyOpen: boolean;
}): JSX.Element => {
  const { language = Language.FI } = useAppContext();
  return (
    <OpeningPeriodAccordion
      initiallyOpen={initiallyOpen}
      id="holidays"
      periodName="Juhlapyhien aukioloajat"
      dateRange={
        <UpcomingHolidayNotification
          datePeriodConfig={datePeriodConfig}
          datePeriods={datePeriods}
          holidays={holidays}
        />
      }>
      <div className="holidays-container">
        <h4 id="holidays-title" className="holidays-title">
          Seuraavat juhlapyhät
        </h4>
        <p id="holidays-description" className="holidays-description">
          Muista tarkistaa juhlapyhien aikataulut vuosittain – esimerkiksi
          pääsiäisen juhlapyhien ajankohta vaihtelee.
        </p>
      </div>
      <div
        className="holidays-table"
        role="table"
        aria-labelledby="holidays-title"
        aria-describedby="holidays-description">
        <div role="rowgroup">
          <div
            className="holidays-table__header holidays-table__row"
            role="row">
            <div className="holidays-table__header-cell" role="columnheader">
              Juhlapyhä
            </div>
            <div
              className="holidays-table__header-cell holidays-table__cell--date"
              role="columnheader">
              Päivämäärä
            </div>
            <div
              className="holidays-table__header-cell holidays-table__header-cell--opening-hours"
              role="columnheader">
              Aukiolo
            </div>
          </div>
        </div>
        <div role="rowgroup">
          {holidays.map((holiday) => (
            <div className="holidays-table__row" role="row" key={holiday.date}>
              <div
                className="holidays-table__cell holidays-table__cell--name"
                role="cell">
                {holiday.name[language]}
              </div>
              <div
                className="holidays-table__cell holidays-table__cell--date"
                role="cell">
                {formatDate(holiday.date)}
              </div>
              <div
                className="holidays-table__cell holidays-table__cell--opening-hours"
                role="cell">
                <HolidayOpeningHours
                  datePeriodConfig={datePeriodConfig}
                  datePeriod={findHolidayDatePeriod(holiday, datePeriods)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </OpeningPeriodAccordion>
  );
};

export default HolidaysTable;
