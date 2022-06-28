import { sanitizeId } from './form';

describe('form', () => {
  describe('sanitizeId', () => {
    it('returns correctly sanitized id', () => {
      expect(
        sanitizeId('openingHours[0].timeSpanGroups[0].timeSpans[0]-start-time')
      ).toEqual('openingHours-0-timeSpanGroups-0-timeSpans-0-start-time');
    });
  });
});
