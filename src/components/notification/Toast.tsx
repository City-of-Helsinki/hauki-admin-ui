import React from 'react';
import {
  Notification,
  NotificationPosition,
  NotificationType,
} from 'hds-react';
import ReactDOM from 'react-dom';
import i18n from '../../i18n';

type ToastProps = {
  label: string;
  text?: string;
  onClose?: () => void;
  dataTestId?: string;
  dismissible?: boolean;
};

const removeContainer = (container: HTMLDivElement): void => {
  setTimeout(() => {
    if (container && container.parentElement) {
      container.parentElement.removeChild(container);
    }
  }, 1000);
};

const renderToast = ({
  type,
  label,
  text,
  onClose,
  dataTestId,
  position = 'top-right',
  dismissible = false,
}: ToastProps & {
  position?: NotificationPosition;
  type: NotificationType;
}): void => {
  const containerDomNode = document.createElement('div');
  document.body.appendChild(containerDomNode);

  ReactDOM.render(
    <Notification
      position={position}
      displayAutoCloseProgress={false}
      autoClose={!dismissible}
      dismissible={dismissible}
      label={label}
      type={type}
      onClose={(): void => {
        if (onClose) {
          onClose();
        }
        removeContainer(containerDomNode);
      }}
      closeButtonLabelText={i18n.t('Common.CloseNotification')}
      {...(dataTestId ? { dataTestId } : {})}>
      {text}
    </Notification>,
    containerDomNode
  );
};

const successToast = ({
  label,
  text,
  dataTestId,
  onClose,
  position,
}: {
  label: string;
  text?: string;
  dataTestId?: string;
  onClose?: () => void;
  position?: NotificationPosition;
}): void =>
  renderToast({ type: 'success', label, text, onClose, dataTestId, position });

const errorToast = ({
  label,
  text,
  dataTestId,
  onClose,
  position,
  dismissible,
}: {
  label: string;
  dataTestId?: string;
  onClose?: () => void;
  position?: NotificationPosition;
  text?: string;
  dismissible?: boolean;
}): void =>
  renderToast({
    type: 'error',
    label,
    text,
    onClose,
    dataTestId,
    position,
    dismissible,
  });

const infoToast = ({
  label,
  text,
  dataTestId,
  onClose,
  position,
}: {
  label: string;
  text?: string;
  dataTestId?: string;
  onClose?: () => void;
  position?: NotificationPosition;
}): void =>
  renderToast({ type: 'info', label, text, onClose, dataTestId, position });

export default {
  success: successToast,
  error: errorToast,
  info: infoToast,
};
