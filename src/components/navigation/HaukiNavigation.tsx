import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Navigation } from 'hds-react';
import api from '../../common/utils/api/api';
import { AuthContextProps, TokenKeys, useAuth } from '../../auth/auth-context';
import './HaukiNavigation.scss';
import { ErrorToast } from '../notification/Toast';

export default function HaukiNavigation(): JSX.Element {
  const [signOutError, setSignOutError] = useState<string | undefined>();
  const authProps: Partial<AuthContextProps> = useAuth();
  const { authTokens, clearAuth } = authProps;
  const history = useHistory();
  const isAuthenticated = !!authTokens;

  const signOut = async (): Promise<void> => {
    try {
      const isAuthInvalidated = await api.invalidateAuth();
      if (isAuthInvalidated) {
        setSignOutError(undefined);
        if (clearAuth) {
          clearAuth();
        }
        history.push('/');
      } else {
        setSignOutError('Uloskirjautuminen hylättiin.');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Sign out failed:', e.message);
      setSignOutError(
        `Uloskirjautuminen epäonnistui. Yritä myöhemmin uudestaan. Virhe: ${e}`
      );
    }
  };

  return (
    <Navigation
      theme={{
        '--header-background-color': 'var(--hauki-header-background-color)',
        '--header-color': 'var(--hauki-header-color)',
      }}
      className="navigation-header"
      title="Aukiolot"
      menuToggleAriaLabel="Menu"
      skipTo="#main"
      skipToContentLabel="Siirry pääsisältöön">
      <Navigation.Actions>
        <Navigation.User
          authenticated={isAuthenticated}
          label="Kirjaudu"
          userName={authTokens && authTokens[TokenKeys.usernameKey]}>
          <Navigation.Item
            label="Kirjaudu ulos"
            target="_blank"
            variant="primary"
            onClick={(): Promise<void> => signOut()}
          />
        </Navigation.User>
      </Navigation.Actions>
      {signOutError && (
        <ErrorToast label="Uloskirjautuminen epäonnistui" text={signOutError} />
      )}
    </Navigation>
  );
}
