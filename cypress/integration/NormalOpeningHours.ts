/// <reference types="cypress" />
/// <reference path="../index.d.ts" />
describe('User adds a new opening period', () => {
  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(Cypress.env('resourceId'));
    cy.acceptAllCookies();
  });

  it('Users successfully adds a new opening hours', () => {
    // Go to add new openings hours
    cy.get('[data-test=add-new-opening-period-button]').first().click();

    // Fill in opening hours
    const now = new Date();

    // Start filling the form, first is opening period title in finnish
    const titleFi = `e2e-test Testijakson otsikko ${now.toJSON()}`;
    cy.get('[data-test=opening-period-title-fi').type(titleFi);

    // ...then in swedish
    cy.get('[data-test=opening-period-title-sv').type(
      `e2e-test test periods rubrik ${now.toJSON()}`
    );
    // ...then in english
    cy.get('[data-test=opening-period-title-en').type(
      `e2e-test test period's title ${now.toJSON()}`
    );

    // Then select the begin and end date for the period. For the test we wish to select the summer dates
    cy.get('[data-test=opening-hours-validity-fixed-option').click({
      force: true,
    });
    cy.get('[data-test=opening-period-begin-date]').click();
    cy.get('button[aria-label="Valitse alkupäivämäärä"]').click();
    cy.get('select[aria-label="Kuukausi"]')
      .first()
      .select(`${now.getMonth() + 2}`);
    cy.get(`[role="dialog"] button[data-date$="01"]`)
      .filter(':visible')
      .click({ force: true });
    cy.get('[data-test="opening-period-end-date"]').click();
    cy.get('button[aria-label="Valitse loppupäivämäärä"]')
      .filter(':visible')
      .click();
    cy.get('select[aria-label="Kuukausi"]')
      .last()
      .select(`${now.getMonth() + 3}`);
    cy.get(`[role="dialog"] button[data-date$="28"]`)
      .filter(':visible')
      .click({ force: true });

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

    // Fill in hours for Saturday
    cy.selectHdsDropdown({
      id: 'openingHours-1-timeSpanGroups-0-timeSpans-0-resource_state',
      value: 'Auki',
    });

    cy.setHdsTimeInputTime({
      id: 'openingHours-1-timeSpanGroups-0-timeSpans-0-start-time',
      hours: '10',
      minutes: '00',
    });

    cy.setHdsTimeInputTime({
      id: 'openingHours-1-timeSpanGroups-0-timeSpans-0-end-time',
      hours: '15',
      minutes: '00',
    });

    // Add time span with state Itsepalvelu
    cy.get(
      '[data-test="openingHours-1-timeSpanGroups-0-timeSpans-add-time-span-button"'
    ).click();

    cy.selectHdsDropdown({
      id: 'openingHours-1-timeSpanGroups-0-timeSpans-1-resource_state',
      value: 'Itsepalvelu',
    });

    cy.setHdsTimeInputTime({
      id: 'openingHours-1-timeSpanGroups-0-timeSpans-1-start-time',
      hours: '15',
      minutes: '00',
    });

    cy.setHdsTimeInputTime({
      id: 'openingHours-1-timeSpanGroups-0-timeSpans-1-end-time',
      hours: '16',
      minutes: '00',
    });

    // Separate Sunday as it's own day
    cy.get('[data-test=openingHours-1-weekdays-7').click();
    cy.selectHdsDropdown({
      id: 'openingHours-2-timeSpanGroups-0-timeSpans-0-resource_state',
      value: 'Suljettu',
    });

    // Save opening hours
    cy.get('[data-test=submit-opening-hours-button]').click();

    cy.get('[data-testid=opening-period-form-success]', {
      timeout: 30000,
    })
      .should('be.visible')
      .contains('Aukiolon tallennus onnistui');
    cy.contains(titleFi);
  });

  it('Users successfully adds a weekday with no opening hours', () => {
    // Go to add new openings hours
    cy.get('[data-test=add-new-opening-period-button]').first().click();

    // Fill in opening hours
    const now = new Date();

    // Start filling the form, first is opening period title in finnish
    const titleFi = `e2e-test Testijakson otsikko ${now.toJSON()}`;
    cy.get('[data-test=opening-period-title-fi').type(titleFi);

    // ...then in swedish
    cy.get('[data-test=opening-period-title-sv').type(
      `e2e-test test periods rubrik ${now.toJSON()}`
    );
    // ...then in english
    cy.get('[data-test=opening-period-title-en').type(
      `e2e-test test period's title ${now.toJSON()}`
    );

    // Then select the begin and end date for the period. For the test we wish to select the summer dates
    cy.get('[data-test=opening-hours-validity-fixed-option').click({
      force: true,
    });
    cy.get('[data-test=opening-period-begin-date]').click();
    cy.get('button[aria-label="Valitse alkupäivämäärä"]').click();
    cy.get('select[aria-label="Kuukausi"]')
      .first()
      .select(`${now.getMonth() + 2}`);
    cy.get(`[role="dialog"] button[data-date$="01"]`)
      .filter(':visible')
      .click({ force: true });
    cy.get('[data-test="opening-period-end-date"]').click();
    cy.get('button[aria-label="Valitse loppupäivämäärä"]')
      .filter(':visible')
      .click();
    cy.get('select[aria-label="Kuukausi"]')
      .last()
      .select(`${now.getMonth() + 3}`);
    cy.get(`[role="dialog"] button[data-date$="28"]`)
      .filter(':visible')
      .click({ force: true });

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

    // Separate Wednesday as it's own day
    cy.get('[data-test=openingHours-0-weekdays-3').click();

    // Has Ei aukioloa as default
    cy.get(
      '#openingHours-1-timeSpanGroups-0-timeSpans-0-resource_state-toggle-button'
    ).should('have.text', 'Ei aukioloa');

    // Cannot add more time spans to the weekday
    cy.get(
      '[data-testopeningHours-1-timeSpanGroups-0-timeSpans-add-time-span-button]'
    ).should('not.be', 'visible');

    // Save opening hours
    cy.get('[data-test=submit-opening-hours-button]').click();

    cy.get('[data-testid=opening-period-form-success]', {
      timeout: 30000,
    })
      .should('be.visible')
      .contains('Aukiolon tallennus onnistui');

    cy.contains(titleFi);
  });
});
