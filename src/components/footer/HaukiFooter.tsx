import React from 'react';
import { Footer } from 'hds-react';
import './HaukiFooter.scss';

export default function HaukiFooter(): JSX.Element {
  return (
    <>
      <div className="footer-top-padding" />
      <Footer
        className="page-footer"
        title="Aukiolot"
        theme={{
          '--footer-background': 'var(--color-coat-of-arms-blue-light-20)',
        }}>
        <Footer.Base>
          <Footer.Item
            href="/content-license.txt"
            target="_blank"
            label="Sisältölisenssi CC BY 4.0"
          />
        </Footer.Base>
      </Footer>
    </>
  );
}
