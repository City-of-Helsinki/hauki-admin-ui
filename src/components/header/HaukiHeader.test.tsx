import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import api from '../../common/utils/api/api';
import { AppContext } from '../../App-context';
import { AuthContext } from '../../auth/auth-context';
import HaukiHeader from './HaukiHeader';

jest.mock('react-i18next', () => ({
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

describe('<HaukiHeader>', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should logout and close window when user clicks close button', async () => {
    const closeAppWindow = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useHistory: (): { push: jest.Mock } => ({
        push: jest.fn(),
      }),
    }));

    jest
      .spyOn(api, 'invalidateAuth')
      .mockImplementation(() => Promise.resolve(true));

    render(
      <Router>
        <AppContext.Provider value={{ hasOpenerWindow: true, closeAppWindow }}>
          <AuthContext.Provider
            value={{
              authTokens: { hsa_username: 'tester' },
              clearAuth: jest.fn(),
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
    const closeAppWindow = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useHistory: (): { push: jest.Mock } => ({
        push: jest.fn(),
      }),
    }));

    jest
      .spyOn(api, 'invalidateAuth')
      .mockImplementation(() => Promise.resolve(true));

    render(
      <Router>
        <AppContext.Provider value={{ hasOpenerWindow: true, closeAppWindow }}>
          <AuthContext.Provider
            value={{ authTokens: { name: 'tester' }, clearAuth: jest.fn() }}>
            <HaukiHeader />
          </AuthContext.Provider>
        </AppContext.Provider>
      </Router>
    );

    expect(screen.getAllByText('Suomeksi').length).toEqual(1);
  });
});
