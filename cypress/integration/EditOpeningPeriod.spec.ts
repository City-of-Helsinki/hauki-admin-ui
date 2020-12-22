/// <reference types="cypress" />
/// <reference path="../index.d.ts" />
import { ResourceState } from '../../src/common/lib/types';

describe('User edits an opening period', () => {
  let dataPeriodId: string | undefined;
  const resourceId = Cypress.env('resource-id');
  const datePeriodTitlePrefix = 'e2e-test Muokkaamisen testijakson otsikko';
  const newTitle = `${datePeriodTitlePrefix} ${new Date().toJSON()}`;
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(new Date().getDate() + 1);
  const timeSpan = {
    name: { fi: '', sv: null, en: null },
    description: { fi: '', sv: null, en: null },
    end_time: '20:00:00',
    resource_state: ResourceState.OPEN,
    start_time: '12:00:00',
    weekdays: [1],
  };

  before(() => {
    cy.createDatePeriod({
      name: newTitle,
      startDate,
      endDate,
      resourceId,
      timeSpans: [timeSpan],
    }).then((id: string) => {
      if (id) {
        dataPeriodId = id;
      }
    });
  });

  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(resourceId);
  });

  it('User successfully edits an opening period', () => {
    // Enter in edit page from resource page
    cy.get('[data-test=resource-opening-periods-list]', {
      timeout: 5000,
    })
      .find(`[data-test="openingPeriodEditLink-${dataPeriodId}"]`)
      .click({ log: true });

    // Check that form exists
    cy.get('[data-test=edit-opening-period-form]', {
      timeout: 5000,
    }).should('be.visible');

    // Start editing by checking the old title
    cy.get('[data-test=openingPeriodTitle]')
      .invoke('val')
      .should('not.be', undefined);

    // Change the title
    cy.get('[data-test=openingPeriodTitle]')
      .clear()
      .type(newTitle, { log: true });

    // Change timespan data
    cy.get('[data-test=weekdays-monday-0-checkbox]').should('be.checked');
    cy.get('[data-test=weekdays-monday-0]').click();
    cy.get('[data-test=weekdays-monday-0-checkbox]').should('not.be.checked');

    cy.get('[data-test=weekdays-tuesday-0]').click();
    cy.get('[data-test=weekdays-tuesday-0-checkbox]').should('be.checked');

    cy.get('[data-test=time-span-start-time-0]').type('08:00');
    cy.get('[data-test=time-span-end-time-0]').type('16:00');

    // Save
    cy.get('[data-test=publish-opening-period-button]').click({
      force: true,
      log: true,
    });

    // Wait for success notification
    cy.get('[data-testid=opening-period-form-success]', {
      timeout: 10000,
    }).should('be.visible');

    cy.get('[data-test=openingPeriodTitle]').should('have.value', newTitle);
  });
});
