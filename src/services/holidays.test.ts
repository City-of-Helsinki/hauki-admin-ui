import { getHolidays } from './holidays';

describe('holidays', () => {
  describe('getHolidays', () => {
    it("should return calendar year's holidays", () => {
      expect(getHolidays(new Date('2023-01-01'))).toMatchInlineSnapshot(`
        [
          {
            "date": "2023-01-01",
            "name": {
              "en": "New Year's Day",
              "fi": "Uudenvuodenpäivä",
              "sv": "Nyårsdagen",
            },
          },
          {
            "date": "2023-01-05",
            "name": {
              "en": "Epiphany Eve",
              "fi": "Loppiaisen aatto",
              "sv": "Dagen före Trettondedag jul",
            },
          },
          {
            "date": "2023-01-06",
            "name": {
              "en": "Epiphany",
              "fi": "Loppiainen",
              "sv": "Trettondedag jul",
            },
          },
          {
            "date": "2023-04-06",
            "name": {
              "en": "Maundy Thursday",
              "fi": "Kiirastorstai",
              "sv": "Skärtorsdagen",
            },
          },
          {
            "date": "2023-04-07",
            "name": {
              "en": "Good Friday",
              "fi": "Pitkäperjantai",
              "sv": "Långfredagen",
            },
          },
          {
            "date": "2023-04-08",
            "name": {
              "en": "Easter Saturday",
              "fi": "Pääsiäislauantai",
              "sv": "Påsklördag",
            },
          },
          {
            "date": "2023-04-09",
            "name": {
              "en": "Easter Sunday",
              "fi": "Pääsiäispäivä",
              "sv": "Påskdagen",
            },
          },
          {
            "date": "2023-04-10",
            "name": {
              "en": "Easter Monday",
              "fi": "2. pääsiäispäivä",
              "sv": "Annandag påsk",
            },
          },
          {
            "date": "2023-04-30",
            "name": {
              "en": "May Day Eve",
              "fi": "Vappuaatto",
              "sv": "Valborgsafton",
            },
          },
          {
            "date": "2023-05-01",
            "name": {
              "en": "May Day",
              "fi": "Vappu",
              "sv": "Valborg",
            },
          },
          {
            "date": "2023-05-14",
            "name": {
              "en": "Mother's Day",
              "fi": "Äitienpäivä",
              "sv": "Mors dag",
            },
          },
          {
            "date": "2023-05-17",
            "name": {
              "en": "Ascension Day Eve",
              "fi": "Helatorstain aatto",
              "sv": "Dagen före Kristi himmelfärds dag",
            },
          },
          {
            "date": "2023-05-18",
            "name": {
              "en": "Ascension Day",
              "fi": "Helatorstai",
              "sv": "Kristi himmelfärds dag",
            },
          },
          {
            "date": "2023-05-28",
            "name": {
              "en": "Pentecost",
              "fi": "Helluntaipäivä",
              "sv": "Pingstdagen",
            },
          },
          {
            "date": "2023-06-22",
            "name": {
              "en": "Day before Midsummer Eve",
              "fi": "Juhannusaaton aatto",
              "sv": "Dagen före midsommarafton",
            },
          },
          {
            "date": "2023-06-23",
            "name": {
              "en": "Midsummer Eve",
              "fi": "Juhannusaatto",
              "sv": "Midsommarafton",
            },
          },
          {
            "date": "2023-06-24",
            "name": {
              "en": "Midsummer Day",
              "fi": "Juhannuspäivä",
              "sv": "Midsommardagen",
            },
          },
          {
            "date": "2023-06-25",
            "name": {
              "en": "Sunday after Midsummer Day",
              "fi": "Juhannuksen jälkeinen sunnuntai",
              "sv": "Söndag efter  Midsommardagen",
            },
          },
          {
            "date": "2023-11-04",
            "name": {
              "en": "All Saints' Day",
              "fi": "Pyhäinpäivä",
              "sv": "Alla Helgons dag",
            },
          },
          {
            "date": "2023-11-12",
            "name": {
              "en": "Father's Day",
              "fi": "Isänpäivä",
              "sv": "Fars dag",
            },
          },
          {
            "date": "2023-12-05",
            "name": {
              "en": "Independence Day Eve",
              "fi": "Itsenäisyyspäivän aatto",
              "sv": "Dagen före Självständighetsdagen",
            },
          },
          {
            "date": "2023-12-06",
            "name": {
              "en": "Independence Day",
              "fi": "Itsenäisyyspäivä",
              "sv": "Självständighetsdagen",
            },
          },
          {
            "date": "2023-12-23",
            "name": {
              "en": "Day before Christmas Eve",
              "fi": "Jouluaaton aatto",
              "sv": "Dagen före julafton",
            },
          },
          {
            "date": "2023-12-24",
            "name": {
              "en": "Christmas Eve",
              "fi": "Jouluaatto",
              "sv": "Julafton",
            },
          },
          {
            "date": "2023-12-25",
            "name": {
              "en": "Christmas Day",
              "fi": "Joulupäivä",
              "sv": "Juldagen",
            },
          },
          {
            "date": "2023-12-26",
            "name": {
              "en": "Boxing Day",
              "fi": "Tapaninpäivä (toinen joulupäivä)",
              "sv": "Annandag jul",
            },
          },
          {
            "date": "2023-12-30",
            "name": {
              "en": "Day before New Year's Eve",
              "fi": "Uudenvuodenaaton aatto",
              "sv": "Dagen före nyårsafton",
            },
          },
          {
            "date": "2023-12-31",
            "name": {
              "en": "New Year's Eve",
              "fi": "Uudenvuodenaatto",
              "sv": "Nyårsafton",
            },
          },
        ]
      `);
      expect(getHolidays(new Date('2024-01-01'))).toMatchInlineSnapshot(`
        [
          {
            "date": "2024-01-01",
            "name": {
              "en": "New Year's Day",
              "fi": "Uudenvuodenpäivä",
              "sv": "Nyårsdagen",
            },
          },
          {
            "date": "2024-01-05",
            "name": {
              "en": "Epiphany Eve",
              "fi": "Loppiaisen aatto",
              "sv": "Dagen före Trettondedag jul",
            },
          },
          {
            "date": "2024-01-06",
            "name": {
              "en": "Epiphany",
              "fi": "Loppiainen",
              "sv": "Trettondedag jul",
            },
          },
          {
            "date": "2024-03-28",
            "name": {
              "en": "Maundy Thursday",
              "fi": "Kiirastorstai",
              "sv": "Skärtorsdagen",
            },
          },
          {
            "date": "2024-03-29",
            "name": {
              "en": "Good Friday",
              "fi": "Pitkäperjantai",
              "sv": "Långfredagen",
            },
          },
          {
            "date": "2024-03-30",
            "name": {
              "en": "Easter Saturday",
              "fi": "Pääsiäislauantai",
              "sv": "Påsklördag",
            },
          },
          {
            "date": "2024-03-31",
            "name": {
              "en": "Easter Sunday",
              "fi": "Pääsiäispäivä",
              "sv": "Påskdagen",
            },
          },
          {
            "date": "2024-04-01",
            "name": {
              "en": "Easter Monday",
              "fi": "2. pääsiäispäivä",
              "sv": "Annandag påsk",
            },
          },
          {
            "date": "2024-04-30",
            "name": {
              "en": "May Day Eve",
              "fi": "Vappuaatto",
              "sv": "Valborgsafton",
            },
          },
          {
            "date": "2024-05-01",
            "name": {
              "en": "May Day",
              "fi": "Vappu",
              "sv": "Valborg",
            },
          },
          {
            "date": "2024-05-08",
            "name": {
              "en": "Ascension Day Eve",
              "fi": "Helatorstain aatto",
              "sv": "Dagen före Kristi himmelfärds dag",
            },
          },
          {
            "date": "2024-05-09",
            "name": {
              "en": "Ascension Day",
              "fi": "Helatorstai",
              "sv": "Kristi himmelfärds dag",
            },
          },
          {
            "date": "2024-05-12",
            "name": {
              "en": "Mother's Day",
              "fi": "Äitienpäivä",
              "sv": "Mors dag",
            },
          },
          {
            "date": "2024-05-19",
            "name": {
              "en": "Pentecost",
              "fi": "Helluntaipäivä",
              "sv": "Pingstdagen",
            },
          },
          {
            "date": "2024-06-20",
            "name": {
              "en": "Day before Midsummer Eve",
              "fi": "Juhannusaaton aatto",
              "sv": "Dagen före midsommarafton",
            },
          },
          {
            "date": "2024-06-21",
            "name": {
              "en": "Midsummer Eve",
              "fi": "Juhannusaatto",
              "sv": "Midsommarafton",
            },
          },
          {
            "date": "2024-06-22",
            "name": {
              "en": "Midsummer Day",
              "fi": "Juhannuspäivä",
              "sv": "Midsommardagen",
            },
          },
          {
            "date": "2024-06-23",
            "name": {
              "en": "Sunday after Midsummer Day",
              "fi": "Juhannuksen jälkeinen sunnuntai",
              "sv": "Söndag efter  Midsommardagen",
            },
          },
          {
            "date": "2024-11-02",
            "name": {
              "en": "All Saints' Day",
              "fi": "Pyhäinpäivä",
              "sv": "Alla Helgons dag",
            },
          },
          {
            "date": "2024-11-10",
            "name": {
              "en": "Father's Day",
              "fi": "Isänpäivä",
              "sv": "Fars dag",
            },
          },
          {
            "date": "2024-12-05",
            "name": {
              "en": "Independence Day Eve",
              "fi": "Itsenäisyyspäivän aatto",
              "sv": "Dagen före Självständighetsdagen",
            },
          },
          {
            "date": "2024-12-06",
            "name": {
              "en": "Independence Day",
              "fi": "Itsenäisyyspäivä",
              "sv": "Självständighetsdagen",
            },
          },
          {
            "date": "2024-12-23",
            "name": {
              "en": "Day before Christmas Eve",
              "fi": "Jouluaaton aatto",
              "sv": "Dagen före julafton",
            },
          },
          {
            "date": "2024-12-24",
            "name": {
              "en": "Christmas Eve",
              "fi": "Jouluaatto",
              "sv": "Julafton",
            },
          },
          {
            "date": "2024-12-25",
            "name": {
              "en": "Christmas Day",
              "fi": "Joulupäivä",
              "sv": "Juldagen",
            },
          },
          {
            "date": "2024-12-26",
            "name": {
              "en": "Boxing Day",
              "fi": "Tapaninpäivä (toinen joulupäivä)",
              "sv": "Annandag jul",
            },
          },
          {
            "date": "2024-12-30",
            "name": {
              "en": "Day before New Year's Eve",
              "fi": "Uudenvuodenaaton aatto",
              "sv": "Dagen före nyårsafton",
            },
          },
          {
            "date": "2024-12-31",
            "name": {
              "en": "New Year's Eve",
              "fi": "Uudenvuodenaatto",
              "sv": "Nyårsafton",
            },
          },
        ]
      `);
      expect(getHolidays(new Date('2025-01-01'))).toMatchInlineSnapshot(`
        [
          {
            "date": "2025-01-01",
            "name": {
              "en": "New Year's Day",
              "fi": "Uudenvuodenpäivä",
              "sv": "Nyårsdagen",
            },
          },
          {
            "date": "2025-01-05",
            "name": {
              "en": "Epiphany Eve",
              "fi": "Loppiaisen aatto",
              "sv": "Dagen före Trettondedag jul",
            },
          },
          {
            "date": "2025-01-06",
            "name": {
              "en": "Epiphany",
              "fi": "Loppiainen",
              "sv": "Trettondedag jul",
            },
          },
          {
            "date": "2025-04-17",
            "name": {
              "en": "Maundy Thursday",
              "fi": "Kiirastorstai",
              "sv": "Skärtorsdagen",
            },
          },
          {
            "date": "2025-04-18",
            "name": {
              "en": "Good Friday",
              "fi": "Pitkäperjantai",
              "sv": "Långfredagen",
            },
          },
          {
            "date": "2025-04-19",
            "name": {
              "en": "Easter Saturday",
              "fi": "Pääsiäislauantai",
              "sv": "Påsklördag",
            },
          },
          {
            "date": "2025-04-20",
            "name": {
              "en": "Easter Sunday",
              "fi": "Pääsiäispäivä",
              "sv": "Påskdagen",
            },
          },
          {
            "date": "2025-04-21",
            "name": {
              "en": "Easter Monday",
              "fi": "2. pääsiäispäivä",
              "sv": "Annandag påsk",
            },
          },
          {
            "date": "2025-04-30",
            "name": {
              "en": "May Day Eve",
              "fi": "Vappuaatto",
              "sv": "Valborgsafton",
            },
          },
          {
            "date": "2025-05-01",
            "name": {
              "en": "May Day",
              "fi": "Vappu",
              "sv": "Valborg",
            },
          },
          {
            "date": "2025-05-11",
            "name": {
              "en": "Mother's Day",
              "fi": "Äitienpäivä",
              "sv": "Mors dag",
            },
          },
          {
            "date": "2025-05-28",
            "name": {
              "en": "Ascension Day Eve",
              "fi": "Helatorstain aatto",
              "sv": "Dagen före Kristi himmelfärds dag",
            },
          },
          {
            "date": "2025-05-29",
            "name": {
              "en": "Ascension Day",
              "fi": "Helatorstai",
              "sv": "Kristi himmelfärds dag",
            },
          },
          {
            "date": "2025-06-08",
            "name": {
              "en": "Pentecost",
              "fi": "Helluntaipäivä",
              "sv": "Pingstdagen",
            },
          },
          {
            "date": "2025-06-19",
            "name": {
              "en": "Day before Midsummer Eve",
              "fi": "Juhannusaaton aatto",
              "sv": "Dagen före midsommarafton",
            },
          },
          {
            "date": "2025-06-20",
            "name": {
              "en": "Midsummer Eve",
              "fi": "Juhannusaatto",
              "sv": "Midsommarafton",
            },
          },
          {
            "date": "2025-06-21",
            "name": {
              "en": "Midsummer Day",
              "fi": "Juhannuspäivä",
              "sv": "Midsommardagen",
            },
          },
          {
            "date": "2025-06-22",
            "name": {
              "en": "Sunday after Midsummer Day",
              "fi": "Juhannuksen jälkeinen sunnuntai",
              "sv": "Söndag efter  Midsommardagen",
            },
          },
          {
            "date": "2025-11-01",
            "name": {
              "en": "All Saints' Day",
              "fi": "Pyhäinpäivä",
              "sv": "Alla Helgons dag",
            },
          },
          {
            "date": "2025-11-09",
            "name": {
              "en": "Father's Day",
              "fi": "Isänpäivä",
              "sv": "Fars dag",
            },
          },
          {
            "date": "2025-12-05",
            "name": {
              "en": "Independence Day Eve",
              "fi": "Itsenäisyyspäivän aatto",
              "sv": "Dagen före Självständighetsdagen",
            },
          },
          {
            "date": "2025-12-06",
            "name": {
              "en": "Independence Day",
              "fi": "Itsenäisyyspäivä",
              "sv": "Självständighetsdagen",
            },
          },
          {
            "date": "2025-12-23",
            "name": {
              "en": "Day before Christmas Eve",
              "fi": "Jouluaaton aatto",
              "sv": "Dagen före julafton",
            },
          },
          {
            "date": "2025-12-24",
            "name": {
              "en": "Christmas Eve",
              "fi": "Jouluaatto",
              "sv": "Julafton",
            },
          },
          {
            "date": "2025-12-25",
            "name": {
              "en": "Christmas Day",
              "fi": "Joulupäivä",
              "sv": "Juldagen",
            },
          },
          {
            "date": "2025-12-26",
            "name": {
              "en": "Boxing Day",
              "fi": "Tapaninpäivä (toinen joulupäivä)",
              "sv": "Annandag jul",
            },
          },
          {
            "date": "2025-12-30",
            "name": {
              "en": "Day before New Year's Eve",
              "fi": "Uudenvuodenaaton aatto",
              "sv": "Dagen före nyårsafton",
            },
          },
          {
            "date": "2025-12-31",
            "name": {
              "en": "New Year's Eve",
              "fi": "Uudenvuodenaatto",
              "sv": "Nyårsafton",
            },
          },
        ]
      `);
      expect(getHolidays(new Date('2026-01-01'))).toMatchInlineSnapshot(`
        [
          {
            "date": "2026-01-01",
            "name": {
              "en": "New Year's Day",
              "fi": "Uudenvuodenpäivä",
              "sv": "Nyårsdagen",
            },
          },
          {
            "date": "2026-01-05",
            "name": {
              "en": "Epiphany Eve",
              "fi": "Loppiaisen aatto",
              "sv": "Dagen före Trettondedag jul",
            },
          },
          {
            "date": "2026-01-06",
            "name": {
              "en": "Epiphany",
              "fi": "Loppiainen",
              "sv": "Trettondedag jul",
            },
          },
          {
            "date": "2026-04-02",
            "name": {
              "en": "Maundy Thursday",
              "fi": "Kiirastorstai",
              "sv": "Skärtorsdagen",
            },
          },
          {
            "date": "2026-04-03",
            "name": {
              "en": "Good Friday",
              "fi": "Pitkäperjantai",
              "sv": "Långfredagen",
            },
          },
          {
            "date": "2026-04-04",
            "name": {
              "en": "Easter Saturday",
              "fi": "Pääsiäislauantai",
              "sv": "Påsklördag",
            },
          },
          {
            "date": "2026-04-05",
            "name": {
              "en": "Easter Sunday",
              "fi": "Pääsiäispäivä",
              "sv": "Påskdagen",
            },
          },
          {
            "date": "2026-04-06",
            "name": {
              "en": "Easter Monday",
              "fi": "2. pääsiäispäivä",
              "sv": "Annandag påsk",
            },
          },
          {
            "date": "2026-04-30",
            "name": {
              "en": "May Day Eve",
              "fi": "Vappuaatto",
              "sv": "Valborgsafton",
            },
          },
          {
            "date": "2026-05-01",
            "name": {
              "en": "May Day",
              "fi": "Vappu",
              "sv": "Valborg",
            },
          },
          {
            "date": "2026-05-10",
            "name": {
              "en": "Mother's Day",
              "fi": "Äitienpäivä",
              "sv": "Mors dag",
            },
          },
          {
            "date": "2026-05-13",
            "name": {
              "en": "Ascension Day Eve",
              "fi": "Helatorstain aatto",
              "sv": "Dagen före Kristi himmelfärds dag",
            },
          },
          {
            "date": "2026-05-14",
            "name": {
              "en": "Ascension Day",
              "fi": "Helatorstai",
              "sv": "Kristi himmelfärds dag",
            },
          },
          {
            "date": "2026-05-24",
            "name": {
              "en": "Pentecost",
              "fi": "Helluntaipäivä",
              "sv": "Pingstdagen",
            },
          },
          {
            "date": "2026-06-18",
            "name": {
              "en": "Day before Midsummer Eve",
              "fi": "Juhannusaaton aatto",
              "sv": "Dagen före midsommarafton",
            },
          },
          {
            "date": "2026-06-19",
            "name": {
              "en": "Midsummer Eve",
              "fi": "Juhannusaatto",
              "sv": "Midsommarafton",
            },
          },
          {
            "date": "2026-06-20",
            "name": {
              "en": "Midsummer Day",
              "fi": "Juhannuspäivä",
              "sv": "Midsommardagen",
            },
          },
          {
            "date": "2026-06-21",
            "name": {
              "en": "Sunday after Midsummer Day",
              "fi": "Juhannuksen jälkeinen sunnuntai",
              "sv": "Söndag efter  Midsommardagen",
            },
          },
          {
            "date": "2026-10-31",
            "name": {
              "en": "All Saints' Day",
              "fi": "Pyhäinpäivä",
              "sv": "Alla Helgons dag",
            },
          },
          {
            "date": "2026-11-08",
            "name": {
              "en": "Father's Day",
              "fi": "Isänpäivä",
              "sv": "Fars dag",
            },
          },
          {
            "date": "2026-12-05",
            "name": {
              "en": "Independence Day Eve",
              "fi": "Itsenäisyyspäivän aatto",
              "sv": "Dagen före Självständighetsdagen",
            },
          },
          {
            "date": "2026-12-06",
            "name": {
              "en": "Independence Day",
              "fi": "Itsenäisyyspäivä",
              "sv": "Självständighetsdagen",
            },
          },
          {
            "date": "2026-12-23",
            "name": {
              "en": "Day before Christmas Eve",
              "fi": "Jouluaaton aatto",
              "sv": "Dagen före julafton",
            },
          },
          {
            "date": "2026-12-24",
            "name": {
              "en": "Christmas Eve",
              "fi": "Jouluaatto",
              "sv": "Julafton",
            },
          },
          {
            "date": "2026-12-25",
            "name": {
              "en": "Christmas Day",
              "fi": "Joulupäivä",
              "sv": "Juldagen",
            },
          },
          {
            "date": "2026-12-26",
            "name": {
              "en": "Boxing Day",
              "fi": "Tapaninpäivä (toinen joulupäivä)",
              "sv": "Annandag jul",
            },
          },
          {
            "date": "2026-12-30",
            "name": {
              "en": "Day before New Year's Eve",
              "fi": "Uudenvuodenaaton aatto",
              "sv": "Dagen före nyårsafton",
            },
          },
          {
            "date": "2026-12-31",
            "name": {
              "en": "New Year's Eve",
              "fi": "Uudenvuodenaatto",
              "sv": "Nyårsafton",
            },
          },
        ]
      `);
    });
  });
});
