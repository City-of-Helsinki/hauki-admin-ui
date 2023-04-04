import { UseFormGetValues } from 'react-hook-form';
import { DatePeriod } from '../../lib/types';
import { parseFormDate, transformDateToApiFormat } from '../date-time/format';

export const endDateAfterStartDate =
  (getValues: UseFormGetValues<DatePeriod>) =>
  (endDate: string | null): string | undefined => {
    const { startDate } = getValues();
    if (endDate && startDate) {
      const endDateParsed = parseFormDate(endDate);
      const startDateParsed = parseFormDate(startDate);
      if (endDateParsed.getTime() < startDateParsed.getTime()) {
        return 'Päättymispäivän tulee olla sama tai alkamispäivämäärää myöhemmin';
      }
      return undefined;
    }
    return undefined;
  };

export const isValidDate = (date: string): string | undefined => {
  try {
    transformDateToApiFormat(date);
    return undefined;
  } catch (e) {
    return 'Tarkista päivämäärä';
  }
};
