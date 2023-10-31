import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import api from '../../common/utils/api/api';
import { AppContext } from '../../App-context';
import { AuthContext } from '../../auth/auth-context';
import HaukiNavigation from './HaukiNavigation';

describe('<HaukiNavigation>', () => {
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
            <HaukiNavigation />
          </AuthContext.Provider>
        </AppContext.Provider>
      </Router>
    );

    const authButton = screen.getByRole('button', { name: 'tester' });

    userEvent.click(authButton);

    const closeButton = await screen.findByRole('link', { name: 'Sulje' });

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
            <HaukiNavigation />
          </AuthContext.Provider>
        </AppContext.Provider>
      </Router>
    );

    expect(screen.getAllByText('Suomeksi').length).toEqual(1);
  });
});
