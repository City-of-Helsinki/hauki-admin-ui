import React, { useCallback, useMemo, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  RouteComponentProps,
} from 'react-router-dom';
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
import PrivateResourceRoute from './components/router/PrivateResourceRoute';
import ResourcePage from './pages/ResourcePage';
import ResourceBatchUpdatePage from './pages/ResourceBatchUpdatePage';
import AddNormalOpeningHoursPage from './pages/AddNormalOpeningHoursPage';
import EditNormalOpeningHoursPage from './pages/EditNormalOpeningHoursPage';
import EditHolidaysPage from './pages/EditHolidaysPage';
import AddExceptionOpeningHoursPage from './pages/AddExceptionOpeningHoursPage';
import EditExceptionOpeningHoursPage from './pages/EditExceptionOpeningHoursPage';
import { SelectedDatePeriodsProvider } from './common/selectedDatePeriodsContext/SelectedDatePeriodsContext';

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

  return (
    <div className="App">
      <AppContext.Provider value={appContextValue}>
        <AuthContext.Provider value={authContextValue}>
          <Router>
            <Switch>
              <Route exact path="/">
                <NavigationAndFooterWrapper>
                  <Main id="main">
                    <h1>Etusivu</h1>
                  </Main>
                </NavigationAndFooterWrapper>
              </Route>
              <Route exact path="/not_found">
                <NavigationAndFooterWrapper>
                  <Main id="main">
                    <h1>Kohdetta ei löydy</h1>
                    <p>
                      Kohdetta ei löytynyt. Yritä myöhemmin uudestaan. Ongelman
                      toistuessa ota yhteys sivuston ylläpitoon. Teidät on
                      automaattisesti kirjattu ulos.
                    </p>
                  </Main>
                </NavigationAndFooterWrapper>
              </Route>
              <Route exact path="/unauthorized">
                <NavigationAndFooterWrapper>
                  <Main id="main">
                    <h1>Puutteelliset tunnukset</h1>
                  </Main>
                </NavigationAndFooterWrapper>
              </Route>
              <Route exact path="/unauthenticated">
                <NavigationAndFooterWrapper>
                  <Main id="main">
                    <h1>Puuttuvat tunnukset</h1>
                  </Main>
                </NavigationAndFooterWrapper>
              </Route>
              <PrivateResourceRoute
                id="resource-route"
                exact
                path={['/resource/:id', '/resource/:id/child/:childId']}
                render={({
                  match,
                }: RouteComponentProps<{
                  id?: string;
                  childId?: string;
                }>) => {
                  const { id, childId } = match.params;

                  return (
                    id && (
                      <NavigationAndFooterWrapper>
                        <Main id="main">
                          <SelectedDatePeriodsProvider>
                            <ResourcePage
                              mainResourceId={id}
                              childId={childId}
                              targetResourcesString={targetResourcesStr}
                            />
                          </SelectedDatePeriodsProvider>
                        </Main>
                      </NavigationAndFooterWrapper>
                    )
                  );
                }}
              />
              <PrivateResourceRoute
                id="resource-batch-update-route"
                exact
                path={['/resource/:id/batch']}
                render={({
                  match,
                }: RouteComponentProps<{
                  id?: string;
                }>) => {
                  const { id } = match.params;

                  return (
                    id && (
                      <NavigationAndFooterWrapper>
                        <Main id="main">
                          <SelectedDatePeriodsProvider>
                            <ResourceBatchUpdatePage
                              mainResourceId={id}
                              targetResourcesString={targetResourcesStr}
                            />
                          </SelectedDatePeriodsProvider>
                        </Main>
                      </NavigationAndFooterWrapper>
                    )
                  );
                }}
              />
              <PrivateResourceRoute
                id="create-new-opening-period-route"
                exact
                path={[
                  '/resource/:parentId/child/:id/period/new/',
                  '/resource/:id/period/new',
                ]}
                render={({
                  match,
                }: RouteComponentProps<{
                  id?: string;
                }>) => {
                  const { id } = match.params;

                  return (
                    id && (
                      <>
                        <HaukiHeader />
                        <Main id="main">
                          <AddNormalOpeningHoursPage resourceId={id} />
                        </Main>
                      </>
                    )
                  );
                }}
              />
              <PrivateResourceRoute
                id="edit-opening-period-route"
                path={[
                  '/resource/:parentId/child/:id/period/:datePeriodId',
                  '/resource/:id/period/:datePeriodId',
                ]}
                render={({
                  match,
                }: RouteComponentProps<{
                  id?: string;
                  datePeriodId?: string;
                }>) => {
                  const { id, datePeriodId } = match.params;

                  return (
                    id &&
                    datePeriodId && (
                      <>
                        <HaukiHeader />
                        <Main id="main">
                          <EditNormalOpeningHoursPage
                            resourceId={id}
                            datePeriodId={datePeriodId}
                          />
                        </Main>
                      </>
                    )
                  );
                }}
              />
              <PrivateResourceRoute
                id="edit-holidays-route"
                path={[
                  '/resource/:parentId/child/:id/holidays',
                  '/resource/:id/holidays',
                ]}
                render={({
                  match,
                }: RouteComponentProps<{
                  id?: string;
                }>) => {
                  const { id } = match.params;

                  return (
                    id && (
                      <>
                        <HaukiHeader />
                        <Main id="main">
                          <EditHolidaysPage resourceId={id} />
                        </Main>
                      </>
                    )
                  );
                }}
              />
              <PrivateResourceRoute
                id="add-exception-route"
                path={[
                  '/resource/:parentId/child/:id/exception/new/',
                  '/resource/:id/exception/new/',
                ]}
                render={({
                  match,
                }: RouteComponentProps<{
                  id?: string;
                }>) => {
                  const { id } = match.params;

                  return (
                    id && (
                      <>
                        <HaukiHeader />
                        <Main id="main">
                          <AddExceptionOpeningHoursPage resourceId={id} />
                        </Main>
                      </>
                    )
                  );
                }}
              />
              <PrivateResourceRoute
                id="add-exception-route"
                path={[
                  '/resource/:parentId/child/:id/exception/:datePeriodId',
                  '/resource/:id/exception/:datePeriodId',
                ]}
                render={({
                  match,
                }: RouteComponentProps<{
                  id?: string;
                  datePeriodId?: string;
                }>) => {
                  const { id, datePeriodId } = match.params;

                  return (
                    id &&
                    datePeriodId && (
                      <>
                        <HaukiHeader />
                        <Main id="main">
                          <EditExceptionOpeningHoursPage
                            datePeriodId={datePeriodId}
                            resourceId={id}
                          />
                        </Main>
                      </>
                    )
                  );
                }}
              />
            </Switch>
          </Router>
        </AuthContext.Provider>
      </AppContext.Provider>
    </div>
  );
};

export default App;
