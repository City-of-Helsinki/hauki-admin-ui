import React from 'react';
import {
  Notification,
  NotificationPosition,
  NotificationType,
} from 'hds-react';
import ReactDOM from 'react-dom';

type ToastProps = {
  text: string;
  onClose?: () => void;
  dataTestId?: string;
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
  text,
  onClose,
  dataTestId,
  position = 'top-right',
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
      autoClose
      size="small"
      type={type}
      onClose={(): void => {
        if (onClose) {
          onClose();
        }
        removeContainer(containerDomNode);
      }}
      {...(dataTestId ? { dataTestId } : {})}>
      {text}
    </Notification>,
    containerDomNode
  );
};

const successToast = ({
  text,
  dataTestId,
  onClose,
  position,
}: {
  text: string;
  dataTestId?: string;
  onClose?: () => void;
  position?: NotificationPosition;
}): void =>
  renderToast({ type: 'success', text, onClose, dataTestId, position });

const errorToast = ({
  text,
  dataTestId,
  onClose,
  position,
}: {
  text: string;
  dataTestId?: string;
  onClose?: () => void;
  position?: NotificationPosition;
}): void => renderToast({ type: 'error', text, onClose, dataTestId, position });

const infoToast = ({
  text,
  dataTestId,
  onClose,
  position,
}: {
  text: string;
  dataTestId?: string;
  onClose?: () => void;
  position?: NotificationPosition;
}): void => renderToast({ type: 'info', text, onClose, dataTestId, position });

export default {
  success: successToast,
  error: errorToast,
  info: infoToast,
};
