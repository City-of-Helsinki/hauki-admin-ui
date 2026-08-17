 
import MatomoTracker, { MatomoTrackerOptions } from './MatomoTracker';

describe('MatomoTracker', () => {
  it('should initialise window._paq', () => {
    window._paq = [];

    const intance = new MatomoTracker({
      urlBase: 'https://www.test.fi/',
      siteId: 'test123',
      srcUrl: 'test.js',
      enabled: true,
      configurations: {
        foo: 'bar',
        testArray: ['testArrayItem1', 'testArrayItem2'],
        testNoValue: undefined,
      },
    });

    expect(intance).toBeTruthy();
    expect(window._paq).toEqual([
      ['setTrackerUrl', 'https://www.test.fi/matomo.php'],
      ['setSiteId', 'test123'],
      ['foo', 'bar'],
      ['testArray', 'testArrayItem1', 'testArrayItem2'],
      ['testNoValue'],
      ['enableLinkTracking', true],
    ]);
  });

  describe('tracking', () => {
    const createTracker = (): MatomoTracker => {
      window._paq = [];
      const tracker = new MatomoTracker({
        urlBase: 'https://www.test.fi/',
        siteId: 'test123',
        srcUrl: 'test.js',
        enabled: true,
      });
      // Drop the initialisation instructions so only tracking calls are asserted
      window._paq = [];
      return tracker;
    };

    it('should track a page view with the given title and url', () => {
      createTracker().trackPageView({
        documentTitle: 'Test title',
        href: 'https://www.test.fi/resource/tprek:8100',
      });

      expect(window._paq).toEqual([
        ['setCustomUrl', 'https://www.test.fi/resource/tprek:8100'],
        ['setDocumentTitle', 'Test title'],
        ['trackPageView'],
      ]);
    });

    it('should fall back to the current document title and url', () => {
      document.title = 'Fallback title';

      createTracker().trackPageView();

      expect(window._paq).toEqual([
        ['setCustomUrl', window.location.href],
        ['setDocumentTitle', 'Fallback title'],
        ['trackPageView'],
      ]);
    });

    it('should not push anything when there is no track data', () => {
      createTracker().track({ data: [] });

      expect(window._paq).toEqual([]);
    });
  });

  it('should throw error if urlBase missing', () => {
    expect(
      () => new MatomoTracker({ siteId: 'test123' } as MatomoTrackerOptions)
    ).toThrowError();
  });

  it('should throw error if siteId missing', () => {
    expect(
      () =>
        new MatomoTracker({
          urlBase: 'https://www.test.fi',
        } as MatomoTrackerOptions)
    ).toThrowError();
  });
});
