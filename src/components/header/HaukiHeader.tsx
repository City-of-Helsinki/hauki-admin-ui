/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  IconCrossCircleFill,
  IconUser,
  Header,
  logoFiDark,
  logoSvDark,
  Logo,
  Link,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import api from '../../common/utils/api/api';
import { useAppContext } from '../../App-context';
import { AuthContextProps, TokenKeys, useAuth } from '../../auth/auth-context';
import './HaukiHeader.scss';
import toast from '../notification/Toast';
import { Language } from '../../common/lib/types';
import { languageOptions } from '../../constants';

const HaukiHeader = (): JSX.Element => {
  const { hasOpenerWindow, closeAppWindow, language, setLanguage } =
    useAppContext();
  const authProps: Partial<AuthContextProps> = useAuth();
  const { i18n, t } = useTranslation();
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
        showSignOutErrorNotification(t('Header.SignOutRejected'));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Sign out failed:', (e as Error).message);
      showSignOutErrorNotification(t('Header.SignOutFailed') + e);
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
      defaultLanguage={language}
      onDidChangeLanguage={(lang) => {
        i18n.changeLanguage(lang);
        if (setLanguage) {
          const newLanguage =
            Language[lang.toUpperCase() as keyof typeof Language];

          setLanguage(newLanguage);

          const urlSearchParams = new URLSearchParams(window.location.search);
          urlSearchParams.set('lang', newLanguage);

          history.push({
            pathname: window.location.pathname,
            search: urlSearchParams.toString(),
          });
        }
      }}>
      <Header.SkipLink skipTo="#main" label={t('Header.SkipLink')} />
      <Header.ActionBar
        title={t('Header.Title')}
        titleHref={`/resource/${id}`}
        frontPageLabel={t('Header.FrontPage')}
        menuButtonAriaLabel={t('Header.Menu')}
        logo={
          <Logo
            src={language === 'sv' ? logoSvDark : logoFiDark}
            alt={t('Header.LogoAlt')}
          />
        }>
        <Header.LanguageSelector />
        {isAuthenticated && (
          <Header.ActionBarItem
            fixedRightPosition
            id="action-bar-user"
            label={authTokens?.[TokenKeys.usernameKey]}
            closeLabel={t('Header.Close')}
            icon={<IconUser aria-hidden />}>
            <Link
              className="closeLink"
              data-testid="close-app-button"
              href="#"
              onClick={onCloseButtonClick}>
              <IconCrossCircleFill aria-hidden /> {t('Header.Close')}
            </Link>
          </Header.ActionBarItem>
        )}
      </Header.ActionBar>
      <Header.NavigationMenu>
        <Header.Link
          label={t('Header.Help')}
          href="https://kaupunkialustana.hel.fi/aukiolosovellus-ohje/"
          target="_blank"
          rel="noreferrer"
        />
      </Header.NavigationMenu>
    </Header>
  );
};

export default HaukiHeader;
