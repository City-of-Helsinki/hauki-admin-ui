/// <reference types="cypress" />
/// <reference path="../index.d.ts" />
describe('Unauthenticated user', () => {
  beforeEach(() => {
    cy.visitResourcePageAsUnauthenticatedUser(Cypress.env('resource-id'));
  });

  it('Is redirected to unauthenticated page', () => {
    cy.location('pathname').should('equal', '/unauthenticated');
  });
});

describe('Authenticated user', () => {
  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(Cypress.env('resource-id'));
  });

  it('should logout permanently', () => {
    cy.location()
      .its('href')
      .then((resourcePageUrl) => {
        cy.get('header')
          .find('button')
          .contains('admin@hel.fi')
          .click({ force: true });
        cy.get('header').first().find('a').contains('Kirjaudu ulos').click();
        cy.get('header').first().should('not.contain', 'Kirjaudu ulos');
        cy.location('pathname').should('equal', '/');

        // Try to visit the resource page again
        cy.visit(resourcePageUrl);
        cy.get('header').first().should('not.contain', 'Kirjaudu ulos');
        cy.location('pathname').should('equal', '/unauthenticated');
      });
  });
});
