/* eslint-disable @typescript-eslint/ban-ts-comment */
import Holidays, { HolidaysTypes } from 'date-holidays';
import { LanguageStrings } from '../common/lib/types';

const customHolidays: [string, HolidaysTypes.HolidayOptions][] = [
  [
    '01-05',
    {
      name: {
        fi: 'Loppiaisen aatto',
        sv: 'Dagen före Trettondedag jul',
        en: 'Epiphany Eve',
      },
      type: 'optional',
    },
  ],
  [
    'thursday after 06-18',
    {
      name: {
        fi: 'Juhannusaaton aatto',
        sv: 'Dagen före midsommarafton',
        en: 'Day before Midsummer Eve',
      },
      type: 'optional',
    },
  ],
  [
    'sunday after 06-21',
    {
      name: {
        fi: 'Juhannuksen jälkeinen sunnuntai',
        sv: 'Söndag efter  Midsommardagen',
        en: 'Sunday after Midsummer Day',
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
    'easter +38',
    {
      name: {
        fi: 'Helatorstain aatto',
        sv: 'Dagen före Kristi himmelfärds dag',
        en: 'Ascension Day Eve',
      },
      type: 'optional',
    },
  ],
  [
    'easter +39',
    {
      name: {
        fi: 'Helatorstai',
        sv: 'Kristi himmelfärds dag',
        en: 'Ascension Day',
      },
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
    '12-06',
    {
      name: {
        fi: 'Itsenäisyyspäivän aatto',
        sv: 'Dagen före Självständighetsdagen',
        en: 'Independence Day Eve',
      },
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
    '12-26',
    {
      name: {
        fi: 'Tapaninpäivä',
        sv: 'Annandag jul',
        en: 'Boxing Day',
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
  const later = new Date(now);
  const nextYear = currentYear + 1;
  later.setFullYear(nextYear);
  later.setDate(later.getDate() - 1);
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
