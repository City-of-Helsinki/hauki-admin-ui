import { getHolidays } from './holidays';

describe('holidays', () => {
  describe('getHolidays', () => {
    it("should return calendar year's holidays", () => {
      expect(getHolidays(new Date('2023-01-01'))).toMatchInlineSnapshot(`
        Array [
          Object {
            "date": "2023-01-01",
            "name": Object {
              "en": "New Year's Day",
              "fi": "Uudenvuodenpäivä",
              "sv": "Nyårsdagen",
            },
          },
          Object {
            "date": "2023-01-06",
            "name": Object {
              "en": "Epiphany",
              "fi": "Loppiainen",
              "sv": "Trettondedag jul",
            },
          },
          Object {
            "date": "2023-04-06",
            "name": Object {
              "en": "Maundy Thursday",
              "fi": "Kiirastorstai",
              "sv": "Skärtorsdagen",
            },
          },
          Object {
            "date": "2023-04-07",
            "name": Object {
              "en": "Good Friday",
              "fi": "Pitkäperjantai",
              "sv": "Långfredagen",
            },
          },
          Object {
            "date": "2023-04-08",
            "name": Object {
              "en": "Easter Saturday",
              "fi": "Pääsiäislauantai",
              "sv": "Påsklördag",
            },
          },
          Object {
            "date": "2023-04-09",
            "name": Object {
              "en": "Easter Sunday",
              "fi": "Pääsiäispäivä",
              "sv": "Påskdagen",
            },
          },
          Object {
            "date": "2023-04-10",
            "name": Object {
              "en": "Easter Monday",
              "fi": "2. pääsiäispäivä",
              "sv": "Annandag påsk",
            },
          },
          Object {
            "date": "2023-04-30",
            "name": Object {
              "en": "May Day Eve",
              "fi": "Vappuaatto",
              "sv": "Valborgsafton",
            },
          },
          Object {
            "date": "2023-05-01",
            "name": Object {
              "en": "May Day",
              "fi": "Vappu",
              "sv": "Valborg",
            },
          },
          Object {
            "date": "2023-05-14",
            "name": Object {
              "en": "Mother's Day",
              "fi": "Äitienpäivä",
              "sv": "Mors dag",
            },
          },
          Object {
            "date": "2023-05-18",
            "name": Object {
              "en": "Ascension Day",
              "fi": "Helatorstai",
              "sv": "Kristi himmelfärds dag",
            },
          },
          Object {
            "date": "2023-05-28",
            "name": Object {
              "en": "Pentecost",
              "fi": "Helluntaipäivä",
              "sv": "Pingstdagen",
            },
          },
          Object {
            "date": "2023-06-22",
            "name": Object {
              "en": "Day before Midsummer Day",
              "fi": "Juhannusaaton aatto",
              "sv": "Dagen före midsommarafton",
            },
          },
          Object {
            "date": "2023-06-23",
            "name": Object {
              "en": "Midsummer Eve",
              "fi": "Juhannusaatto",
              "sv": "Midsommarafton",
            },
          },
          Object {
            "date": "2023-06-24",
            "name": Object {
              "en": "Midsummer Day",
              "fi": "Juhannuspäivä",
              "sv": "Midsommardagen",
            },
          },
          Object {
            "date": "2023-11-04",
            "name": Object {
              "en": "All Saints' Day",
              "fi": "Pyhäinpäivä",
              "sv": "Alla Helgons dag",
            },
          },
          Object {
            "date": "2023-11-12",
            "name": Object {
              "en": "Father's Day",
              "fi": "Isänpäivä",
              "sv": "Fars dag",
            },
          },
          Object {
            "date": "2023-12-06",
            "name": Object {
              "en": "Independence Day",
              "fi": "Itsenäisyyspäivä",
              "sv": "Självständighetsdagen",
            },
          },
          Object {
            "date": "2023-12-23",
            "name": Object {
              "en": "Day before Christmas Eve",
              "fi": "Jouluaaton aatto",
              "sv": "Dagen före julafton",
            },
          },
          Object {
            "date": "2023-12-24",
            "name": Object {
              "en": "Christmas Eve",
              "fi": "Jouluaatto",
              "sv": "Julafton",
            },
          },
          Object {
            "date": "2023-12-25",
            "name": Object {
              "en": "Christmas Day",
              "fi": "Joulupäivä",
              "sv": "Juldagen",
            },
          },
          Object {
            "date": "2023-12-26",
            "name": Object {
              "en": "Boxing Day",
              "fi": "2. joulupäivä",
              "sv": "Annandag jul",
            },
          },
          Object {
            "date": "2023-12-30",
            "name": Object {
              "en": "Day before New Year's Eve",
              "fi": "Uudenvuodenaaton aatto",
              "sv": "Dagen före nyårsafton",
            },
          },
          Object {
            "date": "2023-12-31",
            "name": Object {
              "en": "New Year's Eve",
              "fi": "Uudenvuodenaatto",
              "sv": "Nyårsafton",
            },
          },
          Object {
            "date": "2024-01-01",
            "name": Object {
              "en": "New Year's Day",
              "fi": "Uudenvuodenpäivä",
              "sv": "Nyårsdagen",
            },
          },
          Object {
            "date": "2024-01-06",
            "name": Object {
              "en": "Epiphany",
              "fi": "Loppiainen",
              "sv": "Trettondedag jul",
            },
          },
          Object {
            "date": "2024-03-28",
            "name": Object {
              "en": "Maundy Thursday",
              "fi": "Kiirastorstai",
              "sv": "Skärtorsdagen",
            },
          },
          Object {
            "date": "2024-03-29",
            "name": Object {
              "en": "Good Friday",
              "fi": "Pitkäperjantai",
              "sv": "Långfredagen",
            },
          },
          Object {
            "date": "2024-03-30",
            "name": Object {
              "en": "Easter Saturday",
              "fi": "Pääsiäislauantai",
              "sv": "Påsklördag",
            },
          },
          Object {
            "date": "2024-03-31",
            "name": Object {
              "en": "Easter Sunday",
              "fi": "Pääsiäispäivä",
              "sv": "Påskdagen",
            },
          },
        ]
      `);
      expect(getHolidays(new Date('2024-01-01'))).toMatchInlineSnapshot(`
        Array [
          Object {
            "date": "2024-01-01",
            "name": Object {
              "en": "New Year's Day",
              "fi": "Uudenvuodenpäivä",
              "sv": "Nyårsdagen",
            },
          },
          Object {
            "date": "2024-01-06",
            "name": Object {
              "en": "Epiphany",
              "fi": "Loppiainen",
              "sv": "Trettondedag jul",
            },
          },
          Object {
            "date": "2024-03-28",
            "name": Object {
              "en": "Maundy Thursday",
              "fi": "Kiirastorstai",
              "sv": "Skärtorsdagen",
            },
          },
          Object {
            "date": "2024-03-29",
            "name": Object {
              "en": "Good Friday",
              "fi": "Pitkäperjantai",
              "sv": "Långfredagen",
            },
          },
          Object {
            "date": "2024-03-30",
            "name": Object {
              "en": "Easter Saturday",
              "fi": "Pääsiäislauantai",
              "sv": "Påsklördag",
            },
          },
          Object {
            "date": "2024-03-31",
            "name": Object {
              "en": "Easter Sunday",
              "fi": "Pääsiäispäivä",
              "sv": "Påskdagen",
            },
          },
          Object {
            "date": "2024-04-01",
            "name": Object {
              "en": "Easter Monday",
              "fi": "2. pääsiäispäivä",
              "sv": "Annandag påsk",
            },
          },
          Object {
            "date": "2024-04-30",
            "name": Object {
              "en": "May Day Eve",
              "fi": "Vappuaatto",
              "sv": "Valborgsafton",
            },
          },
          Object {
            "date": "2024-05-01",
            "name": Object {
              "en": "May Day",
              "fi": "Vappu",
              "sv": "Valborg",
            },
          },
          Object {
            "date": "2024-05-09",
            "name": Object {
              "en": "Ascension Day",
              "fi": "Helatorstai",
              "sv": "Kristi himmelfärds dag",
            },
          },
          Object {
            "date": "2024-05-12",
            "name": Object {
              "en": "Mother's Day",
              "fi": "Äitienpäivä",
              "sv": "Mors dag",
            },
          },
          Object {
            "date": "2024-05-19",
            "name": Object {
              "en": "Pentecost",
              "fi": "Helluntaipäivä",
              "sv": "Pingstdagen",
            },
          },
          Object {
            "date": "2024-06-20",
            "name": Object {
              "en": "Day before Midsummer Day",
              "fi": "Juhannusaaton aatto",
              "sv": "Dagen före midsommarafton",
            },
          },
          Object {
            "date": "2024-06-21",
            "name": Object {
              "en": "Midsummer Eve",
              "fi": "Juhannusaatto",
              "sv": "Midsommarafton",
            },
          },
          Object {
            "date": "2024-06-22",
            "name": Object {
              "en": "Midsummer Day",
              "fi": "Juhannuspäivä",
              "sv": "Midsommardagen",
            },
          },
          Object {
            "date": "2024-11-02",
            "name": Object {
              "en": "All Saints' Day",
              "fi": "Pyhäinpäivä",
              "sv": "Alla Helgons dag",
            },
          },
          Object {
            "date": "2024-11-10",
            "name": Object {
              "en": "Father's Day",
              "fi": "Isänpäivä",
              "sv": "Fars dag",
            },
          },
          Object {
            "date": "2024-12-06",
            "name": Object {
              "en": "Independence Day",
              "fi": "Itsenäisyyspäivä",
              "sv": "Självständighetsdagen",
            },
          },
          Object {
            "date": "2024-12-23",
            "name": Object {
              "en": "Day before Christmas Eve",
              "fi": "Jouluaaton aatto",
              "sv": "Dagen före julafton",
            },
          },
          Object {
            "date": "2024-12-24",
            "name": Object {
              "en": "Christmas Eve",
              "fi": "Jouluaatto",
              "sv": "Julafton",
            },
          },
          Object {
            "date": "2024-12-25",
            "name": Object {
              "en": "Christmas Day",
              "fi": "Joulupäivä",
              "sv": "Juldagen",
            },
          },
          Object {
            "date": "2024-12-26",
            "name": Object {
              "en": "Boxing Day",
              "fi": "2. joulupäivä",
              "sv": "Annandag jul",
            },
          },
          Object {
            "date": "2024-12-30",
            "name": Object {
              "en": "Day before New Year's Eve",
              "fi": "Uudenvuodenaaton aatto",
              "sv": "Dagen före nyårsafton",
            },
          },
          Object {
            "date": "2024-12-31",
            "name": Object {
              "en": "New Year's Eve",
              "fi": "Uudenvuodenaatto",
              "sv": "Nyårsafton",
            },
          },
          Object {
            "date": "2025-01-01",
            "name": Object {
              "en": "New Year's Day",
              "fi": "Uudenvuodenpäivä",
              "sv": "Nyårsdagen",
            },
          },
          Object {
            "date": "2025-01-06",
            "name": Object {
              "en": "Epiphany",
              "fi": "Loppiainen",
              "sv": "Trettondedag jul",
            },
          },
        ]
      `);
      expect(getHolidays(new Date('2025-01-01'))).toMatchInlineSnapshot(`
        Array [
          Object {
            "date": "2025-01-01",
            "name": Object {
              "en": "New Year's Day",
              "fi": "Uudenvuodenpäivä",
              "sv": "Nyårsdagen",
            },
          },
          Object {
            "date": "2025-01-06",
            "name": Object {
              "en": "Epiphany",
              "fi": "Loppiainen",
              "sv": "Trettondedag jul",
            },
          },
          Object {
            "date": "2025-04-17",
            "name": Object {
              "en": "Maundy Thursday",
              "fi": "Kiirastorstai",
              "sv": "Skärtorsdagen",
            },
          },
          Object {
            "date": "2025-04-18",
            "name": Object {
              "en": "Good Friday",
              "fi": "Pitkäperjantai",
              "sv": "Långfredagen",
            },
          },
          Object {
            "date": "2025-04-19",
            "name": Object {
              "en": "Easter Saturday",
              "fi": "Pääsiäislauantai",
              "sv": "Påsklördag",
            },
          },
          Object {
            "date": "2025-04-20",
            "name": Object {
              "en": "Easter Sunday",
              "fi": "Pääsiäispäivä",
              "sv": "Påskdagen",
            },
          },
          Object {
            "date": "2025-04-21",
            "name": Object {
              "en": "Easter Monday",
              "fi": "2. pääsiäispäivä",
              "sv": "Annandag påsk",
            },
          },
          Object {
            "date": "2025-04-30",
            "name": Object {
              "en": "May Day Eve",
              "fi": "Vappuaatto",
              "sv": "Valborgsafton",
            },
          },
          Object {
            "date": "2025-05-01",
            "name": Object {
              "en": "May Day",
              "fi": "Vappu",
              "sv": "Valborg",
            },
          },
          Object {
            "date": "2025-05-11",
            "name": Object {
              "en": "Mother's Day",
              "fi": "Äitienpäivä",
              "sv": "Mors dag",
            },
          },
          Object {
            "date": "2025-05-29",
            "name": Object {
              "en": "Ascension Day",
              "fi": "Helatorstai",
              "sv": "Kristi himmelfärds dag",
            },
          },
          Object {
            "date": "2025-06-08",
            "name": Object {
              "en": "Pentecost",
              "fi": "Helluntaipäivä",
              "sv": "Pingstdagen",
            },
          },
          Object {
            "date": "2025-06-19",
            "name": Object {
              "en": "Day before Midsummer Day",
              "fi": "Juhannusaaton aatto",
              "sv": "Dagen före midsommarafton",
            },
          },
          Object {
            "date": "2025-06-20",
            "name": Object {
              "en": "Midsummer Eve",
              "fi": "Juhannusaatto",
              "sv": "Midsommarafton",
            },
          },
          Object {
            "date": "2025-06-21",
            "name": Object {
              "en": "Midsummer Day",
              "fi": "Juhannuspäivä",
              "sv": "Midsommardagen",
            },
          },
          Object {
            "date": "2025-11-01",
            "name": Object {
              "en": "All Saints' Day",
              "fi": "Pyhäinpäivä",
              "sv": "Alla Helgons dag",
            },
          },
          Object {
            "date": "2025-11-09",
            "name": Object {
              "en": "Father's Day",
              "fi": "Isänpäivä",
              "sv": "Fars dag",
            },
          },
          Object {
            "date": "2025-12-06",
            "name": Object {
              "en": "Independence Day",
              "fi": "Itsenäisyyspäivä",
              "sv": "Självständighetsdagen",
            },
          },
          Object {
            "date": "2025-12-23",
            "name": Object {
              "en": "Day before Christmas Eve",
              "fi": "Jouluaaton aatto",
              "sv": "Dagen före julafton",
            },
          },
          Object {
            "date": "2025-12-24",
            "name": Object {
              "en": "Christmas Eve",
              "fi": "Jouluaatto",
              "sv": "Julafton",
            },
          },
          Object {
            "date": "2025-12-25",
            "name": Object {
              "en": "Christmas Day",
              "fi": "Joulupäivä",
              "sv": "Juldagen",
            },
          },
          Object {
            "date": "2025-12-26",
            "name": Object {
              "en": "Boxing Day",
              "fi": "2. joulupäivä",
              "sv": "Annandag jul",
            },
          },
          Object {
            "date": "2025-12-30",
            "name": Object {
              "en": "Day before New Year's Eve",
              "fi": "Uudenvuodenaaton aatto",
              "sv": "Dagen före nyårsafton",
            },
          },
          Object {
            "date": "2025-12-31",
            "name": Object {
              "en": "New Year's Eve",
              "fi": "Uudenvuodenaatto",
              "sv": "Nyårsafton",
            },
          },
          Object {
            "date": "2026-01-01",
            "name": Object {
              "en": "New Year's Day",
              "fi": "Uudenvuodenpäivä",
              "sv": "Nyårsdagen",
            },
          },
          Object {
            "date": "2026-01-06",
            "name": Object {
              "en": "Epiphany",
              "fi": "Loppiainen",
              "sv": "Trettondedag jul",
            },
          },
        ]
      `);
    });
  });
});
