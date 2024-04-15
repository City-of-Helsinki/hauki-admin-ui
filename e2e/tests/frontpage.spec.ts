// eslint-disable-next-line import/no-extraneous-dependencies
import { Page, expect, test } from '@playwright/test';

test.describe('Frontpage', async () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    await page.goto('');
  });

  test('Page title', async () => {
    await expect(page).toHaveTitle('Aukiolot');
  });

  test('Header visibility', async () => {
    await expect(page.getByRole('link', { name: 'Aukiolot' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Suomeksi' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Svenska' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'English' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ohje' })).toBeVisible();
  });

  test('Footer visibility', async () => {
    await expect(
      page.getByRole('link', { name: 'Saavutettavuusseloste' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Sisältölisenssi CC BY 4.0' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Evästeasetukset' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Takaisin ylös' })
    ).toBeVisible();
  });
});
