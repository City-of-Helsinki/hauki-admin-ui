// Based on https://github.com/City-of-Helsinki/palvelutarjotin-admin/blob/release-0.1.0/src/common/components/datepicker/Month.tsx
import { useMonth } from '@datepicker-react/hooks';
import React from 'react';
import format from 'date-fns/format';
import { fi } from 'date-fns/locale';
import './Datepicker.scss';
import Day from './Day';

type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;

const Month: React.FC<{
  year: number;
  month: number;
  firstDayOfWeek: FirstDayOfWeek;
}> = ({ year, month, firstDayOfWeek }) => {
  const { days, weekdayLabels } = useMonth({
    year,
    month,
    firstDayOfWeek,
    weekdayLabelFormat(date: Date): string {
      return format(date, 'eeeeee', { locale: fi });
    },
  });
  return (
    <div>
      <div className="weekdayRow">
        {weekdayLabels.map((dayLabel) => (
          <div key={dayLabel}>{dayLabel}</div>
        ))}
      </div>
      <div className="datesContainer">
        {days.map((day, index) => {
          if (typeof day === 'object') {
            return (
              <Day
                date={day.date}
                key={day.date.toString()}
                dayLabel={day.dayLabel}
              />
            );
          }
          // eslint-disable-next-line react/no-array-index-key
          return <div key={index} />;
        })}
      </div>
    </div>
  );
};
export default Month;
