import {
  FormWeekdays,
  TimeSpan as TimeSpanApiFormat,
  TimeSpanFormFormat,
} from '../../../common/lib/types';

export function formatTimeSpansToApiFormat(
  timeSpans: TimeSpanFormFormat[]
): TimeSpanApiFormat[] {
  return timeSpans.map((timeSpan) => {
    return {
      description: {
        fi: timeSpan?.description ?? '',
        sv: null,
        en: null,
      },
      end_time: `${timeSpan.endTime}:00`,
      start_time: `${timeSpan.startTime}:00`,
      resource_state: timeSpan.resourceState,
      weekdays: timeSpan.weekdays.reduce(
        (acc: Array<number>, currentValue: boolean, currentIndex: number) => {
          if (currentValue) {
            acc.push(currentIndex + 1);
            return acc;
          }
          return acc;
        },
        []
      ),
    };
  });
}

const dropMilliseconds = (time: string): string => time.slice(0, -3);
const getLowestWeekdayNumber = (timeSpan: TimeSpanApiFormat): number =>
  timeSpan && timeSpan.weekdays ? timeSpan.weekdays.sort()[0] : 0;

export function formatApiTimeSpansToFormFormat(
  apiTimeSpans: TimeSpanApiFormat[]
): TimeSpanFormFormat[] {
  return apiTimeSpans
    .sort((a: TimeSpanApiFormat, b: TimeSpanApiFormat) => {
      return getLowestWeekdayNumber(a) - getLowestWeekdayNumber(b);
    })
    .map((apiTimeSpan) => {
      const weekdays: boolean[] = Array(7)
        .fill(false)
        .map((current, index): boolean =>
          apiTimeSpan.weekdays
            ? apiTimeSpan.weekdays.includes(index + 1)
            : false
        );

      return {
        id: apiTimeSpan.id,
        description: apiTimeSpan.description?.fi || '',
        startTime: apiTimeSpan.start_time
          ? dropMilliseconds(apiTimeSpan.start_time)
          : '',
        endTime: apiTimeSpan.end_time
          ? dropMilliseconds(apiTimeSpan.end_time)
          : '',
        resourceState: apiTimeSpan?.resource_state,
        weekdays: weekdays as FormWeekdays,
      };
    });
}
