import { ReactNode, useEffect } from 'react';
import './Main.scss';
import { useGroupConsent } from 'hds-react';
import { useLocation } from 'react-router-dom';
import useMatomo from '../matomo/hooks/useMatomo';
import { CookieConsentGroup } from '../cookie-consent/hooks/useCookieConsentSettings';

type MainProps = {
  id: string;
  children: ReactNode;
};

export function MainContainer({ children }: Partial<MainProps>): JSX.Element {
  return <div className="main-container">{children}</div>;
}

const Main = ({ id, children }: MainProps): JSX.Element => {
  const location = useLocation();
  const { trackPageView } = useMatomo();
  const statisticsConsent = useGroupConsent(CookieConsentGroup.STATISTICS);

  // Track page view
  useEffect(() => {
    if (statisticsConsent) {
      trackPageView({
        href: window.location.href,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statisticsConsent, location.pathname, location.search]);

  return (
    <main id={id} className="main">
      <MainContainer>{children}</MainContainer>
    </main>
  );
};

export default Main;
