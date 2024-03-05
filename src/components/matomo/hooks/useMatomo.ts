import { useCallback, useContext } from 'react';
import MatomoContext from '../matomo-context';
import { TrackPageViewParams } from '../MatomoTracker';
import { MatomoTrackerInstance } from '../types';

function useMatomo(): MatomoTrackerInstance {
  const instance = useContext(MatomoContext);

  const trackPageView = useCallback(
    (params?: TrackPageViewParams) => instance?.trackPageView(params),
    [instance]
  );

  return { trackPageView };
}

export default useMatomo;
