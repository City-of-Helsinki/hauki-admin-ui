import Holidays from 'date-holidays';

const hd = new Holidays();
hd.init('FI');

type Holiday = {
  start_date: string;
  end_date: string;
  name: string;
};

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

// eslint-disable-next-line import/prefer-default-export
export const getHolidays = (): Holiday[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const start = formatDate(now);
  const later = new Date();
  const nextYear = currentYear + 1;
  later.setFullYear(nextYear);
  const end = formatDate(later);

  return [currentYear, currentYear + 1]
    .map((year) => hd.getHolidays(year))
    .flat()
    .map((date) => ({
      start_date: formatDate(date.start),
      end_date: formatDate(date.end),
      name: date.name,
    }))
    .filter((date) => date.start_date >= start && date.end_date <= end);
};
