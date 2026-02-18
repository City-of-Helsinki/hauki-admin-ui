/* eslint-disable no-underscore-dangle */
import React, { useCallback, useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'hds-core';
import { AppContext } from './App-context';
import urlUtils, { SearchParameters } from './common/utils/url/url';
import {
  AuthContext,
  AuthTokens,
  getTokens,
  parseAuthParams,
  removeTokens,
  storeTokens,
} from './auth/auth-context';
import Main from './components/main/Main';
import NavigationAndFooterWrapper from './components/navigation-and-footer-wrapper/NavigationAndFooterWrapper';
import HaukiHeader from './components/header/HaukiHeader';
import './App.scss';
import { Language } from './common/lib/types';
import PermissionResolver from './components/router/PermissionResolver';
import ResourcePage from './pages/ResourcePage';
import ResourceBatchUpdatePage from './pages/ResourceBatchUpdatePage';
import ResourcePastOpeningHoursPage from './pages/ResourcePastOpeningHoursPage';
import AddNormalOpeningHoursPage from './pages/AddNormalOpeningHoursPage';
import EditNormalOpeningHoursPage from './pages/EditNormalOpeningHoursPage';
import EditHolidaysPage from './pages/EditHolidaysPage';
import AddExceptionOpeningHoursPage from './pages/AddExceptionOpeningHoursPage';
import EditExceptionOpeningHoursPage from './pages/EditExceptionOpeningHoursPage';
import { SelectedDatePeriodsProvider } from './common/selectedDatePeriodsContext/SelectedDatePeriodsContext';
import MatomoTracker from './components/matomo/MatomoTracker';
import MatomoContext from './components/matomo/matomo-context';
import CookieConsent from './components/cookie-consent/CookieConsent';
import CookieManagement from './pages/CookieManagement';

type OptionalAuthTokens = AuthTokens | undefined;

const getPersistentTokens = (): OptionalAuthTokens => {
  const authTokensFromQuery: OptionalAuthTokens = parseAuthParams(
    window.location.search
  );

  if (authTokensFromQuery) {
    storeTokens(authTokensFromQuery);
  }

  return getTokens();
};

const App = (): JSX.Element => {
  const hasOpenerWindow =
    document.referrer && document.referrer !== window.location.href;

  const closeAppWindow = useCallback((): void => {
    // A window can only close itself if it has an parent opener.
    if (hasOpenerWindow) {
      window.close();
    }
  }, [hasOpenerWindow]);

  const searchParams: SearchParameters = urlUtils.parseSearchParameters(
    window ? window.location.search : ''
  );
  const targetResourcesParameter = 'target_resources';
  const targetResourcesStr: string | undefined = searchParams[
    targetResourcesParameter
  ] as string;

  const [authTokens, setAuthTokens] = useState<AuthTokens | undefined>(
    getPersistentTokens()
  );

  const clearAuth = useCallback((): void => {
    setAuthTokens(undefined);
    removeTokens();
  }, [setAuthTokens]);

  const langStringFromUrl = searchParams?.lang as string;
  const langFromUrl =
    langStringFromUrl && langStringFromUrl.toUpperCase() in Language
      ? (langStringFromUrl.toLowerCase() as Language)
      : Language.FI;

  const [language, setLanguage] = useState(langFromUrl);
  const appContextValue = useMemo(
    () => ({
      hasOpenerWindow,
      closeAppWindow,
      language,
      setLanguage,
    }),
    [hasOpenerWindow, closeAppWindow, language, setLanguage]
  );
  const authContextValue = useMemo(
    () => ({ authTokens, clearAuth }),
    [authTokens, clearAuth]
  );

  const matomoTracker = useMemo(
    () =>
      new MatomoTracker({
        urlBase: window?._env_?.MATOMO_URL_BASE,
        siteId: window?._env_?.MATOMO_SITE_ID,
        srcUrl: window?._env_?.MATOMO_SRC_URL,
        enabled: window?._env_?.MATOMO_ENABLED === 'true',
        configurations: {
          setDoNotTrack: true,
        },
      }),
    []
  );

  return (
    <div className="App">
      <AppContext.Provider value={appContextValue}>
        <MatomoContext.Provider value={matomoTracker}>
          <CookieConsent />

          <AuthContext.Provider value={authContextValue}>
            <Router>
              <Routes>
                <Route
                  path="/"
                  element={
                    <NavigationAndFooterWrapper>
                      <Main id="main">
                        <h1>Etusivu</h1>
                      </Main>
                    </NavigationAndFooterWrapper>
                  }
                />
                <Route
                  path="/not_found"
                  element={
                    <NavigationAndFooterWrapper>
                      <Main id="main">
                        <h1>Kohdetta ei löydy</h1>
                        <p>
                          Kohdetta ei löytynyt. Yritä myöhemmin uudestaan.
                          Ongelman toistuessa ota yhteys sivuston ylläpitoon.
                          Teidät on automaattisesti kirjattu ulos.
                        </p>
                      </Main>
                    </NavigationAndFooterWrapper>
                  }
                />
                <Route
                  path="/unauthorized"
                  element={
                    <NavigationAndFooterWrapper>
                      <Main id="main">
                        <h1>Puutteelliset tunnukset</h1>
                      </Main>
                    </NavigationAndFooterWrapper>
                  }
                />
                <Route
                  path="/unauthenticated"
                  element={
                    <NavigationAndFooterWrapper>
                      <Main id="main">
                        <h1>Puuttuvat tunnukset</h1>
                      </Main>
                    </NavigationAndFooterWrapper>
                  }
                />
                <Route
                  path="/cookies"
                  element={
                    <NavigationAndFooterWrapper>
                      <Main id="main">
                        <CookieManagement />
                      </Main>
                    </NavigationAndFooterWrapper>
                  }
                />
                <Route
                  id="resource-route"
                  path="/resource/:id"
                  element={
                    <PermissionResolver>
                      <NavigationAndFooterWrapper>
                        <Main id="main">
                          <SelectedDatePeriodsProvider>
                            <ResourcePage
                              targetResourcesString={targetResourcesStr}
                            />
                          </SelectedDatePeriodsProvider>
                        </Main>
                      </NavigationAndFooterWrapper>
                    </PermissionResolver>
                  }
                />
                <Route
                  id="resource-route-child"
                  path="/resource/:id/child/:childId"
                  element={
                    <PermissionResolver>
                      <NavigationAndFooterWrapper>
                        <Main id="main">
                          <SelectedDatePeriodsProvider>
                            <ResourcePage
                              targetResourcesString={targetResourcesStr}
                            />
                          </SelectedDatePeriodsProvider>
                        </Main>
                      </NavigationAndFooterWrapper>
                    </PermissionResolver>
                  }
                />
                <Route
                  id="resource-batch-update-route"
                  path="/resource/:id/batch"
                  element={
                    <PermissionResolver>
                      <NavigationAndFooterWrapper>
                        <Main id="main">
                          <SelectedDatePeriodsProvider>
                            <ResourceBatchUpdatePage
                              targetResourcesString={targetResourcesStr}
                            />
                          </SelectedDatePeriodsProvider>
                        </Main>
                      </NavigationAndFooterWrapper>
                    </PermissionResolver>
                  }
                />
                <Route
                  id="resource-past-opening-hours-route"
                  path="/resource/:id/past"
                  element={
                    <PermissionResolver>
                      <NavigationAndFooterWrapper>
                        <Main id="main">
                          <SelectedDatePeriodsProvider>
                            <ResourcePastOpeningHoursPage />
                          </SelectedDatePeriodsProvider>
                        </Main>
                      </NavigationAndFooterWrapper>
                    </PermissionResolver>
                  }
                />
                <Route
                  id="resource-past-opening-hours-route-child"
                  path="/resource/:parentId/child/:id/past"
                  element={
                    <PermissionResolver>
                      <NavigationAndFooterWrapper>
                        <Main id="main">
                          <SelectedDatePeriodsProvider>
                            <ResourcePastOpeningHoursPage />
                          </SelectedDatePeriodsProvider>
                        </Main>
                      </NavigationAndFooterWrapper>
                    </PermissionResolver>
                  }
                />
                <Route
                  id="create-new-opening-period-route-child"
                  path="/resource/:parentId/child/:id/period/new"
                  element={
                    <PermissionResolver>
                      <HaukiHeader />
                      <Main id="main">
                        <AddNormalOpeningHoursPage />
                      </Main>
                    </PermissionResolver>
                  }
                />
                <Route
                  id="create-new-opening-period-route"
                  path="/resource/:id/period/new"
                  element={
                    <PermissionResolver>
                      <HaukiHeader />
                      <Main id="main">
                        <AddNormalOpeningHoursPage />
                      </Main>
                    </PermissionResolver>
                  }
                />
                <Route
                  id="edit-opening-period-route-child"
                  path="/resource/:parentId/child/:id/period/:datePeriodId"
                  element={
                    <PermissionResolver>
                      <HaukiHeader />
                      <Main id="main">
                        <EditNormalOpeningHoursPage />
                      </Main>
                    </PermissionResolver>
                  }
                />
                <Route
                  id="edit-opening-period-route"
                  path="/resource/:id/period/:datePeriodId"
                  element={
                    <PermissionResolver>
                      <HaukiHeader />
                      <Main id="main">
                        <EditNormalOpeningHoursPage />
                      </Main>
                    </PermissionResolver>
                  }
                />
                <Route
                  id="edit-holidays-route-child"
                  path="/resource/:parentId/child/:id/holidays"
                  element={
                    <PermissionResolver>
                      <HaukiHeader />
                      <Main id="main">
                        <EditHolidaysPage />
                      </Main>
                    </PermissionResolver>
                  }
                />
                <Route
                  id="edit-holidays-route"
                  path="/resource/:id/holidays"
                  element={
                    <PermissionResolver>
                      <HaukiHeader />
                      <Main id="main">
                        <EditHolidaysPage />
                      </Main>
                    </PermissionResolver>
                  }
                />
                <Route
                  id="add-exception-route-child"
                  path="/resource/:parentId/child/:id/exception/new"
                  element={
                    <PermissionResolver>
                      <HaukiHeader />
                      <Main id="main">
                        <AddExceptionOpeningHoursPage />
                      </Main>
                    </PermissionResolver>
                  }
                />
                <Route
                  id="add-exception-route"
                  path="/resource/:id/exception/new/"
                  element={
                    <PermissionResolver>
                      <HaukiHeader />
                      <Main id="main">
                        <AddExceptionOpeningHoursPage />
                      </Main>
                    </PermissionResolver>
                  }
                />
                <Route
                  id="edit-exception-route-child"
                  path="/resource/:parentId/child/:id/exception/:datePeriodId"
                  element={
                    <PermissionResolver>
                      <HaukiHeader />
                      <Main id="main">
                        <EditExceptionOpeningHoursPage />
                      </Main>
                    </PermissionResolver>
                  }
                />
                <Route
                  id="edit-exception-route"
                  path="/resource/:id/exception/:datePeriodId"
                  element={
                    <PermissionResolver>
                      <HaukiHeader />
                      <Main id="main">
                        <EditExceptionOpeningHoursPage />
                      </Main>
                    </PermissionResolver>
                  }
                />
              </Routes>
            </Router>
          </AuthContext.Provider>
        </MatomoContext.Provider>
      </AppContext.Provider>
    </div>
  );
};

export default App;
