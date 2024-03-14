interface Window {
  ENV: {
    API_URL: string;
    USE_AXE: string;
    SENTRY_DSN: string;
    SENTRY_ENV: string;
    REACT_APP_VERSION: string;
    FEEDBACK_EMAILS: string;
    MATOMO_SRC_URL: string;
    MATOMO_URL_BASE: string;
    MATOMO_SITE_ID: string;
    MATOMO_ENABLED: string;
  };
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
  _paq: [string, ...any[]][];
}
