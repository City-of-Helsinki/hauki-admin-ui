import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, IconQuestionCircle } from 'hds-react';
import { PrimaryButton, SecondaryButton } from '../button/Button';

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
  confirmText,
  isLoading,
  loadingText,
  isOpen,
  onClose,
  onConfirm,
  text,
  title,
}: {
  confirmText: string;
  isLoading?: boolean;
  loadingText?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  text: string | ReactNode;
  title: string;
}): JSX.Element | null {
  const { t } = useTranslation();
  const titleId = 'confirmation-modal-title';

  return (
    <Dialog aria-labelledby={titleId} id="confirmation-modal" isOpen={isOpen}>
      <Dialog.Header
        id={titleId}
        title={title}
        iconLeft={<IconQuestionCircle aria-hidden="true" />}
      />
      <Dialog.Content>{text}</Dialog.Content>
      <Dialog.ActionButtons>
        <PrimaryButton
          isLoading={isLoading}
          loadingText={loadingText}
          onClick={onConfirm}>
          {confirmText}
        </PrimaryButton>
        <SecondaryButton onClick={onClose}>
          {t('Common.Cancel')}
        </SecondaryButton>
      </Dialog.ActionButtons>
    </Dialog>
  );
}
