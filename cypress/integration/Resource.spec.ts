/// <reference types="cypress" />
/// <reference path="../index.d.ts" />
describe('Resource page', () => {
  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(Cypress.env('resource-id'));
  });

  it('Has opening periods listed', () => {
    cy.get('[data-test=resource-opening-periods-list]', {
      timeout: 5000,
    }).should('be.visible');
    cy.get('[data-test=resource-exception-opening-periods-list]', {
      timeout: 5000,
    }).should('be.visible');
  });
});
