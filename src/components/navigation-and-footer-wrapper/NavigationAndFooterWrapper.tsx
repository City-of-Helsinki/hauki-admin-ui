import React from 'react';
import HaukiNavigation from '../navigation/HaukiNavigation';
import HaukiFooter from '../footer/HaukiFooter';

interface Props {
  children: React.ReactNode;
}

const NavigationAndFooterWrapper = ({ children }: Props): JSX.Element => (
  <>
    <HaukiNavigation />
    {children}
    <HaukiFooter />
  </>
);

export default NavigationAndFooterWrapper;
