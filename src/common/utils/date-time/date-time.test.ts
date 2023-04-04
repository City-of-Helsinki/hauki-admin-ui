/// <reference types="jest" />
import {
  byDateRange,
  getDifferenceInDays,
  getEnabledWeekdays,
} from './date-time';

describe('date-time', () => {
  describe('getDifferenceInDays', () => {
    it('should return correct days', () => {
      expect(getDifferenceInDays('01.01.2023', '07.01.2023')).toBe(6);
    });

    it('should return minus one when end date is missing', () => {
      expect(getDifferenceInDays('01.01.2023', null)).toBe(-1);
    });

    it('should return minus one when both are missing', () => {
      expect(getDifferenceInDays(null, null)).toBe(-1);
    });
  });

  describe('getEnabledWeekdays', () => {
    it('should return correct days', () => {
      expect(getEnabledWeekdays('02.01.2023', '08.01.2023')).toEqual([
        1, 2, 3, 4, 5, 6, 7,
      ]);
    });

    it('should return correct days', () => {
      expect(getEnabledWeekdays('03.01.2023', '04.01.2023')).toEqual([2, 3]);
    });

    it('should return all days when range is over a week', () => {
      expect(getEnabledWeekdays('02.01.2023', '09.01.2023')).toEqual([
        1, 2, 3, 4, 5, 6, 7,
      ]);
    });

    it('should return all days when end date is missing', () => {
      expect(getEnabledWeekdays('02.01.2023', null)).toEqual([
        1, 2, 3, 4, 5, 6, 7,
      ]);
    });

    it('should return all days when start date is missing', () => {
      expect(getEnabledWeekdays(null, '09.01.2023')).toEqual([
        1, 2, 3, 4, 5, 6, 7,
      ]);
    });

    it('should return all days when both days are missing', () => {
      expect(getEnabledWeekdays(null, null)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('should return all empty list when end date before start date', () => {
      expect(getEnabledWeekdays('02.01.2023', '01.01.2023')).toEqual([]);
    });
  });

  describe('byDateRange', () => {
    it('should return days in date order starting from start date when date range is under one week', () => {
      expect(
        [1, 2, 3, 4, 5, 6, 7].sort(byDateRange('25.01.2023', '29.01.2023'))
      ).toEqual([3, 4, 5, 6, 7, 1, 2]);
    });

    it('should return days in chronological order when date range is one week', () => {
      expect(
        [1, 2, 3, 4, 5, 6, 7].sort(byDateRange('23.01.2023', '29.01.2023'))
      ).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('should return days in chronological order when date range is over one week', () => {
      expect(
        [1, 2, 3, 4, 5, 6, 7].sort(byDateRange('23.01.2023', '30.01.2023'))
      ).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });
});
