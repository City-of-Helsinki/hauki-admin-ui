import React, { ReactNode, useEffect } from 'react';
import './Main.scss';
import { useCookies } from 'hds-react';
import { useLocation } from 'react-router-dom';
import useMatomo from '../matomo/hooks/useMatomo';

type MainProps = {
  id: string;
  children: ReactNode;
};

export function MainContainer({ children }: Partial<MainProps>): JSX.Element {
  return <div className="main-container">{children}</div>;
}

const Main = ({ id, children }: MainProps): JSX.Element => {
  const location = useLocation();
  const { getAllConsents } = useCookies();
  const { trackPageView } = useMatomo();

  useEffect(() => {
    if (getAllConsents().matomo) {
      trackPageView({
        href: window.location.href,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllConsents, location.pathname, location.search]);

  return (
    <main id={id} className="main">
      <MainContainer>{children}</MainContainer>
    </main>
  );
};

export default Main;
