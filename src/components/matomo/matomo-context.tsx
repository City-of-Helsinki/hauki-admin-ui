import React, { createContext, type JSX } from 'react';
import { MatomoTrackerInstance } from './types';

export type MatomoProviderProps = {
  children?: React.ReactNode;
  value: MatomoTrackerInstance;
};

const MatomoContext = createContext<MatomoTrackerInstance | null>(null);

export const MatomoProvider = ({
  children,
  value,
}: MatomoProviderProps): JSX.Element => {
  const Context = MatomoContext;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default MatomoContext;
