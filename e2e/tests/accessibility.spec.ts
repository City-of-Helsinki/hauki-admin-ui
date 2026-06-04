// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect } from '@playwright/test';
// eslint-disable-next-line import/no-extraneous-dependencies
import AxeBuilder from '@axe-core/playwright';
import { getResourceUrl } from '../utils';

test('Frontpage has no wcag2a/wcag2aa violations', async ({ page }) => {
  await page.goto('');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('Resource page has no wcag2a/wcag2aa violations', async ({ page }) => {
  const resourceUrl = await getResourceUrl();
  await page.goto(resourceUrl);
  await expect(page.locator('body')).toContainText('Suomeksi');
  await page
    .getByRole('button', { name: 'Hyväksy vain välttämättömät evästeet' })
    .click();
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
