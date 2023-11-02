import React, { ReactNode, useState } from 'react';
import { Dialog, IconInfoCircle } from 'hds-react';
import { PrimaryButton } from '../button/Button';

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

export function NotificationModal({
  buttonText,
  isLoading,
  loadingText,
  isOpen,
  onClose,
  text,
  title,
}: {
  buttonText: string;
  isLoading?: boolean;
  loadingText?: string;
  isOpen: boolean;
  onClose: () => void;
  text: string | ReactNode;
  title: string;
}): JSX.Element | null {
  const titleId = 'notification-modal-title';

  return (
    <Dialog aria-labelledby={titleId} id="notification-modal" isOpen={isOpen}>
      <Dialog.Header
        id={titleId}
        title={title}
        iconLeft={<IconInfoCircle aria-hidden="true" />}
      />
      <Dialog.Content>{text}</Dialog.Content>
      <Dialog.ActionButtons>
        <PrimaryButton
          isLoading={isLoading}
          loadingText={loadingText}
          onClick={onClose}>
          {buttonText}
        </PrimaryButton>
      </Dialog.ActionButtons>
    </Dialog>
  );
}
