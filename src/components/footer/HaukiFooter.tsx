import React from 'react';
import { Footer, logoFi, Logo } from 'hds-react';
import './HaukiFooter.scss';

const HaukiFooter = (): JSX.Element => (
  <>
    <div className="footer-top-padding" />
    <Footer
      className="page-footer"
      title="Aukiolot"
      theme={{
        '--footer-background': 'var(--hauki-footer-background-color)',
      }}>
      <Footer.Base
        copyrightHolder="Helsingin Kaupunki"
        logo={<Logo src={logoFi} size="medium" alt="Helsingin kaupunki" />}
        backToTopLabel="Takaisin ylös">
        <Footer.Link
          href="https://kaupunkialustana.hel.fi/aukiolosovelluksen-saavutettavuusseloste/"
          target="_blank"
          label="Saavutettavuusseloste"
        />
        <Footer.Link
          href="/content-license.txt"
          target="_blank"
          label="Sisältölisenssi CC BY 4.0"
        />
      </Footer.Base>
    </Footer>
  </>
);

export default HaukiFooter;
