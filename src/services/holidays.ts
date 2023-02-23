/* eslint-disable @typescript-eslint/ban-ts-comment */
import Holidays, { HolidaysTypes } from 'date-holidays';
import { LanguageStrings } from '../common/lib/types';

const customHolidays: [string, HolidaysTypes.HolidayOptions][] = [
  [
    'thursday after 06-19',
    {
      name: {
        fi: 'Juhannusaaton aatto',
        sv: 'Dagen före midsommarafton',
        en: 'Day before Midsummer Day',
      },
      type: 'optional',
    },
  ],
  [
    'easter -3',
    {
      name: { fi: 'Kiirastorstai', sv: 'Skärtorsdagen', en: 'Maundy Thursday' },
      type: 'optional',
    },
  ],
  [
    'easter -1',
    {
      name: { fi: 'Pääsiäislauantai', sv: 'Påsklördag', en: 'Easter Saturday' },
      type: 'optional',
    },
  ],
  [
    '04-30',
    {
      name: { fi: 'Vappuaatto', sv: 'Valborgsafton', en: 'May Day Eve' },
      type: 'optional',
    },
  ],
  [
    '12-23',
    {
      name: {
        fi: 'Jouluaaton aatto',
        sv: 'Dagen före julafton',
        en: 'Day before Christmas Eve',
      },
      type: 'optional',
    },
  ],
  [
    '12-30',
    {
      name: {
        fi: 'Uudenvuodenaaton aatto',
        sv: 'Dagen före nyårsafton',
        en: "Day before New Year's Eve",
      },
      type: 'optional',
    },
  ],
];

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export type Holiday = {
  date: string;
  name: LanguageStrings;
};

const hd = new Holidays();
hd.init('FI');
// Change translations for May Day. It is called Labour Day in the library.
const mayDay = hd.getRule('05-01');
hd.setRule({
  ...mayDay,
  // @ts-ignore
  name: { ...mayDay.name, sv: 'Valborg', en: 'May Day' },
});
// Missing Swedish translation for Father's day.
const fathersDay = hd.getRule('2nd sunday in November');
hd.setRule({
  ...fathersDay,
  // @ts-ignore
  name: { ...fathersDay.name, sv: 'Fars dag' },
});

customHolidays.forEach(([rule, opts]) => hd.setHoliday(rule, opts));

export const isHoliday = (holiday: Holiday): boolean =>
  hd.isHoliday(holiday.date) !== false;

export const getHolidays = (now: Date | undefined = new Date()): Holiday[] => {
  const currentYear = now.getFullYear();
  const later = new Date();
  const nextYear = currentYear + 1;
  later.setFullYear(nextYear);
  const start = formatDate(now);
  const end = formatDate(later);

  const holidays = [currentYear, nextYear]
    .map((year) => ({
      fi: hd.getHolidays(year, 'fi'),
      sv: hd.getHolidays(year, 'sv'),
      en: hd.getHolidays(year, 'en'),
    }))
    .reduce(
      (
        acc: {
          fi: HolidaysTypes.Holiday;
          sv: HolidaysTypes.Holiday;
          en: HolidaysTypes.Holiday;
        }[],
        elem
      ) =>
        [
          ...acc,
          elem.fi.map((date, i) => ({
            fi: date,
            sv: elem.sv[i],
            en: elem.en[i],
          })),
        ].flat(),
      []
    )
    .map(({ fi, sv, en }) => ({
      date: fi.date.split(' ')[0],
      name: { fi: fi.name, sv: sv.name, en: en.name },
    }))
    .filter((date) => date.date >= start && date.date <= end);

  return holidays;
};
