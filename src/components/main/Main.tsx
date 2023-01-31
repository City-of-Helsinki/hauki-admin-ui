import React, { ReactNode } from 'react';
import './Main.scss';

type MainProps = {
  id: string;
  children: ReactNode;
};

export function MainContainer({ children }: Partial<MainProps>): JSX.Element {
  return <div className="main-container">{children}</div>;
}

const Main = ({ id, children }: MainProps): JSX.Element => (
  <main id={id} className="main">
    <MainContainer>{children}</MainContainer>
  </main>
);

export default Main;
