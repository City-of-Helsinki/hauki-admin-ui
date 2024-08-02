/* eslint-disable no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
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

Sentry.init({
  dsn: window._env_.SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  environment: window._env_.SENTRY_ENV,
  sampleRate: window._env_.SENTRY_ENV === 'local' ? 0.0 : 1.0, // We do not wish to trace in local env by default
  ignoreErrors: [
    'ResizeObserver loop completed with undelivered notifications',
  ],
});

if (window._env_?.USE_AXE === 'true') {
  axe(React, ReactDOM, 1000);
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
