import parse from 'date-fns/parse';
import format from 'date-fns/format';

export const dateApiFormat = 'yyyy-MM-dd';
export const dateFormFormat = 'dd.MM.yyyy';
export const datetimeFormFormat = `${dateFormFormat} HH:mm`;

export const formatDate = (date: string): string =>
  format(new Date(date), dateFormFormat);

export const formatDateRange = ({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
}): string => {
  if (!startDate || (!startDate && !endDate)) {
    return '';
  }

  if (!endDate) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export const transformDateToApiFormat = (formDate: string): string =>
  format(parse(formDate, dateFormFormat, new Date()), dateApiFormat);
