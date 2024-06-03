// eslint-disable-next-line import/no-extraneous-dependencies
import { Page, expect, test } from '@playwright/test';
import { getResource, getResourceUrl } from '../utils';
import { Resource } from '../../src/common/lib/types';
import { testData } from '../constants';

test.describe('Resource page', async () => {
  let page: Page;
  let resourceUrl: string;
  let resource: Resource;

  test.beforeAll(async ({ browser }) => {
    resourceUrl = await getResourceUrl();
    resource = await getResource();

    page = await browser.newPage();
    await page.goto(resourceUrl);
    await expect(page.locator('body')).toContainText('Suomeksi');
    await page.getByTestId('cookie-consent-approve-required-button').click();
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
    await page.locator('[data-test="opening-period-title-fi"]').fill(titleFi);
    await page
      .locator('[data-test="opening-period-title-sv"]')
      .fill('sommartid');
    await page
      .locator('[data-test="opening-period-title-en"]')
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
    await page.locator('[data-test="submit-opening-hours-button"]').click();
    await expect(page.getByRole('heading', { name: titleFi })).toBeVisible();

    const removeButton = page
      .locator(
        '[data-test="resource-opening-periods-list"] .opening-period-action-delete'
      )
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

  test('Add and remove exceptional opening hours', async () => {
    const titleFi = 'e2e test title';

    await page.getByRole('button', { name: 'Lisää poikkeava päivä +' }).click();
    await page.locator('[data-test="opening-period-title-fi"]').fill(titleFi);
    await page
      .locator('[data-test="opening-period-title-sv"]')
      .fill('utbildngingstad');
    await page
      .locator('[data-test="opening-period-title-en"]')
      .fill('training day');
    await page.locator('[data-test="submit-opening-hours-button"]').click();

    await expect(page.getByTestId('opening-period-form-success')).toBeVisible();

    const removeButton = page
      .locator(
        '[data-test="resource-exception-opening-periods-list"] .opening-period-action-delete'
      )
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
      .locator('input[data-test*="holiday-"]:not(:checked):not(:disabled)')
      .first();
    const holidayTestId = await holidayInput.getAttribute('data-test');

    await page.locator(`[data-test="${holidayTestId}"]`).check();
    await page.locator('[data-test="submit-opening-hours-button"]').click();
    await expect(page.getByTestId('holiday-form-success')).toBeVisible({
      timeout: 30 * 1000,
    });
    await page.locator(`[data-test="${holidayTestId}"]`).click();
    await expect(page.locator('#confirmation-modal')).toBeVisible();

    await page.getByRole('button', { name: 'Poista', exact: true }).click();

    await expect(page.getByTestId('holiday-form-success')).toBeVisible();
  });

  test('Add and delete custom holiday - Exceptional opening hours', async () => {
    await page.getByRole('button', { name: 'Muokkaa juhlapyhiä' }).click();

    const holidayInput = page
      .locator('input[data-test*="holiday-"]:not(:checked):not(:disabled)')
      .first();
    const holidayTestId = await holidayInput.getAttribute('data-test');

    await page.locator(`[data-test="${holidayTestId}"]`).check();
    await page.getByText('Poikkeava aukioloaika').click();
    await page.getByLabel('Auki', { exact: true }).click();
    await page.getByRole('option', { name: 'Itsepalvelu' }).click();
    await page.getByText('24 h').click();
    await page.getByPlaceholder('Esim. seniorit').fill('seniorit');
    await page.getByPlaceholder('T.ex. seniorer').fill('seniorer');
    await page.getByPlaceholder('E.g. seniors').fill('seniors');
    await page.locator('[data-test="submit-opening-hours-button"]').click();
    await expect(page.getByTestId('holiday-form-success')).toBeVisible({
      timeout: 30 * 1000,
    });
    await page.locator(`[data-test="${holidayTestId}"]`).click();
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
    const createNewPeriodUrl = `/resource/${resource.id}/period/new`;

    await page.getByRole('button', { name: 'Lisää aukioloaika +' }).click();
    await page.goto(createNewPeriodUrl);

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
});
