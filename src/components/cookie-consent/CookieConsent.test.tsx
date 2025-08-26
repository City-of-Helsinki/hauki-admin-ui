import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContext } from '../../App-context';
import CookieConsent from './CookieConsent';
import { Language } from '../../common/lib/types';
import MatomoContext from '../matomo/matomo-context';
import MatomoTracker from '../matomo/MatomoTracker';

describe('CookieConsent', () => {
  it('should render cookie modal', async () => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    const setLanguageMock = vi.fn();
    const mockMatomoTracker = new MatomoTracker({
      urlBase: 'https://www.test.fi/',
      siteId: 'test123',
      srcUrl: 'test.js',
      enabled: true,
    });

    const user = userEvent.setup();

    render(
      <AppContext.Provider
        value={{ language: Language.FI, setLanguage: setLanguageMock }}>
        <MatomoContext.Provider value={mockMatomoTracker}>
          <CookieConsent />
        </MatomoContext.Provider>
      </AppContext.Provider>
    );

    const buttons = await screen.findAllByRole('button');
    const changeLanguageButton = buttons[0];

    await user.click(changeLanguageButton);

    const enOption = await screen.findByRole('link', { name: 'English (EN)' });

    await user.click(enOption);

    expect(setLanguageMock).toHaveBeenCalled();
  });
});
