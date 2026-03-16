import {
  Button as HDSButton,
  ButtonPresetTheme,
  ButtonSize,
  ButtonVariant as HDSButtonVariant,
  LoadingSpinner,
} from 'hds-react';
import React from 'react';
import './Button.scss';

type ButtonTypeVariant = 'button' | 'submit' | 'reset' | undefined;

interface ButtonProps {
  children: string;
  onClick?: () => void;
  dataTest?: string;
  className?: string;
  type?: ButtonTypeVariant;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  size?: 'small' | 'medium';
  'aria-expanded'?: boolean;
  style?: React.CSSProperties;
}

type SecondaryButtonProps = ButtonProps & {
  light?: boolean;
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
      iconStart,
      iconEnd,
      isLoading,
      loadingText,
      light = false,
      size,
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
        theme={light ? undefined : ButtonPresetTheme.Coat}
        size={size as ButtonSize}
        data-testid={dataTest}
        disabled={disabled || isLoading}
        variant={
          isLoading ? HDSButtonVariant.Clear : HDSButtonVariant.Secondary
        }
        onClick={onClick}
        type={type}
        iconStart={isLoading ? <LoadingSpinner small /> : iconStart}
        iconEnd={iconEnd}
        style={{ cursor: isLoading ? 'wait' : undefined, ...style }}>
        {isLoading && loadingText ? loadingText : children}
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
      iconStart,
      iconEnd,
      disabled,
      isLoading,
      loadingText,
      size,
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
        className={[
          'button-common',
          'primary-button',
          disabled ? 'primary-button--is-disabled' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        variant={isLoading ? HDSButtonVariant.Clear : HDSButtonVariant.Primary}
        onClick={onClick}
        type={type}
        iconStart={isLoading ? <LoadingSpinner small /> : iconStart}
        iconEnd={iconEnd}
        disabled={disabled || isLoading}
        size={size as ButtonSize}
        style={{ cursor: isLoading ? 'wait' : undefined, ...style }}>
        {isLoading && loadingText ? loadingText : children}
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
      iconStart,
      iconEnd,
      isLoading,
      loadingText,
      size,
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
        variant={
          isLoading ? HDSButtonVariant.Clear : HDSButtonVariant.Supplementary
        }
        onClick={onClick}
        iconStart={isLoading ? <LoadingSpinner small /> : iconStart}
        iconEnd={iconEnd}
        disabled={disabled || isLoading}
        size={size as ButtonSize}
        style={{ cursor: isLoading ? 'wait' : undefined, ...style }}>
        {isLoading && loadingText ? loadingText : children}
      </HDSButton>
    );
  }
);
