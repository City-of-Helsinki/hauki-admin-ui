// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/// <reference path="../../src/globals.d.ts" />

import { TimeSpan } from '../../src/common/lib/types';
import Chainable = Cypress.Chainable;

Cypress.Commands.add(
  'visitResourcePageAsUnauthenticatedUser',
  (resourceId: string) => {
    cy.task('log', 'Starting visit as unauthenticated user');
    cy.visit(`/resource/${resourceId}`, {
      log: true,
    }).task('log', 'Visiting page as unauthenticated user');
  }
);

Cypress.Commands.add(
  'visitResourcePageAsAuthenticatedUser',
  (resourceId: string) => {
    cy.exec('node ./scripts/generate-auth-params.js').then((params) => {
      cy.task('log', 'Starting visit as authenticated user');
      cy.visit(`/resource/${resourceId}?${params.stdout}`, {
        log: true,
      }).task('log', 'Visiting the page as authenticated user');
    });
  }
);

// HDS Navigation.LanguageSelector causes uncaught exceptions in Cypress tests. It has something to do with how the ResizeObserver library. This is a temporary fix to circumvent the issue.
Cypress.on('uncaught:exception', (err: Error): boolean | Error => {
  if (
    /ResizeObserver loop completed with undelivered notifications/.test(
      err.message
    )
  ) {
    return false;
  }

  return err;
});

const toJsonDate = (date: Date): string => date.toJSON().split('T')[0];

Cypress.Commands.add(
  'createDatePeriod',
  ({
    name,
    startDate,
    endDate,
    resourceId,
    timeSpans = [],
  }: {
    name: string;
    startDate: Date;
    endDate: Date;
    resourceId: string;
    timeSpans?: TimeSpan[];
  }): Chainable => {
    return cy
      .visit('/')
      .window()
      .then((win: Window) => {
        const apiUrl = win.ENV?.API_URL;

        if (!apiUrl) {
          throw new Error('API_URL is not set!!!');
        }

        return cy
          .exec('node ./scripts/generate-auth-params.js')
          .then((params) =>
            cy
              .request(
                'GET',
                `${apiUrl}/v1/resource/${resourceId}?${params.stdout}`
              )
              .then((resourceResponse) => {
                const data = {
                  resource: resourceResponse?.body?.id,
                  name: {
                    fi: name,
                    sv: null,
                    en: null,
                  },
                  description: {
                    fi: null,
                    sv: null,
                    en: null,
                  },
                  start_date: toJsonDate(startDate),
                  end_date: toJsonDate(endDate),
                  resource_state: 'open',
                  override: false,
                  time_span_groups: timeSpans
                    ? [
                        {
                          rules: [],
                          time_spans: timeSpans,
                        },
                      ]
                    : [],
                };
                cy.task(
                  'log',
                  `Creating date-period, ${apiUrl}, ${JSON.stringify(data)}`
                );

                return cy
                  .request(
                    'POST',
                    `${apiUrl}/v1/date_period/?${params.stdout}`,
                    data
                  )
                  .then((dataPeriodResponse) => dataPeriodResponse.body?.id);
              })
          );
      });
  }
);
