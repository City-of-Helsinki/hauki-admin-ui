import { Button as HDSButton } from 'hds-react';
import React, { ReactNode } from 'react';
import './Button.scss';

type ButtonVariant = 'primary' | 'secondary';
type ButtonTypeVariant = 'button' | 'submit' | 'reset' | undefined;

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  dataTest?: string;
  className?: string;
  type?: ButtonTypeVariant;
}

export function SecondaryButton({
  children,
  dataTest,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps): JSX.Element {
  return (
    <HDSButton
      data-test={dataTest}
      className={`button-common secondary-button ${className}`}
      variant="secondary"
      onClick={onClick}
      type={type}>
      {children}
    </HDSButton>
  );
}

export function PrimaryButton({
  children,
  dataTest,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps): JSX.Element {
  return (
    <HDSButton
      data-test={dataTest}
      className={`button-common primary-button ${className}`}
      variant="primary"
      onClick={onClick}
      type={type}>
      {children}
    </HDSButton>
  );
}
