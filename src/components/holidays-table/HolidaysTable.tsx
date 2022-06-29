import React from 'react';
import { formatDate } from '../../common/utils/date-time/format';
import { getHolidays } from '../../services/holidays';
import OpeningPeriodAccordion from '../opening-period-accordion/OpeningPeriodAccordion';

const HolidaysTable = (): JSX.Element => {
  const holidays = getHolidays();
  return (
    <OpeningPeriodAccordion
      periodName="Juhlapyhien aukioloajat"
      dateRange={
        <>
          Seuraava juhlapyhä: <strong>{holidays[0].name}</strong> — Ei
          poikkeavia aukioloaikoja
        </>
      }
      editUrl="">
      <div className="exception-holidays-container">
        <h4 id="upcoming-holidays" className="exception-periods-holidays-title">
          Seuraavat juhlapyhät
        </h4>
        <p
          id="upcoming-holidays-description"
          className="exception-periods-holidays-info-text">
          Muista tarkistaa juhlapyhien aikataulut vuosittain – esimerkiksi
          pääsiäisen juhlapyhien ajankohta vaihtelee.
        </p>
      </div>
      <div
        className="holidays-table"
        role="table"
        aria-labelledby="upcoming-holidays"
        aria-describedby="upcoming-holidays-description">
        <div role="rowgroup">
          <div className="holidays-table-header holidays-table-row" role="row">
            <div className="holidays-table-header-cell" role="columnheader">
              Juhlapyhä
            </div>
            <div
              className="holidays-table-header-cell holidays-table-cell__date"
              role="columnheader">
              Päivämäärä
            </div>
            <div
              className="holidays-table-header-cell holidays-table-header-cell__opening-hours"
              role="columnheader">
              Aukiolo
            </div>
          </div>
        </div>
        <div role="rowgroup">
          {holidays.map((holiday) => (
            <div className="holidays-table-row" role="row">
              <div className="holiday-cell holiday-cell__name" role="cell">
                {holiday.name}
              </div>
              <div
                className="holiday-cell holidays-table-cell__date"
                role="cell">
                {formatDate(holiday.start_date).substring(0, 6)}
              </div>
              <div
                className="holiday-cell holidays-table-cell__opening-hours"
                role="cell">
                Ei poikkeavia aukioloja
              </div>
            </div>
          ))}
        </div>
      </div>
    </OpeningPeriodAccordion>
  );
};

export default HolidaysTable;
