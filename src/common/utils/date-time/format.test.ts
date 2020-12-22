/// <reference types="jest" />

import { formatDateRange } from './format';

describe('format', () => {
  describe('formatDateRange', () => {
    it('should return formatted date range', () => {
      expect(
        formatDateRange({ startDate: '2020-12-18', endDate: '2020-12-31' })
      ).toEqual('18.12.2020 - 31.12.2020');
    });

    it('should return formatted startDate when endDate is missing', () => {
      expect(formatDateRange({ startDate: '2020-12-18' })).toEqual(
        '18.12.2020'
      );
    });

    it('should return string when startDate is missing', () => {
      expect(formatDateRange({ endDate: '2020-12-31' })).toEqual('');
    });
  });
});
