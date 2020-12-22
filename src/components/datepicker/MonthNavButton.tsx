// Based on: https://github.com/City-of-Helsinki/palvelutarjotin-admin/blob/release-0.1.0/src/common/components/datepicker/MonthNavButton.tsx
import React from 'react';
import './Datepicker.scss';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { dataTest?: string };

const MonthNavButton: React.FC<ButtonProps> = ({
  children,
  dataTest,
  onClick,
  ...props
}) => (
  <button
    data-test={dataTest}
    className="monthNavButton"
    type="button"
    onClick={onClick}
    {...props}>
    {children}
  </button>
);

export default MonthNavButton;
