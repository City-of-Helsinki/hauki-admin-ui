/// <reference types="cypress" />
/// <reference types="cypress-axe" />
/// <reference path="../index.d.ts" />

describe('Open aukiolot app', () => {
  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(Cypress.env('resource-id'));
  });

  it('Contains correct page title', () => {
    cy.contains('Aukiolot');
  });

  it('Has no detectable a11y violations on resource page load', () => {
    cy.injectAxe();
    cy.get('[data-test=resource-info]', { timeout: 5000 }).should('be.visible');
    cy.checkA11y(
      {},
      {
        rules: {
          'duplicate-id-aria': { enabled: false }, // TODO: HAUKI-185
          'duplicate-id': { enabled: false },
        },
      }
    );
  });

  it('Has no detectable a11y violations on add new opening period page', () => {
    cy.injectAxe();
    cy.get('[data-test=resource-info]', { timeout: 5000 }).should('be.visible');

    // Go to add new opening period page by pressing the header button
    cy.get('[data-test=add-new-opening-period-button]').click();

    cy.get('[data-test=add-new-opening-period-form]', {
      timeout: 5000,
    }).should('be.visible');

    cy.checkA11y(
      {},
      {
        rules: {
          'duplicate-id-aria': { enabled: false }, // TODO: HAUKI-185
          'duplicate-id': { enabled: false },
        },
      }
    );
  });
});
