import { render, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { screen as shadowScreen } from 'shadow-dom-testing-library';
import App from './App';

const setupResizeObserver = () => {
  global.ResizeObserver = vi.fn().mockImplementation(function () {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  });
};

const clearAllCookies = () =>
  document.cookie.split(';').forEach((c) => {
    document.cookie = `${
      c.trim().split('=')[0]
    }=;expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  });

// Helper function to decode and parse the cookie consent cookie
const parseConsentCookie = (cookieString: string) => {
  const match = cookieString.match(/helfi-cookie-consents=([^;]+)/);
  if (!match) return null;

  const decoded = decodeURIComponent(match[1]);
  return JSON.parse(decoded);
};

// Helper function to check if the cookie contains expected groups
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hasExpectedGroups = (cookieData: any, expectedGroups: string[]) => {
  if (!cookieData?.groups) return false;

  return expectedGroups.every(
    (group) =>
      cookieData.groups[group] &&
      typeof cookieData.groups[group].checksum === 'string' &&
      typeof cookieData.groups[group].timestamp === 'number'
  );
};

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
  await waitFor(() => {
    const regions = shadowScreen.queryAllByShadowRole('region');
    const container = regions.find(
      (region) => region.getAttribute('id') === 'hds-cc'
    );

    expect(container).not.toBeDefined();
  });
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

describe('App', () => {
  beforeAll(() => {
    setupResizeObserver();
  });

  it('should show cookie consent modal if consent is not saved to cookie', async () => {
    renderApp();

    await waitCookieConsentModalToBeVisible();
  });

  it('should store consent to cookie when clicking accept all button', async () => {
    const user = userEvent.setup();

    renderApp();

    const cookieConsentModal = await waitCookieConsentModalToBeVisible();
    const acceptAllButton = await findAcceptAllButton(cookieConsentModal);
    await user.click(acceptAllButton);

    // Parse and validate the cookie contains all expected groups for "accept all"
    const cookieData = parseConsentCookie(document.cookie);
    expect(cookieData).not.toBeNull();
    expect(
      hasExpectedGroups(cookieData, ['login', 'shared', 'statistics'])
    ).toBe(true);

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

    // Parse and validate the cookie contains only necessary groups (no statistics)
    const cookieData = parseConsentCookie(document.cookie);
    expect(cookieData).not.toBeNull();
    expect(hasExpectedGroups(cookieData, ['login', 'shared'])).toBe(true);
    // Statistics should not be present for "only necessary"
    expect(cookieData?.groups?.statistics).toBeUndefined();
    await waitCookieConsentModalToBeHidden();
  });

  it('should not show cookie consent modal if consent is saved', async () => {
    // Create a valid consent cookie with necessary groups
    const consentData = {
      groups: {
        login: { checksum: 'test123', timestamp: Date.now() },
        shared: { checksum: 'test789', timestamp: Date.now() },
        statistics: { checksum: 'testABC', timestamp: Date.now() },
      },
    };

    document.cookie = `helfi-cookie-consents=${encodeURIComponent(
      JSON.stringify(consentData)
    )}`;

    renderApp();

    await waitCookieConsentModalToBeHidden();
  });
});
