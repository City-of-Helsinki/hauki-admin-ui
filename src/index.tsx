import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import './index.scss';
import axe from '@axe-core/react';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './i18n';

Sentry.init({
  dsn: window.ENV.SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  environment: window.ENV.SENTRY_ENV,
  sampleRate: window.ENV.SENTRY_ENV === 'local' ? 0.0 : 1.0, // We do not wish to trace in local env by default
  ignoreErrors: [
    'ResizeObserver loop completed with undelivered notifications',
  ],
});

if (window.ENV?.USE_AXE === 'true') {
  axe(React, ReactDOM, 1000);
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
