/// <reference types="cypress" />
/// <reference path="../index.d.ts" />
describe('User adds a new holiday opening period', () => {
  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(Cypress.env('resourceId'));
  });

  it('Users successfully adds a new holiday opening hours', () => {
    cy.intercept('POST', '/v1/date_period/').as('saveHoliday');

    // Go to add new openings hours
    cy.get('[data-test=edit-holidays-button]').first().click();

    // Select holiday
    cy.contains('Jouluaatto').click();

    // Set exceptional opening hours
    cy.contains('Poikkeava aukiolo').click();

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

    cy.contains('Palaa etusivulle').click({ force: true });

    cy.wait(4000);

    cy.get('[data-test=openingPeriodAccordionButton-holidays]').first().click();

    cy.contains('08:00-16:00Itsepalvelu').should('be.visible');

    // Clean up
    cy.wait('@saveHoliday').then((interception) => {
      cy.deleteDatePeriod(interception.response?.body.id);
    });
  });
});
