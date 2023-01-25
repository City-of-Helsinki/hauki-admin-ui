import { UseFormGetValues } from 'react-hook-form';
import { DatePeriod } from '../../lib/types';
import { parseFormDate } from '../date-time/format';

// eslint-disable-next-line import/prefer-default-export
export const endDateAfterStartDate = (
  getValues: UseFormGetValues<DatePeriod>
) => (endDate: string | null): string | undefined => {
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
