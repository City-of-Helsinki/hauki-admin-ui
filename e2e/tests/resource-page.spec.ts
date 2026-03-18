// eslint-disable-next-line import/no-extraneous-dependencies
import { Page, expect, test } from '@playwright/test';
import {
  getResourceUrl,
  getResource,
  getDatePeriodIds,
  deleteDatePeriods,
} from '../utils';

import { testData } from '../constants';
import { Resource } from '../../src/common/lib/types';

test.describe('Resource page', async () => {
  let page: Page;
  let resourceUrl: string;
  let resource: Resource;

  test.beforeAll(async ({ browser }) => {
    resource = await getResource();
    resourceUrl = await getResourceUrl();

    page = await browser.newPage();
    await page.goto(resourceUrl);
    await expect(page.locator('body')).toContainText('Suomeksi');
    await page
      .getByRole('button', { name: 'Hyväksy vain välttämättömät evästeet' })
      .click();
  });

  test.beforeEach(async () => {
    await page.goto(resourceUrl);
  });

  test('Header visibility', async () => {
    await expect(
      page.getByRole('button', { name: testData.HAUKI_USER })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Aukioloajat' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Poikkeavat päivät' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Juhlapyhät' })
    ).toBeVisible();
  });

  test('Location name', async () => {
    const resourceTitle = resource.name.fi;

    await expect(page.getByText(resourceTitle)).toBeVisible();
  });

  test('Add and remove opening hour', async () => {
    const titleFi = 'e2e test title';

    await page.getByRole('button', { name: 'Lisää aukioloaika +' }).click();
    await page.locator('[data-testid="opening-period-title-fi"]').fill(titleFi);
    await page
      .locator('[data-testid="opening-period-title-sv"]')
      .fill('sommartid');
    await page
      .locator('[data-testid="opening-period-title-en"]')
      .fill('summertime');
    await page
      .getByLabel('Maanantai-Perjantai')
      .getByPlaceholder('Esim. seniorit')
      .fill('seniorit');
    await page
      .getByLabel('Maanantai-Perjantai')
      .getByPlaceholder('T.ex. seniorer')
      .fill('seniorer');
    await page
      .getByLabel('Maanantai-Perjantai')
      .getByPlaceholder('E.g. seniors')
      .fill('seniors');
    await page.getByText('24 h').click();
    await page.locator('[data-testid="submit-opening-hours-button"]').click();
    await expect(page.getByRole('heading', { name: titleFi })).toBeVisible();

    const removeButton = page
      .locator(
        '[data-testid="resource-opening-periods-list"] .opening-period-action-delete'
      )
      .filter({ visible: true })
      .last();
    await removeButton.click();
    await expect(
      page.getByRole('heading', {
        name: 'Oletko varma että haluat poistaa aukiolojakson?',
      })
    ).toBeVisible();
    await expect(
      page.getByText('Olet poistamassa aukiolojakson')
    ).toBeVisible();
    await page.getByRole('button', { name: 'Poista', exact: true }).click();
    await expect(page.getByTestId('date-period-delete-success')).toBeVisible();
  });

  test('Add three opening hours - reorder them', async () => {
    try {
      const datePeriodIds = await getDatePeriodIds(resource.id);
      await deleteDatePeriods(datePeriodIds);

      const periods = [
        { fi: 'e2e test title 1', sv: 'sommartid 1', en: 'summertime 1' },
        { fi: 'e2e test title 2', sv: 'sommartid 2', en: 'summertime 2' },
      ];

      for (const period of periods) {
        await page.getByRole('button', { name: 'Lisää aukioloaika +' }).click();
        await page
          .locator('[data-testid="opening-period-title-fi"]')
          .fill(period.fi);
        await page
          .locator('[data-testid="opening-period-title-sv"]')
          .fill(period.sv);
        await page
          .locator('[data-testid="opening-period-title-en"]')
          .fill(period.en);
        await page.getByText('24 h').click();
        await page
          .locator('[data-testid="submit-opening-hours-button"]')
          .click();
        await expect(
          page.locator('[data-testid="submit-opening-hours-button"]')
        ).not.toBeVisible({ timeout: 60 * 1000 });
        await expect(
          page.getByRole('button', { name: 'Lisää aukioloaika +' })
        ).toBeVisible({
          timeout: 60 * 1000,
        });
        await expect(
          page.getByRole('heading', { name: period.fi })
        ).toBeVisible({
          timeout: 30 * 1000,
        });
      }

      // Confirm that the page is loaded and ready
      for (const period of periods) {
        await expect(
          page.getByRole('heading', { name: period.fi })
        ).toBeVisible({
          timeout: 30 * 1000,
        });
      }

      // Test reordering: move the second period up, verify order changes
      const list = page.locator(
        '[data-testid="resource-opening-periods-list"]'
      );
      const headingsBefore = await list.locator('h3').allTextContents();

      // Wait for GET after the PATCH requests complete
      const reorderUpPromise = page.waitForResponse(
        (response) =>
          response.url().includes('/date_period') &&
          response.request().method() === 'GET' &&
          response.ok()
      );

      await list
        .locator('[data-testid*="openingPeriodMoveUpButton"]')
        .nth(1)
        .click();

      await reorderUpPromise;

      // Wait for the UI to update after reorder
      await page.waitForLoadState('domcontentloaded');

      await expect(
        page.getByRole('button', { name: 'Lisää aukioloaika +' })
      ).toBeVisible({
        timeout: 60 * 1000,
      });

      await expect(list.locator('h3').nth(0)).toHaveText(headingsBefore[1], {
        timeout: 30 * 1000,
      });
      await expect(list.locator('h3').nth(1)).toHaveText(headingsBefore[0], {
        timeout: 30 * 1000,
      });

      // Move it back down — restores original order
      const reorderDownPromise = page.waitForResponse(
        (response) =>
          response.url().includes('/date_period') &&
          response.request().method() === 'GET' &&
          response.ok()
      );

      await list
        .locator('[data-testid*="openingPeriodMoveDownButton"]')
        .nth(0)
        .click();

      await reorderDownPromise;

      // Wait for the UI to update after reorder
      await page.waitForLoadState('domcontentloaded');

      await expect(list.locator('h3').nth(0)).toHaveText(headingsBefore[0], {
        timeout: 30 * 1000,
      });
      await expect(list.locator('h3').nth(1)).toHaveText(headingsBefore[1], {
        timeout: 30 * 1000,
      });
    } finally {
      // If the test fails it will leave a mess if not cleaned
      const datePeriodIds = await getDatePeriodIds(resource.id);
      await deleteDatePeriods(datePeriodIds);
    }
  });

  test('Add and remove exceptional opening hours', async () => {
    const titleFi = 'e2e test title';

    await page.getByRole('button', { name: 'Lisää poikkeava päivä +' }).click();
    await page.locator('[data-testid="opening-period-title-fi"]').fill(titleFi);
    await page
      .locator('[data-testid="opening-period-title-sv"]')
      .fill('utbildngingstad');
    await page
      .locator('[data-testid="opening-period-title-en"]')
      .fill('training day');
    await page.locator('[data-testid="submit-opening-hours-button"]').click();

    await expect(page.getByTestId('opening-period-form-success')).toBeVisible();

    const removeButton = page
      .locator(
        '[data-testid="resource-exception-opening-periods-list"] .opening-period-action-delete'
      )
      .filter({ visible: true })
      .last();
    await removeButton.click();
    await expect(
      page.getByRole('heading', {
        name: 'Oletko varma että haluat poistaa aukiolojakson?',
      })
    ).toBeVisible();
    await expect(
      page.getByText('Olet poistamassa aukiolojakson')
    ).toBeVisible();
    await page.getByRole('button', { name: 'Poista', exact: true }).click();
    await expect(page.getByTestId('date-period-delete-success')).toBeVisible();
  });

  test('Add and delete custom holiday - Closed all day', async () => {
    await page.getByRole('button', { name: 'Muokkaa juhlapyhiä' }).click();

    const holidayInput = page
      .locator('input[data-testid*="holiday-"]:not(:checked):not(:disabled)')
      .first();
    const holidayTestId = await holidayInput.getAttribute('data-testid');

    await page.locator(`[data-testid="${holidayTestId}"]`).check();
    await page.locator('[data-testid="submit-opening-hours-button"]').click();
    await expect(page.getByTestId('holiday-form-success')).toBeVisible({
      timeout: 30 * 1000,
    });
    await page.locator(`[data-testid="${holidayTestId}"]`).click();
    await expect(page.locator('#confirmation-modal')).toBeVisible();

    await page.getByRole('button', { name: 'Poista', exact: true }).click();

    await expect(page.getByTestId('holiday-form-success')).toBeVisible();
  });

  test('Add and delete custom holiday - Exceptional opening hours', async () => {
    await page.getByRole('button', { name: 'Muokkaa juhlapyhiä' }).click();

    const holidayInput = page
      .locator('input[data-testid*="holiday-"]:not(:checked):not(:disabled)')
      .first();
    const holidayTestId = await holidayInput.getAttribute('data-testid');

    await page.locator(`[data-testid="${holidayTestId}"]`).check();
    await page.getByText('Poikkeava aukioloaika').click();
    await page.getByText('Auki', { exact: true }).click();
    await page.getByRole('option', { name: 'Itsepalvelu' }).click();
    await page.getByText('24 h').click();
    await page.getByPlaceholder('Esim. seniorit').fill('seniorit');
    await page.getByPlaceholder('T.ex. seniorer').fill('seniorer');
    await page.getByPlaceholder('E.g. seniors').fill('seniors');
    await page.locator('[data-testid="submit-opening-hours-button"]').click();
    await expect(page.getByTestId('holiday-form-success')).toBeVisible({
      timeout: 30 * 1000,
    });
    await page.locator(`[data-testid="${holidayTestId}"]`).click();
    await expect(
      page.getByRole('heading', { name: 'Oletko varma että haluat' })
    ).toBeVisible();
    await expect(
      page.getByText('Olet poistamassa aukiolojakson')
    ).toBeVisible();
    await page.getByRole('button', { name: 'Poista', exact: true }).click();
    await expect(page.getByTestId('holiday-form-success')).toBeVisible();
  });

  test('Dates - day selection', async () => {
    await page.getByRole('button', { name: 'Lisää aukioloaika +' }).click();

    await page
      .getByLabel('Aukiolomääritys 1')
      .getByText('ma', { exact: true })
      .click();
    await expect(
      page.getByText('Maanantai-päivä siirretty omaksi riviksi')
    ).toBeVisible();

    await page
      .getByLabel('Aukiolomääritys 1')
      .getByText('ti', { exact: true })
      .click();
    await expect(
      page.getByText('Tiistai-päivä siirretty omaksi riviksi')
    ).toBeVisible();

    await page.getByLabel('Aukiolomääritys 1').getByText('ke').click();
    await expect(
      page.getByText('Keskiviikko-päivä siirretty omaksi riviksi')
    ).toBeVisible();

    await page
      .getByLabel('Aukiolomääritys 1')
      .getByText('to', { exact: true })
      .click();
    await expect(
      page.getByText('Torstai-päivä siirretty omaksi riviksi')
    ).toBeVisible();
  });

  test('Past hours view', async () => {
    await expect(
      page.getByRole('link', { name: 'Näytä menneet aukioloajat' })
    ).toBeVisible();

    await page.getByRole('link', { name: 'Näytä menneet aukioloajat' }).click();
    await expect(
      page.getByRole('heading', { name: '- Menneet aukioloajat' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Palaa etusivulle' }).click();
    await expect(
      page.getByRole('button', { name: 'Lisää aukioloaika +' })
    ).toBeVisible();
  });
});
