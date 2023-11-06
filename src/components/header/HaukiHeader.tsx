/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  IconCrossCircleFill,
  IconUser,
  Header,
  logoFiDark,
  Logo,
  Link,
} from 'hds-react';
import api from '../../common/utils/api/api';
import { useAppContext } from '../../App-context';
import { AuthContextProps, TokenKeys, useAuth } from '../../auth/auth-context';
import './HaukiHeader.scss';
import toast from '../notification/Toast';
import { Language } from '../../common/lib/types';
import { languageOptions } from '../../constants';

const HaukiHeader = (): JSX.Element => {
  const { hasOpenerWindow, closeAppWindow, setLanguage } = useAppContext();
  const authProps: Partial<AuthContextProps> = useAuth();
  const { authTokens, clearAuth } = authProps;
  const history = useHistory();
  const isAuthenticated = !!authTokens;
  const { id } = useParams<{ id: string }>();

  const showSignOutErrorNotification = (text: string): void =>
    toast.error({
      label: text,
    });

  const signOut = async (): Promise<void> => {
    try {
      const isAuthInvalidated = await api.invalidateAuth();
      if (isAuthInvalidated) {
        if (clearAuth) {
          clearAuth();
        }
        history.push('/');
      } else {
        showSignOutErrorNotification('Uloskirjautuminen hylättiin.');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Sign out failed:', (e as Error).message);
      showSignOutErrorNotification(
        `Uloskirjautuminen epäonnistui. Yritä myöhemmin uudestaan. Virhe: ${e}`
      );
    }
  };

  const onCloseButtonClick = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();

    if (isAuthenticated) {
      await signOut();
    }

    if (hasOpenerWindow && closeAppWindow) {
      closeAppWindow();
    }
  };

  return (
    <Header
      theme={{
        '--actionbar-background-color': 'var(--hauki-header-background-color)',
        '--header-color': 'var(--color-white)',
      }}
      className="header"
      languages={languageOptions}
      onDidChangeLanguage={(language) => {
        if (setLanguage) {
          const newLanguage =
            Language[language.toUpperCase() as keyof typeof Language];

          setLanguage(newLanguage);
        }
      }}>
      <Header.SkipLink skipTo="#main" label="Siirry pääsisältöön" />
      <Header.ActionBar
        title="Aukiolot"
        titleHref={`/resource/${id}`}
        frontPageLabel="Etusivu"
        menuButtonAriaLabel="Menu"
        logo={<Logo src={logoFiDark} alt="Helsingin kaupunki" />}>
        <Header.LanguageSelector />
        {isAuthenticated && (
          <Header.ActionBarItem
            fixedRightPosition
            id="action-bar-user"
            label={authTokens?.[TokenKeys.usernameKey]}
            icon={<IconUser aria-hidden />}>
            <Link
              className="closeLink"
              data-testid="close-app-button"
              href="#"
              onClick={onCloseButtonClick}>
              <IconCrossCircleFill aria-hidden /> Sulje
            </Link>
          </Header.ActionBarItem>
        )}
      </Header.ActionBar>
      <Header.NavigationMenu>
        <Header.Link
          label="Ohje"
          href="https://kaupunkialustana.hel.fi/aukiolosovellus-ohje/"
          target="_blank"
          rel="noreferrer"
        />
      </Header.NavigationMenu>
    </Header>
  );
};

export default HaukiHeader;
