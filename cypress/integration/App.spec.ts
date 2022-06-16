/// <reference types="cypress" />
/// <reference types="cypress-axe" />
/// <reference path="../index.d.ts" />

describe('Open aukiolot app', () => {
  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(Cypress.env('resourceId'));
  });

  it('Contains correct page title', () => {
    cy.contains('Aukiolot');
  });
});
