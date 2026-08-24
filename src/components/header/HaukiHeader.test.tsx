import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import api from '../../common/utils/api/api';
import { AppContext } from '../../App-context';
import { AuthContext, AuthTokens } from '../../auth/auth-context';
import HaukiHeader from './HaukiHeader';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',

    init: () => {},
  },
}));

const testAuthTokens: AuthTokens = {
  hsa_source: 'tprek',
  hsa_username: 'tester',
  hsa_created_at: '2026-01-01T00:00:00.000Z',
  hsa_valid_until: '2026-01-08T00:00:00.000Z',
  hsa_resource: 'tprek:8215',
  hsa_organization: 'tprek:83e74666-0836-4c1d-948a-4b34a8b90301',
  hsa_signature: 'test-signature',
  hsa_has_organization_rights: 'true',
};

vi.mock('react-router-dom', async (importOriginal) => {
  const mod = await importOriginal();

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /* @ts-ignore */
    ...mod,
    useNavigate: vi.fn(),
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
              authTokens: testAuthTokens,
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
            value={{ authTokens: testAuthTokens, clearAuth: vi.fn() }}>
            <HaukiHeader />
          </AuthContext.Provider>
        </AppContext.Provider>
      </Router>
    );

    expect(screen.getAllByText('Suomeksi').length).toEqual(1);
  });
});
