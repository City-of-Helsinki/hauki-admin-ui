import {
  add,
  differenceInDays as differenceInDaysFn,
  eachDayOfInterval,
} from 'date-fns';
import { getNumberOfTheWeekday, parseFormDate } from './format';

export const getDifferenceInDays = (
  startDate: string | null,
  endDate: string | null
): number => {
  if (startDate && endDate) {
    return differenceInDaysFn(parseFormDate(endDate), parseFormDate(startDate));
  }
  return -1;
};

export const getEnabledWeekdays = (
  startDate: string | null,
  endDate: string | null
): number[] => {
  if (!startDate || !endDate) {
    return [1, 2, 3, 4, 5, 6, 7];
  }

  if (getDifferenceInDays(startDate, endDate) > 6) {
    return [1, 2, 3, 4, 5, 6, 7];
  }

  try {
    const datesBetween = eachDayOfInterval({
      start: parseFormDate(startDate),
      end: parseFormDate(endDate),
    });

    return datesBetween
      .map((date) => getNumberOfTheWeekday(date.toISOString()))
      .sort();
  } catch (e) {
    return [];
  }
};

const findDate = (dates: Date[], day: number) =>
  dates.find((date) => getNumberOfTheWeekday(date.toISOString()) === day);

export const byDateRange =
  (startDate: string | null, endDate: string | null) =>
  (dayA: number, dayB: number): number => {
    if (startDate && endDate && getDifferenceInDays(startDate, endDate) <= 6) {
      const datesBetween = eachDayOfInterval({
        start: parseFormDate(startDate),
        end: add(parseFormDate(startDate), { days: 6 }),
      });
      const dateA = findDate(datesBetween, dayA);
      const dateB = findDate(datesBetween, dayB);

      return (dateA?.getTime() ?? 0) - (dateB?.getTime() ?? 0);
    }

    return dayA - dayB;
  };
