import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import * as MatomoTracker from '../MatomoTracker';
import { MatomoProvider } from '../matomo-context';
import useMatomo from './useMatomo';

describe('useMatomo', () => {
  const MockedComponent = () => {
    const { trackPageView } = useMatomo();

    useEffect(() => {
      trackPageView({ href: 'https://www.hel.fi' });
    }, [trackPageView]);

    return <div>MockedComponent</div>;
  };

  it('should trackPageView', () => {
    const trackPageViewMock = jest.fn();

    jest.spyOn(MatomoTracker, 'default').mockImplementation(
      () =>
        ({
          trackPageView: trackPageViewMock,
        } as unknown as MatomoTracker.default)
    );

    // eslint-disable-next-line new-cap
    const instance = new MatomoTracker.default({
      urlBase: 'https://www.hel.fi',
      siteId: 'test123',
      srcUrl: 'test.js',
      enabled: true,
    });

    const MockProvider = () => {
      return (
        <MatomoProvider value={instance}>
          <MockedComponent />
        </MatomoProvider>
      );
    };

    expect(MatomoTracker.default).toHaveBeenCalled();

    render(<MockProvider />);

    expect(trackPageViewMock).toHaveBeenCalledWith({
      href: 'https://www.hel.fi',
    });
  });
});
