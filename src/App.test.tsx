import React from 'react';
import { render, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { screen as shadowScreen } from 'shadow-dom-testing-library';
import App from './App';

const setupResizeObserver = () => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
};

const clearAllCookies = () =>
  document.cookie.split(';').forEach((c) => {
    document.cookie = `${
      c.trim().split('=')[0]
    }=;expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  });

const realDateNow = Date.now.bind(global.Date);

beforeAll(() => {
  const dateNowStub = vi.fn(() => 1530518207007);

  global.Date.now = dateNowStub;
});

beforeEach(() => {
  vi.clearAllMocks();
  clearAllCookies();
});

afterAll(() => {
  global.Date.now = realDateNow;
});

const findCookieConsentModal = async () => {
  const regions = await shadowScreen.findAllByShadowRole('region');

  const container = regions.find(
    (region) => region.getAttribute('id') === 'hds-cc'
  );

  return container as HTMLElement;
};

const waitCookieConsentModalToBeVisible = async () => {
  const cookieConsentModal = await findCookieConsentModal();
  await within(cookieConsentModal).findByRole('heading', {
    name: 'Aukiolot käyttää evästeitä',
  });

  return cookieConsentModal;
};

const waitCookieConsentModalToBeHidden = async () => {
  const regions = shadowScreen.queryAllByRole('region');
  const container = regions.find(
    (region) => region.getAttribute('id') === 'hds-cc'
  );

  await waitFor(() => expect(container).not.toBeDefined());
};

const renderApp = async () => render(<App />);

const findAcceptAllButton = async (cookieConsentModal: HTMLElement) => {
  return within(cookieConsentModal).findByRole('button', {
    name: 'Hyväksy kaikki evästeet',
  });
};

const findAcceptOnlyNecessaryButton = async (
  cookieConsentModal: HTMLElement
) => {
  return within(cookieConsentModal).findByRole('button', {
    name: 'Hyväksy vain välttämättömät evästeet',
  });
};

const acceptOnlyNecessaryCookieText =
  '%7B%22groups%22%3A%7B%22shared%22%3A%7B%22checksum%22%3A%22d4a12889%22%2C%22timestamp%22%3A1530518207007%7D%7D%7D';
const acceptAllCookieText =
  '%7B%22groups%22%3A%7B%22shared%22%3A%7B%22checksum%22%3A%22d4a12889%22%2C%22timestamp%22%3A1530518207007%7D%2C%22statistics%22%3A%7B%22checksum%22%3A%228243e9a2%22%2C%22timestamp%22%3A1530518207007%7D%7D%7D';

describe('App', () => {
  it('should show cookie consent modal if consent is not saved to cookie', async () => {
    setupResizeObserver();
    renderApp();

    await waitCookieConsentModalToBeVisible();
  });

  it('should store consent to cookie when clicking accept all button', async () => {
    const user = userEvent.setup();

    renderApp();

    const cookieConsentModal = await waitCookieConsentModalToBeVisible();
    const acceptAllButton = await findAcceptAllButton(cookieConsentModal);
    await user.click(acceptAllButton);

    expect(document.cookie).toEqual(
      expect.stringContaining(acceptAllCookieText)
    );

    await waitCookieConsentModalToBeHidden();
  });

  it('should store consent to cookie when clicking accept only necessary button', async () => {
    const user = userEvent.setup();

    renderApp();

    const cookieConsentModal = await waitCookieConsentModalToBeVisible();
    const acceptOnlyNecessaryButton = await findAcceptOnlyNecessaryButton(
      cookieConsentModal
    );

    await user.click(acceptOnlyNecessaryButton);

    expect(document.cookie).toEqual(
      expect.stringContaining(acceptOnlyNecessaryCookieText)
    );
    await waitCookieConsentModalToBeHidden();
  });

  it('should not show cookie consent modal if consent is saved', async () => {
    document.cookie = acceptAllCookieText;

    renderApp();

    await waitCookieConsentModalToBeHidden();
  });
});
