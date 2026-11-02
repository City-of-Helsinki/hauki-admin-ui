import urlUtils from './url';

describe('url utils', () => {
  describe('parseSearchParameters', () => {
    it('parses single values as strings', () => {
      expect(
        urlUtils.parseSearchParameters(
          '?target_resources=tprek%3A8215%2Ctprek%3A8216&lang=fi'
        )
      ).toEqual({
        target_resources: 'tprek:8215,tprek:8216',
        lang: 'fi',
      });
    });

    it('parses repeated keys as arrays', () => {
      expect(urlUtils.parseSearchParameters('?id=1&id=2&lang=fi')).toEqual({
        id: ['1', '2'],
        lang: 'fi',
      });
    });

    it('decodes plus signs as spaces', () => {
      expect(urlUtils.parseSearchParameters('?q=a+b%20c')).toEqual({
        q: 'a b c',
      });
    });

    it('returns an empty object for an empty query string', () => {
      expect(urlUtils.parseSearchParameters('')).toEqual({});
    });
  });
});
