// Based on https://github.com/City-of-Helsinki/palvelutarjotin-admin/blob/release-0.1.0/src/common/components/textInput/InputWrapper.tsx

import { Tooltip } from 'hds-react';
import React, { CSSProperties, FC, ReactNode } from 'react';

import './InputWrapper.scss';

export type InputWrapperProps = {
  children?: ReactNode;
  className?: string;
  hasIcon?: boolean;
  helperText?: string;
  hideLabel?: boolean;
  id: string;
  invalid?: boolean;
  labelId?: string;
  labelText?: string;
  style?: CSSProperties;
  tooltipLabel?: string;
  tooltipText?: string;
  tooltipOpenButtonLabelText?: string;
  tooltipCloseButtonLabelText?: string;
  required?: boolean;
};

const InputWrapper: FC<InputWrapperProps> = React.forwardRef<
  HTMLDivElement,
  InputWrapperProps
>(
  (
    {
      children,
      className = '',
      hasIcon = false,
      helperText,
      hideLabel = false,
      id,
      invalid = false,
      labelId,
      labelText,
      style,
      tooltipLabel,
      tooltipText,
      tooltipOpenButtonLabelText,
      required,
    },
    ref
  ) => (
    <div
      className={`root hds-text-input ${hasIcon ? 'hasIcon' : ''} ${
        invalid ? 'hds-text-input--invalid' : ''
      } ${className}`}
      ref={ref}
      style={style}>
      {labelText && (
        <label
          id={labelId}
          htmlFor={id}
          className={`hds-text-input__label ${
            hideLabel ? 'hiddenFromScreen' : ''
          }`}>
          {labelText}
          {required && <span className="requiredIndicator">*</span>}
        </label>
      )}
      {tooltipText && (
        <Tooltip
          tooltipLabel={tooltipLabel || ''}
          buttonLabel={tooltipOpenButtonLabelText || ''}>
          {tooltipText}
        </Tooltip>
      )}
      <div className="hds-text-input__input-wrapper inputWrapper">
        {children}
      </div>
      {helperText && (
        <div className="hds-text-input__helper-text">{helperText}</div>
      )}
    </div>
  )
);

export default InputWrapper;
