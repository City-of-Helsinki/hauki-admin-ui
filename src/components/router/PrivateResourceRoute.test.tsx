import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
} from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import api from '../../common/utils/api/api';
import * as AuthContext from '../../auth/auth-context';
import PrivateResourceRoute from './PrivateResourceRoute';
import { AuthTokens } from '../../auth/auth-context';

const testTokens: AuthTokens = {
  hsa_username: 'admin@hel.fi',
  hsa_created_at: '2020-11-05',
  hsa_valid_until: '2020-11-12',
  hsa_resource: 'tprek:8100',
  hsa_organization: 'abcdefg',
  hsa_signature: '1234567',
  hsa_source: 'tprek',
  hsa_has_organization_rights: 'true',
};

const renderRoutesWithPrivateRoute = () => {
  window.history.pushState(
    {},
    'Test page',
    `/resource/${testTokens.hsa_resource}`
  );

  return render(
    <Router>
      <Route exact path="/not_found">
        <h1>Test not found</h1>
      </Route>
      <Route exact path="/unauthenticated">
        <h1>Test unauthenticated</h1>
      </Route>
      <Route exact path="/unauthorized">
        <h1>Test unauthorized</h1>
      </Route>
      <PrivateResourceRoute
        id="resource-route"
        exact
        path="/resource/:id"
        render={({ match }: RouteComponentProps<{ id?: string }>) => (
          <h1>{match.params.id}</h1>
        )}
      />
    </Router>
  );
};

const mockContext = (
  { tokens }: { tokens: Partial<AuthContext.AuthTokens> | undefined } = {
    tokens: testTokens,
  }
): void => {
  vi.spyOn(AuthContext, 'useAuth').mockImplementation(
    () =>
      ({
        authTokens: tokens,
        clearTokens: (): void => undefined,
      } as unknown as Partial<AuthContext.AuthContextProps>)
  );
};

const mockPermissionsApi = (hasPermission: boolean): void => {
  vi.spyOn(api, 'testResourcePostPermission').mockImplementation(() =>
    Promise.resolve(hasPermission)
  );
};

describe(`<PrivateResourceRoute />`, () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading indicator', async () => {
    mockContext();
    mockPermissionsApi(true);

    const { getByText } = renderRoutesWithPrivateRoute();

    expect(getByText('Sivua alustetaan..')).toBeInTheDocument();
  });

  it('should show content', async () => {
    mockContext();
    mockPermissionsApi(true);

    renderRoutesWithPrivateRoute();

    await waitFor(async () =>
      expect(
        await screen.findByText(testTokens.hsa_resource)
      ).toBeInTheDocument()
    );
  });

  it('should redirect to /unauthorized', async () => {
    mockContext();
    mockPermissionsApi(false);

    renderRoutesWithPrivateRoute();

    await waitFor(async () =>
      expect(await screen.findByText('Test unauthorized')).toBeInTheDocument()
    );
  });

  it('should redirect to /unauthenticated', async () => {
    mockContext({ tokens: undefined });
    mockPermissionsApi(false);

    renderRoutesWithPrivateRoute();

    await waitFor(async () =>
      expect(
        await screen.findByText('Test unauthenticated')
      ).toBeInTheDocument()
    );
  });

  it('should redirect to /not_found', async () => {
    mockContext();

    const resourceNotFoundError = {
      response: {
        status: 404,
      },
    };

    vi.spyOn(api, 'testResourcePostPermission').mockImplementation(() =>
      Promise.reject(resourceNotFoundError)
    );

    renderRoutesWithPrivateRoute();

    await waitFor(async () =>
      expect(await screen.findByText('Test not found')).toBeInTheDocument()
    );
  });
});
