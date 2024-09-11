import React from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'hds-react';
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
import {
  DatePeriodSelectState,
  useSelectedDatePeriodsContext,
} from '../../common/selectedDatePeriodsContext/SelectedDatePeriodsContext';

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
  const { t } = useTranslation();
  const { language = Language.FI } = useAppContext();
  const nextHoliday = holidays.find(isHoliday);

  if (!nextHoliday) {
    throw new Error('Holiday not found');
  }

  const datePeriod = findHolidayDatePeriod(nextHoliday, datePeriods);

  return (
    <div className="upcoming-holidays">
      <span>
        {t('OpeningHours.NextHoliday')}
        <strong>{nextHoliday.name[language]}</strong>
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
  const { t } = useTranslation();
  const { language = Language.FI } = useAppContext();
  const { selectedDatePeriods, toggleDatePeriod, datePeriodSelectState } =
    useSelectedDatePeriodsContext();

  const toggleChecked = (datePeriod: DatePeriod): void => {
    toggleDatePeriod(datePeriod);
  };

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
          {t('ResourcePage.HolidaysTableTitle')}
        </h4>
        <p id="holidays-description" className="holidays-description">
          {t('ResourcePage.HolidaysTableDescription')}
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
              {t('ResourcePage.HolidaysTableHolidayColumn')}
            </div>
            <div
              className="holidays-table__header-cell holidays-table__cell--date"
              role="columnheader">
              {t('ResourcePage.HolidaysTableDateColumn')}
            </div>
            <div
              className="holidays-table__header-cell holidays-table__header-cell--opening-hours"
              role="columnheader">
              {t('ResourcePage.HolidaysTableOpeningHoursColumn')}
            </div>
          </div>
        </div>
        <div role="rowgroup">
          {holidays.map((holiday) => {
            const holidayDatePeriod = findHolidayDatePeriod(
              holiday,
              datePeriods
            );
            return (
              <div
                className="holidays-table__row"
                role="row"
                key={holiday.date}>
                <div
                  className="holidays-table__cell holidays-table__cell--name"
                  role="cell">
                  {holidayDatePeriod !== undefined &&
                    holidayDatePeriod?.id &&
                    datePeriodSelectState === DatePeriodSelectState.ACTIVE && (
                      <Checkbox
                        id={holidayDatePeriod.id?.toString() || ''}
                        checked={selectedDatePeriods.some(
                          (dp) => dp.id === holidayDatePeriod.id
                        )}
                        onChange={() => {
                          toggleChecked(holidayDatePeriod);
                        }}
                        className="holidays-table-checkbox"
                      />
                    )}
                  {datePeriodSelectState === DatePeriodSelectState.ACTIVE ? (
                    <label htmlFor={holidayDatePeriod?.id?.toString() || ''}>
                      {holiday.name[language]}
                    </label>
                  ) : (
                    holiday.name[language]
                  )}
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
                    datePeriod={holidayDatePeriod}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </OpeningPeriodAccordion>
  );
};

export default HolidaysTable;
