interface Window {
  ENV: {
    API_URL: string;
    USE_AXE: string;
    SENTRY_DSN: string;
    SENTRY_ENVIRONMENT: string;
    SENTRY_RELEASE: string;
    SENTRY_TRACES_SAMPLE_RATE: number;
    SENTRY_TRACE_PROPAGATION_TARGETS: string;
    SENTRY_REPLAYS_SESSION_SAMPLE_RATE: number;
    SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE: number;
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
