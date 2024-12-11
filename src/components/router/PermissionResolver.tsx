import React, { ReactNode, useEffect, useState } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { AuthContextProps, useAuth } from '../../auth/auth-context';
import api from '../../common/utils/api/api';
import Main from '../main/Main';

const PermissionResolver = ({
  children,
}: {
  children?: ReactNode;
}): JSX.Element => {
  const { authTokens, clearAuth }: Partial<AuthContextProps> = useAuth();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{
    id?: string;
    childId?: string;
    datePeriodId?: string;
  }>();

  const isAuthenticated = !!authTokens;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    if (!id || !isAuthenticated) {
      setIsLoading(false);
    } else {
      api
        .testResourcePostPermission(id)
        .then((hasPermission: boolean) => {
          setIsAuthorized(hasPermission);
          setIsLoading(false);
        })
        .catch((e) => {
          if (clearAuth) {
            clearAuth();
          }
          if (e.response?.status === 404) {
            return navigate(`/not_found?original_request=${pathname}${search}`);
          }
          return setIsLoading(false);
        });
    }
  }, [clearAuth, navigate, id, isAuthenticated, pathname, search]);

  if (isLoading) {
    return (
      <Main id="main">
        <h1>Sivua alustetaan..</h1>
      </Main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={{ pathname: '/unauthenticated', search }} replace />;
  }

  if (!isAuthorized) {
    return <Navigate to={{ pathname: '/unauthorized', search }} replace />;
  }

  return <>{children}</>;
};

export default PermissionResolver;
