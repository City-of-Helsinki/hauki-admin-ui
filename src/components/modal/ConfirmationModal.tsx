import React, { ReactNode, RefObject, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { IconAlertCircle, IconCross } from 'hds-react';
import { PrimaryButton, SecondaryButton } from '../button/Button';
import './ConfirmationModal.scss';

const ModalWrapper = ({
  id,
  ariaLabelledBy,
  children,
}: {
  id: string;
  ariaLabelledBy: string;
  children: ReactNode;
}): JSX.Element => (
  <div
    role="alertdialog"
    id={id}
    className="modal-wrapper"
    aria-labelledby={ariaLabelledBy}
    aria-modal="true">
    {children}
  </div>
);

type UseModalProps = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useModal = (): UseModalProps => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = (): void => setIsModalOpen(true);
  const closeModal = (): void => setIsModalOpen(false);
  return {
    isModalOpen,
    openModal,
    closeModal,
  };
};

export function ConfirmationModal({
  title,
  text,
  confirmText,
  onConfirm,
  isOpen,
  close,
}: {
  title: string;
  text: string | ReactNode;
  confirmText: string;
  onConfirm: () => void;
  isOpen: boolean;
  close: () => void;
}): JSX.Element | null {
  const titleId = 'confirmation-modal-title';
  const closeButtonRef: RefObject<HTMLButtonElement> = React.createRef();

  const onClose = (): void => {
    close();
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const onConfirmClick = (): void => {
    onConfirm();
    close();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-visible');
      document.addEventListener('keydown', onKeyDown, false);
      if (closeButtonRef.current) closeButtonRef.current.focus();
    }

    return (): void => {
      document.removeEventListener('keydown', onKeyDown, false);
      document.body.classList.remove('modal-visible');
    };
  });

  const Modal = (): JSX.Element => (
    <>
      <div className="modal-backdrop" />
      <ModalWrapper id="confirmation-modal" ariaLabelledBy={titleId}>
        <div className="modal">
          <div className="modal-header">
            <IconAlertCircle size="s" />
            <h2
              id={titleId}
              className="modal-title text-bold text-md"
              data-test="modalTitle">
              {title}
            </h2>
            <button
              ref={closeButtonRef}
              className="modal-close button-icon"
              type="button"
              onClick={(): void => close()}
              aria-label="Sulje ikkuna">
              <IconCross size="m" />
            </button>
          </div>
          <div className="modal-content">{text}</div>
          <div className="modal-actions confirm-modal-actions">
            <PrimaryButton
              onClick={(): void => onConfirmClick()}
              dataTest="modalConfirmButton">
              {confirmText}
            </PrimaryButton>
            <SecondaryButton onClick={(): void => onClose()}>
              Peruuta
            </SecondaryButton>
          </div>
        </div>
      </ModalWrapper>
    </>
  );

  return isOpen ? ReactDOM.createPortal(<Modal />, document.body) : null;
}
