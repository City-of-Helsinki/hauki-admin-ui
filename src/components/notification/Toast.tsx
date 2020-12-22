import React from 'react';
import { Notification, NotificationType } from 'hds-react';

type ToastProps = {
  label: string;
  text: string;
  onClose?: () => void;
  dataTestId?: string;
};

const Toast = ({
  label,
  text,
  onClose,
  type,
  dataTestId,
}: ToastProps & { type: NotificationType }): JSX.Element => (
  <Notification
    position="top-right"
    autoClose
    size="small"
    label={label}
    type={type}
    onClose={onClose}
    {...(dataTestId ? { dataTestId } : {})}>
    {text}
  </Notification>
);

export const SuccessToast = ({
  label,
  text,
  onClose,
  dataTestId,
}: ToastProps): JSX.Element => (
  <Toast
    label={label}
    text={text}
    onClose={onClose}
    type="success"
    dataTestId={dataTestId}
  />
);

export const ErrorToast = ({
  label,
  text,
  onClose,
  dataTestId,
}: ToastProps): JSX.Element => (
  <Toast
    label={label}
    text={text}
    onClose={onClose}
    type="error"
    dataTestId={dataTestId}
  />
);
