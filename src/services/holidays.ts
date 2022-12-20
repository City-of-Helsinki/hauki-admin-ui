import { sub } from 'date-fns';
import Holidays, { HolidaysTypes } from 'date-holidays';
import { LanguageStrings } from '../common/lib/types';

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

type UnofficialHoliday = {
  before: string;
  name: LanguageStrings;
};

export type Holiday = {
  date: string;
  name: LanguageStrings;
  official: boolean;
};

export const isHoliday = (holiday: Holiday): boolean => holiday.official;

const unofficialHolidaysConfig: UnofficialHoliday[] = [
  {
    before: 'Jouluaatto',
    name: {
      fi: 'Jouluaaton aatto',
      sv: 'Dagen före julafton',
      en: 'Day before Christmas Eve',
    },
  },
  {
    before: 'Juhannusaatto',
    name: {
      fi: 'Juhannusaaton aatto',
      sv: 'Dagen före midsommarafton',
      en: 'Day before Midsummer Day',
    },
  },
  {
    before: 'Uudenvuodenaatto',
    name: {
      fi: 'Uudenvuodenaaton aatto',
      sv: 'Dagen före nyårsafton',
      en: "Day before New Year's Eve",
    },
  },
  {
    before: 'Vappu',
    name: {
      fi: 'Vappuaaton aatto',
      sv: 'Dagen före valborg',
      en: 'Day before May Day',
    },
  },
  {
    before: 'Pääsiäispäivä',
    name: {
      fi: 'Pääsiäislauantai',
      sv: 'Påsklördag',
      en: 'Easter Saturday',
    },
  },
];

// eslint-disable-next-line import/prefer-default-export
export const getHolidays = (): Holiday[] => {
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
      official: true,
      date: fi.date.split(' ')[0],
      name: {
        fi: fi.name,
        // There is a bug in the holidays lib
        sv: fi.name === 'Isänpäivä' ? 'Fars dag' : sv.name,
        en: en.name,
      },
    }))
    .filter((date) => date.date >= start && date.date <= end);

  const unofficialHolidays = unofficialHolidaysConfig.map((eve) => {
    const foundHoliday = holidays.find(
      (holiday) => holiday.name.fi === eve.before
    );

    if (!foundHoliday) {
      throw new Error('');
    }

    return {
      official: false,
      date: sub(new Date(foundHoliday.date), { days: 1 })
        .toISOString()
        .split('T')[0],
      name: eve.name,
    };
  });

  return [...holidays, ...unofficialHolidays].sort((a, b) =>
    a?.date.localeCompare(b?.date)
  );
};
