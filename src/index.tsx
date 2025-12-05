/* eslint-disable no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import './index.scss';
import axe from '@axe-core/react';
import App from './App';
import * as serviceWorker from './serviceWorker';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _env_: any;
  }
}

if (window._env_?.SENTRY_DSN) {
  Sentry.init({
    dsn: window._env_.SENTRY_DSN,
    environment: window._env_.SENTRY_ENVIRONMENT,
    release: window._env_.SENTRY_RELEASE,
    tracesSampleRate:
      window._env_.SENTRY_ENV === 'local'
        ? 0
        : window._env_.SENTRY_TRACES_SAMPLE_RATE,
    tracePropagationTargets: window._env_.SENTRY_TRACE_PROPAGATION_TARGETS,
    replaysSessionSampleRate: window._env_.SENTRY_REPLAYS_SESSION_SAMPLE_RATE,
    replaysOnErrorSampleRate: window._env_.SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
    ignoreErrors: [
      'ResizeObserver loop completed with undelivered notifications',
      'ResizeObserver loop limit exceeded',
    ],
    integrations: [Sentry.browserTracingIntegration()],
  });
}

if (window._env_?.USE_AXE === 'true') {
  axe(React, ReactDOM, 1000);
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}
const root = createRoot(container);
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
