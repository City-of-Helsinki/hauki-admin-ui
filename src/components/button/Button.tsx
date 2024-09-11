import {
  ButtonSize,
  Button as HDSButton,
  ButtonSize as HDSButtonSize,
} from 'hds-react';
import React, { ReactNode } from 'react';
import './Button.scss';

type ButtonTypeVariant = 'button' | 'submit' | 'reset' | undefined;

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  dataTest?: string;
  className?: string;
  type?: ButtonTypeVariant;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  size?: ButtonSize;
  'aria-expanded'?: boolean;
  style?: React.CSSProperties;
}

type SecondaryButtonProps = ButtonProps & {
  light?: boolean;
  size?: HDSButtonSize;
};

export const SecondaryButton = React.forwardRef<
  HTMLButtonElement,
  SecondaryButtonProps
>(
  (
    {
      children,
      dataTest,
      disabled,
      onClick,
      className = '',
      type = 'button',
      iconLeft,
      iconRight,
      isLoading,
      loadingText,
      light = false,
      size = 'default',
      'aria-expanded': ariaExpanded,
      style,
    }: SecondaryButtonProps,
    ref
  ): JSX.Element => {
    return (
      <HDSButton
        aria-expanded={ariaExpanded}
        ref={ref}
        className={`button-common ${
          light ? 'secondary-button-light' : 'secondary-button'
        } ${className}`}
        theme={light ? 'default' : 'coat'}
        size={size}
        data-testid={dataTest}
        disabled={disabled}
        variant="secondary"
        onClick={onClick}
        type={type}
        iconLeft={iconLeft}
        iconRight={iconRight}
        isLoading={isLoading}
        loadingText={loadingText}
        style={style}>
        {children}
      </HDSButton>
    );
  }
);

export const PrimaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      dataTest,
      onClick,
      className = '',
      type = 'button',
      iconLeft,
      iconRight,
      disabled,
      isLoading,
      loadingText,
      size = 'default',
      'aria-expanded': ariaExpanded,
      style,
    }: ButtonProps,
    ref
  ): JSX.Element => {
    return (
      <HDSButton
        aria-expanded={ariaExpanded}
        ref={ref}
        data-testid={dataTest}
        className={`button-common primary-button ${
          disabled && 'primary-button--is-disabled'
        } ${isLoading && 'primary-button--is-loading'} ${className}`}
        variant="primary"
        onClick={onClick}
        type={type}
        iconLeft={iconLeft}
        iconRight={iconRight}
        disabled={disabled}
        isLoading={isLoading}
        loadingText={loadingText}
        size={size}
        style={style}>
        {children}
      </HDSButton>
    );
  }
);

export const SupplementaryButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      children,
      dataTest,
      disabled,
      onClick,
      className = '',
      type = 'button',
      iconLeft,
      iconRight,
      isLoading,
      loadingText,
      size = 'default',
      'aria-expanded': ariaExpanded,
      style,
    },
    ref
  ): JSX.Element => {
    return (
      <HDSButton
        aria-expanded={ariaExpanded}
        ref={ref}
        type={type}
        data-testid={dataTest}
        className={`button-common supplementary-button ${className}`}
        variant="supplementary"
        onClick={onClick}
        iconLeft={iconLeft}
        iconRight={iconRight}
        isLoading={isLoading}
        loadingText={loadingText}
        disabled={disabled}
        size={size}
        style={style}>
        {children}
      </HDSButton>
    );
  }
);
