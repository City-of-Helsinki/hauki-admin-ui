/// <reference types="cypress" />
/// <reference path="../index.d.ts" />
describe('User adds a new exception date period', () => {
  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(Cypress.env('resourceId'));
  });

  it('Users successfully adds a new exception opening hours', () => {
    // Go to add new openings hours
    cy.get('[data-test=add-new-exception-opening-period-button]')
      .first()
      .click();

    // Fill in opening hours
    const now = new Date();

    // Start filling the form, first is opening period title in finnish
    const titleFi = `e2e-test poikkeavan Testijakson otsikko ${now.toJSON()}`;
    cy.get('[data-test=opening-period-title-fi').type(titleFi);

    // ...then in swedish
    cy.get('[data-test=opening-period-title-sv').type(
      `e2e-test undantag test periods rubrik ${now.toJSON()}`
    );
    // ...then in english
    cy.get('[data-test=opening-period-title-en').type(
      `e2e-test exception test period's title ${now.toJSON()}`
    );
    cy.get('[data-test=exception-start-date]').click();
    cy.get('button[aria-label="Valitse alkupäivämäärä"]').first().click();

    const currDay = now.getDate();

    cy.get(`[role="dialog"] button[data-date$="${currDay}"]`)
      .filter(':visible')
      .click({ force: true });

    cy.get('[data-test=exception-end-date]').click();
    cy.get('button[aria-label="Valitse loppupäivämäärä"]').first().click();

    cy.get(`[role="dialog"] button[data-date$="${currDay}"]`)
      .filter(':visible')
      .click({ force: true });

    cy.get(
      'label[for="exception-opening-hours-form-open-state-checkbox"]'
    ).click();

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

    // Add time span with state Itsepalvelu
    cy.get(
      '[data-test="openingHours-0-timeSpanGroups-0-timeSpans-add-time-span-button"'
    ).click();

    cy.setHdsTimeInputTime({
      id: 'openingHours-0-timeSpanGroups-0-timeSpans-1-start-time',
      hours: '16',
      minutes: '00',
    });

    cy.setHdsTimeInputTime({
      id: 'openingHours-0-timeSpanGroups-0-timeSpans-1-end-time',
      hours: '17',
      minutes: '00',
    });

    cy.selectHdsDropdown({
      id: 'openingHours-0-timeSpanGroups-0-timeSpans-1-resource_state',
      value: 'Itsepalvelu',
    });

    // Save opening hours
    cy.get('[data-test=submit-opening-hours-button]').click();

    cy.get('[data-testid=opening-period-form-success]', {
      timeout: 30000,
    })
      .should('be.visible')
      .contains('Poikkeavan päivän aukiolon lisääminen onnistui');

    cy.contains(titleFi);
  });

  it('Users successfully adds a new exception opening hours', () => {
    // Go to add new openings hours
    cy.get('[data-test=add-new-exception-opening-period-button]')
      .first()
      .click();

    // Fill in opening hours
    const now = new Date();

    // Start filling the form, first is opening period title in finnish
    const titleFi = `e2e-test poikkeavan Testijakson otsikko ${now.toJSON()}`;
    cy.get('[data-test=opening-period-title-fi').type(titleFi);

    // ...then in swedish
    cy.get('[data-test=opening-period-title-sv').type(
      `e2e-test undantag test periods rubrik ${now.toJSON()}`
    );
    // ...then in english
    cy.get('[data-test=opening-period-title-en').type(
      `e2e-test exception test period's title ${now.toJSON()}`
    );

    const currMonth = now.getMonth() + 2;

    cy.get('[data-test=exception-start-date]').click();
    cy.get('button[aria-label="Valitse alkupäivämäärä"]').first().click();
    cy.get('select[aria-label="Kuukausi"]').first().select(`${currMonth}`);
    cy.get(`[role="dialog"] button[data-date$="01"]`)
      .filter(':visible')
      .click({ force: true });
    cy.get('[data-test="exception-end-date"]').click();
    cy.get('button[aria-label="Valitse loppupäivämäärä"]')
      .filter(':visible')
      .click();
    cy.get('select[aria-label="Kuukausi"]').last().select(`${currMonth}`);
    cy.get(`[role="dialog"] button[data-date$="05"]`)
      .filter(':visible')
      .click({ force: true });

    cy.get(
      'label[for="exception-opening-hours-form-open-state-checkbox"]'
    ).click();

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

    // Add time span with state Itsepalvelu
    cy.get(
      '[data-test="openingHours-0-timeSpanGroups-0-timeSpans-add-time-span-button"'
    ).click();

    cy.setHdsTimeInputTime({
      id: 'openingHours-0-timeSpanGroups-0-timeSpans-1-start-time',
      hours: '16',
      minutes: '00',
    });

    cy.setHdsTimeInputTime({
      id: 'openingHours-0-timeSpanGroups-0-timeSpans-1-end-time',
      hours: '17',
      minutes: '00',
    });

    cy.selectHdsDropdown({
      id: 'openingHours-0-timeSpanGroups-0-timeSpans-1-resource_state',
      value: 'Itsepalvelu',
    });

    // Save opening hours
    cy.get('[data-test=submit-opening-hours-button]').click();

    cy.get('[data-testid=opening-period-form-success]', {
      timeout: 30000,
    })
      .should('be.visible')
      .contains('Poikkeavan päivän aukiolon lisääminen onnistui');

    cy.contains(titleFi);
  });
});
