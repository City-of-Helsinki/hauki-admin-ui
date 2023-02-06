/// <reference types="cypress" />
/// <reference path="../index.d.ts" />
describe('User adds a new holiday opening period', () => {
  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(Cypress.env('resourceId'));
    cy.intercept('POST', '/v1/date_period/').as('saveHoliday');
  });

  it('Users successfully adds a new holiday opening hours', () => {
    // Go to add new openings hours
    cy.get('[data-test=edit-holidays-button]').first().click();

    // Select holiday
    cy.contains('Jouluaatto').click();

    // Set exceptional opening hours
    cy.contains('Poikkeava aukioloaika').click();

    cy.setHdsTimeInputTime({
      id: 'openingHours-0-timeSpanGroups-0-timeSpans-0-start-time',
      hours: '08',
      minutes: '00',
    });

    cy.setHdsTimeInputTime({
      id: 'openingHours-0-timeSpanGroups-0-timeSpans-0-end-time',
      hours: '16',
      minutes: '00',
    });

    cy.selectHdsDropdown({
      id: 'openingHours-0-timeSpanGroups-0-timeSpans-0-resource_state',
      value: 'Itsepalvelu',
    });

    cy.get('[data-test=submit-opening-hours-button]').click();

    cy.get('[data-testid=holiday-form-success]', {
      timeout: 30000,
    })
      .should('be.visible')
      .contains('Jouluaatto aukiolon lisääminen onnistui');
  });

  afterEach(() => {
    // Clean up
    cy.wait('@saveHoliday').then((interception) => {
      cy.deleteDatePeriod(interception.response?.body.id);
    });
  });
});
