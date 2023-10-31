import React from 'react';
import HaukiHeader from '../header/HaukiHeader';
import HaukiFooter from '../footer/HaukiFooter';

interface Props {
  children: React.ReactNode;
}

const NavigationAndFooterWrapper = ({ children }: Props): JSX.Element => (
  <>
    <HaukiHeader />
    {children}
    <HaukiFooter />
  </>
);

export default NavigationAndFooterWrapper;
