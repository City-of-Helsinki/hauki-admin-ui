import React from 'react';
import HaukiHeader from '../header/HaukiHeader';
import HaukiFooter from '../footer/HaukiFooter';

interface Props {
  children: React.ReactNode;
}

const NavigationAndFooterWrapper = ({ children }: Props) => (
  <>
    <HaukiHeader />
    {children}
    <HaukiFooter />
  </>
);

export default NavigationAndFooterWrapper;
