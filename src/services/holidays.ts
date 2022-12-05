import { sub } from 'date-fns';
import Holidays, { HolidaysTypes } from 'date-holidays';
import { LanguageStrings } from '../common/lib/types';

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

type Eve = {
  for: string;
  name: LanguageStrings;
};

export type Holiday = {
  date: string;
  name: LanguageStrings;
  eve: boolean;
};

export const isHoliday = (holiday: Holiday): boolean => !holiday.eve;

const eves: Eve[] = [
  {
    for: 'Jouluaatto',
    name: {
      fi: 'Jouluaaton aatto',
      sv: 'Dagen före julafton',
      en: 'Day before Christmas Eve',
    },
  },
  {
    for: 'Juhannusaatto',
    name: {
      fi: 'Juhannusaaton aatto',
      sv: 'Dagen före midsommarafton',
      en: 'Day before Midsummer Day',
    },
  },
  {
    for: 'Uudenvuodenaatto',
    name: {
      fi: 'Uudenvuodenaaton aatto',
      sv: 'Dagen före nyårsafton',
      en: "Day before New Year's Eve",
    },
  },
  {
    for: 'Vappu',
    name: {
      fi: 'Vappuaaton aatto',
      sv: 'Dagen före valborg',
      en: 'Day before May Day',
    },
  },
];

// eslint-disable-next-line import/prefer-default-export
export const getHolidaysAndEves = (): Holiday[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const start = formatDate(now);
  const later = new Date();
  const nextYear = currentYear + 1;
  later.setFullYear(nextYear);
  const end = formatDate(later);

  const hd = new Holidays();
  hd.init('FI');

  const holidays = [currentYear, currentYear + 1]
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
      eve: false,
      date: fi.date.split(' ')[0],
      name: {
        fi: fi.name,
        // There is a bug in the holidays lib
        sv: fi.name === 'Isänpäivä' ? 'Fars dag' : sv.name,
        en: en.name,
      },
    }))
    .filter((date) => date.date >= start && date.date <= end);

  const foundEves = eves.map((eve) => {
    const foundHoliday = holidays.find(
      (holiday) => holiday.name.fi === eve.for
    );

    if (!foundHoliday) {
      throw new Error('');
    }

    return {
      eve: true,
      date: sub(new Date(foundHoliday.date), { days: 1 })
        .toISOString()
        .split('T')[0],
      name: eve.name,
    };
  });

  return [...holidays, ...foundEves].sort((a, b) =>
    a?.date.localeCompare(b?.date)
  );
};
