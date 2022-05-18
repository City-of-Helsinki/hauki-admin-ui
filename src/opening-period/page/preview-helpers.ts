import { isEqual } from 'lodash';
import {
  AlternatingOpeningHour,
  OpeningHours,
  OpeningHoursTimeSpan,
} from './types';

const sortOpeningHours = (openingHours: OpeningHours[]): OpeningHours[] =>
  [...openingHours].sort((a, b) => {
    const day1 = a.days.sort()[0];
    const day2 = b.days.sort()[0];

    return day1 - day2;
  });

const alternatingOpeningHourEquals = (
  o1: AlternatingOpeningHour,
  o2: AlternatingOpeningHour
): boolean => {
  if (
    o1.rule.value === o2.rule.value &&
    (o1.timeSpans || []).every((timeSpan1) =>
      o2.timeSpans?.find((timeSpan2) => isEqual(timeSpan1, timeSpan2))
    )
  ) {
    return true;
  }

  return false;
};

const openingHoursRangeEqual = (
  o1: OpeningHours,
  o2: OpeningHours
): boolean => {
  if (
    o1.timeSpans?.length === o2.timeSpans?.length &&
    (o1.timeSpans || []).every((timeSpan1) =>
      o2.timeSpans?.find((timeSpan2) => isEqual(timeSpan1, timeSpan2))
    ) &&
    o1.alternating?.length === o2.alternating?.length &&
    (o1.alternating || []).every((alternatingOpeningHour1) =>
      o2.alternating?.find((alternatingOpeningHour2) =>
        alternatingOpeningHourEquals(
          alternatingOpeningHour1,
          alternatingOpeningHour2
        )
      )
    )
  ) {
    return true;
  }

  return false;
};

const areConsecutiveDays = (
  openingHour1: OpeningHours,
  openingHour2: OpeningHours
): boolean => openingHour2.days.sort()[0] - openingHour1.days.sort()[0] === 1;

const groupByConsecutiveDays = (
  openingHours: OpeningHours[]
): OpeningHours[] => {
  const individualDays: OpeningHours[] = [];

  openingHours.forEach((openingHour) => {
    openingHour.days.forEach((day) => {
      individualDays.push({ ...openingHour, days: [day] });
    });
  });

  const groups: OpeningHours[][] = [[]];
  let i = 0;

  individualDays
    .sort((a, b) => {
      return a.days[0] - b.days[0];
    })
    .forEach((openingHour, idx, arr) => {
      groups[i].push(openingHour);

      if (idx === arr.length - 1) {
        return;
      }

      const nextOpeningHour = arr[idx + 1];

      if (
        areConsecutiveDays(openingHour, nextOpeningHour) &&
        openingHoursRangeEqual(openingHour, nextOpeningHour)
      ) {
        return;
      }

      i += 1;
      groups[i] = [];
    });

  return groups.reduce((result, group) => {
    return [
      ...result,
      group.reduce((newOpeningHour, openingHour) => {
        return {
          ...openingHour,
          days: [...newOpeningHour.days, ...openingHour.days],
        };
      }),
    ];
  }, []);
};

// eslint-disable-next-line import/prefer-default-export
export const groupOpeningHoursForPreview = (
  openingHours: OpeningHours[]
): OpeningHours[] => sortOpeningHours(groupByConsecutiveDays(openingHours));

export const sortTimeSpans = (
  timeSpans: OpeningHoursTimeSpan[]
): OpeningHoursTimeSpan[] =>
  [...timeSpans].sort((a, b) => {
    return a.start ? a.start.localeCompare(b.start ?? '') : -1;
  });
