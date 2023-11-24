/* eslint-disable no-underscore-dangle */
import { TRACK_TYPES } from './constants';

export type MatomoTrackerOptions = {
  urlBase: string;
  siteId: string;
  srcUrl: string;
  trackerUrl?: string;
  enabled: boolean;
  linkTracking?: boolean;
  configurations?: {
    [key: string]: string | string[] | boolean | undefined;
  };
};

export type CustomDimension = {
  id: number;
  value: string;
};

export type TrackPageViewParams = {
  documentTitle?: string;
  href?: string | Location;
  customDimensions?: boolean | CustomDimension[];
};

export type TrackParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
} & TrackPageViewParams;

class MatomoTracker {
  constructor(userOptions: MatomoTrackerOptions) {
    if (!userOptions.urlBase) {
      throw new Error('Matomo urlBase is required');
    }

    if (!userOptions.siteId) {
      throw new Error('Matomo siteId is required.');
    }

    this.initialize(userOptions);
  }

  private initialize({
    urlBase,
    siteId,
    srcUrl,
    trackerUrl = 'matomo.php',
    enabled = true,
    linkTracking = true,
    configurations = {},
  }: MatomoTrackerOptions) {
    if (typeof window === 'undefined') {
      return;
    }

    window._paq = window._paq || [];

    if (window._paq.length !== 0) {
      return;
    }

    if (!enabled) {
      return;
    }

    this.pushInstruction('setTrackerUrl', `${urlBase}${trackerUrl}`);
    this.pushInstruction('setSiteId', siteId);

    Object.entries(configurations).forEach(([name, instructions]) => {
      if (instructions instanceof Array) {
        this.pushInstruction(name, ...instructions);
      } else if (instructions === undefined) {
        this.pushInstruction(name);
      } else {
        this.pushInstruction(name, instructions);
      }
    });

    this.enableLinkTracking(linkTracking);

    const doc = document;
    const scriptElement = doc.createElement('script');
    const scripts = doc.getElementsByTagName('script')[0];

    scriptElement.type = 'text/javascript';
    scriptElement.async = true;
    scriptElement.defer = true;
    scriptElement.src = `${urlBase}${srcUrl}`;

    if (scripts?.parentNode) {
      scripts?.parentNode.insertBefore(scriptElement, scripts);
    }
  }

  enableLinkTracking(active: boolean): void {
    this.pushInstruction('enableLinkTracking', active);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pushInstruction(name: string, ...args: any[]): this {
    if (typeof window !== 'undefined') {
      window._paq.push([name, ...args]);
    }

    return this;
  }

  trackPageView(params?: TrackPageViewParams): void {
    this.track({ data: [TRACK_TYPES.TRACK_VIEW], ...params });
  }

  track({
    data = [],
    documentTitle = document.title,
    href,
  }: TrackParams): void {
    if (data.length) {
      this.pushInstruction('setCustomUrl', href ?? window.location.href);
      this.pushInstruction('setDocumentTitle', documentTitle);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.pushInstruction(...(data as [string, ...any[]]));
    }
  }
}

export default MatomoTracker;
