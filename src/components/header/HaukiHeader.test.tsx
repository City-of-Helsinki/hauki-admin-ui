import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { Mock } from 'vitest';
import api from '../../common/utils/api/api';
import { AppContext } from '../../App-context';
import { AuthContext } from '../../auth/auth-context';
import HaukiHeader from './HaukiHeader';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    init: () => {},
  },
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const mod = await importOriginal();

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /* @ts-ignore */
    ...mod,
    useHistory: (): { push: Mock } => ({
      push: vi.fn(),
    }),
  };
});

describe('<HaukiHeader>', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('Should logout and close window when user clicks close button', async () => {
    const closeAppWindow = vi.fn();

    vi.spyOn(api, 'invalidateAuth').mockImplementation(() =>
      Promise.resolve(true)
    );

    render(
      <Router>
        <AppContext.Provider value={{ hasOpenerWindow: true, closeAppWindow }}>
          <AuthContext.Provider
            value={{
              authTokens: { hsa_username: 'tester' },
              clearAuth: vi.fn(),
            }}>
            <HaukiHeader />
          </AuthContext.Provider>
        </AppContext.Provider>
      </Router>
    );

    const authButton = screen.getByRole('button', { name: 'tester' });

    userEvent.click(authButton);

    const closeButton = await screen.findByRole('link', {
      name: 'Header.Close',
    });

    userEvent.click(closeButton);

    await waitFor(async () => {
      expect(closeAppWindow).toHaveBeenCalled();
    });
  });

  it('should show selected language', () => {
    const closeAppWindow = vi.fn();

    vi.spyOn(api, 'invalidateAuth').mockImplementation(() =>
      Promise.resolve(true)
    );

    render(
      <Router>
        <AppContext.Provider value={{ hasOpenerWindow: true, closeAppWindow }}>
          <AuthContext.Provider
            value={{ authTokens: { name: 'tester' }, clearAuth: vi.fn() }}>
            <HaukiHeader />
          </AuthContext.Provider>
        </AppContext.Provider>
      </Router>
    );

    expect(screen.getAllByText('Suomeksi').length).toEqual(1);
  });
});
