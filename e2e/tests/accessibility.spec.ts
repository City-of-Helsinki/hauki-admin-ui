// eslint-disable-next-line import/no-extraneous-dependencies
import { Page, expect, test } from '@playwright/test';
import { checkA11y } from '../a11y/checkA11y';
import {
  getResource,
  getDatePeriodIds,
  deleteDatePeriods,
  getResourceUrl,
} from '../utils';

type Language = 'fi' | 'sv' | 'en';

const acceptEssentialCookies = async (page: Page): Promise<void> => {
  await page
    .getByRole('button', { name: 'Hyväksy vain välttämättömät evästeet' })
    .click();
};

const openResourcePage = async (
  page: Page,
  lang: Language = 'fi'
): Promise<void> => {
  const resourceUrl = await getResourceUrl();
  await page.goto(resourceUrl);
  await acceptEssentialCookies(page);
  if (lang !== 'fi') {
    await page.goto(`${resourceUrl}&lang=${lang}`);
  }
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
};

const addOpeningPeriod = async (page: Page, title: string): Promise<void> => {
  await page.getByRole('button', { name: 'Lisää aukioloaika +' }).click();
  await page.getByTestId('opening-period-title-fi').fill(title);
  await page.getByText('24 h').click();
  await page.getByTestId('submit-opening-hours-button').click();
  // The form preview also shows the title: wait until the form is gone and the period is listed.
  await expect(page.getByTestId('submit-opening-hours-button')).toBeHidden({
    timeout: 30 * 1000,
  });
  await expect(
    page
      .getByTestId('resource-opening-periods-list')
      .getByRole('heading', { name: title })
  ).toBeVisible({ timeout: 30 * 1000 });
};

const deleteAllDatePeriods = async (): Promise<void> => {
  const resource = await getResource();
  await deleteDatePeriods(await getDatePeriodIds(resource.id));
};

/*
 * Axe scans run in Chromium only: results can differ slightly between browser engines, and the
 * baseline is shared per scan. Keyboard behaviour is tested in every configured browser.
 */
test.describe('Accessibility scans', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'axe scans run in Chromium only'
  );

  test.afterAll(deleteAllDatePeriods);

  test('front page with cookie consent', async ({ page }, testInfo) => {
    await page.goto('');
    await expect(
      page.getByRole('button', {
        name: 'Hyväksy vain välttämättömät evästeet',
      })
    ).toBeVisible();

    await checkA11y(page, testInfo, 'front page with cookie consent');
  });

  for (const lang of ['fi', 'sv', 'en'] as const) {
    test(`resource page (${lang})`, async ({ page }, testInfo) => {
      await openResourcePage(page, lang);

      await checkA11y(page, testInfo, `resource page (${lang})`);
    });
  }

  test('resource page with opening periods', async ({ page }, testInfo) => {
    await openResourcePage(page);
    await addOpeningPeriod(page, 'a11y test period');

    await checkA11y(page, testInfo, 'resource page with opening periods');
  });

  test('new opening period form', async ({ page }, testInfo) => {
    await openResourcePage(page);
    await page.getByRole('button', { name: 'Lisää aukioloaika +' }).click();
    await expect(page.getByTestId('submit-opening-hours-button')).toBeVisible();

    await checkA11y(page, testInfo, 'new opening period form');
  });

  test('new opening period form with validation error', async ({
    page,
  }, testInfo) => {
    await openResourcePage(page);
    await page.getByRole('button', { name: 'Lisää aukioloaika +' }).click();
    // Titles are optional; exceeding the 100 character limit is the reliable validation error.
    await page.getByTestId('opening-period-title-fi').fill('a'.repeat(101));
    await page.getByTestId('submit-opening-hours-button').click();
    await expect(page.getByText('Tarkista')).toBeVisible();

    await checkA11y(
      page,
      testInfo,
      'new opening period form with validation error'
    );
  });

  test('new exception form', async ({ page }, testInfo) => {
    await openResourcePage(page);
    await page.getByRole('button', { name: 'Lisää poikkeava päivä +' }).click();
    await expect(page.getByTestId('submit-opening-hours-button')).toBeVisible();

    await checkA11y(page, testInfo, 'new exception form');
  });

  test('holidays form with exceptional opening hours', async ({
    page,
  }, testInfo) => {
    await openResourcePage(page);
    await page.getByRole('button', { name: 'Muokkaa juhlapyhiä' }).click();
    await page
      .locator('input[data-testid*="holiday-"]:not(:checked):not(:disabled)')
      .first()
      .check();
    await page.getByText('Poikkeava aukioloaika').click();
    await expect(page.getByPlaceholder('Esim. seniorit')).toBeVisible();

    await checkA11y(
      page,
      testInfo,
      'holidays form with exceptional opening hours'
    );
  });

  test('past opening hours', async ({ page }, testInfo) => {
    await openResourcePage(page);
    await page.getByRole('link', { name: 'Näytä menneet aukioloajat' }).click();
    await expect(
      page.getByRole('heading', { name: '- Menneet aukioloajat' })
    ).toBeVisible();

    await checkA11y(page, testInfo, 'past opening hours');
  });

  test('delete confirmation dialog', async ({ page }, testInfo) => {
    await openResourcePage(page);
    await addOpeningPeriod(page, 'a11y dialog period');
    await page
      .getByTestId('resource-opening-periods-list')
      .locator('.opening-period-action-delete')
      .filter({ visible: true })
      .last()
      .click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await checkA11y(page, testInfo, 'delete confirmation dialog');
  });
});

test.describe('Keyboard: delete confirmation dialog', () => {
  test.afterEach(deleteAllDatePeriods);

  test('moves focus into the dialog, keeps it there and returns it on cancel', async ({
    page,
  }) => {
    await openResourcePage(page);
    await addOpeningPeriod(page, 'a11y keyboard period');

    const deleteButton = page
      .getByTestId('resource-opening-periods-list')
      .locator('.opening-period-action-delete')
      .filter({ visible: true })
      .last();
    await deleteButton.focus();
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName(
      'Oletko varma että haluat poistaa aukiolojakson?'
    );

    // WCAG 2.4.3 focus order: focus moves into the dialog and stays there.
    await expect
      .poll(() => dialog.evaluate((el) => el.contains(document.activeElement)))
      .toBe(true);
    for (let i = 0; i < 5; i += 1) {
      await page.keyboard.press('Tab');
      expect(
        await dialog.evaluate((el) => el.contains(document.activeElement))
      ).toBe(true);
    }

    await dialog.getByRole('button', { name: 'Peruuta' }).focus();
    await page.keyboard.press('Enter');

    await expect(dialog).toBeHidden();
    await expect(deleteButton).toBeFocused();
  });
});

test.describe('Form errors', () => {
  // Known issue: OpeningHoursTitles passes its own aria-describedby to the HDS TextInput, so in the
  // error state the input is not marked invalid and its error text ("Tarkista") is not
  // associated with it: screen readers don't announce the error (WCAG 3.3.1, level A).
  // TODO: add ticket id. Remove test.fail() once fixed; the test then guards the fix.
  test('invalid title field exposes its error to assistive technology', async ({
    page,
  }) => {
    test.fail();
    await openResourcePage(page);
    await page.getByRole('button', { name: 'Lisää aukioloaika +' }).click();
    const titleInput = page.getByRole('textbox', {
      name: 'Aukioloajan otsikko suomeksi',
    });
    await titleInput.fill('a'.repeat(101));
    await page.getByTestId('submit-opening-hours-button').click();
    await expect(page.getByText('Tarkista')).toBeVisible();

    await expect(titleInput).toHaveAttribute('aria-invalid', 'true');
    await expect(titleInput).toHaveAccessibleDescription(/Tarkista/);
  });
});
