import React from 'react';
import { Footer, logoFi, logoSv, Logo } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../App-context';
import './HaukiFooter.scss';

const HaukiFooter = (): JSX.Element => {
  const { language } = useAppContext();
  const { t } = useTranslation();

  return (
    <>
      <div className="footer-top-padding" />
      <Footer
        className="page-footer"
        title="Aukiolot"
        theme={{
          '--footer-background': 'var(--hauki-footer-background-color)',
        }}>
        <Footer.Base
          copyrightHolder={t('Footer.CopyrightHolder')}
          copyrightText={t('Footer.CopyrightText')}
          logo={
            <Logo
              src={language === 'sv' ? logoSv : logoFi}
              size="medium"
              alt={t('Footer.LogoAlt')}
            />
          }
          backToTopLabel={t('Footer.BackToTopLabel')}>
          <Footer.Link
            href={t('Footer.AccessibilityStatementLinkUrl')}
            target="_blank"
            label={t('Footer.AccessibilityStatementLink')}
          />
          <Footer.Link
            href="/content-license.txt"
            target="_blank"
            label={t('Footer.ContentLicenseLink')}
          />
          <Footer.Link href="/cookies" label={t('Footer.CookiesLink')} />
        </Footer.Base>
      </Footer>
    </>
  );
};

export default HaukiFooter;
