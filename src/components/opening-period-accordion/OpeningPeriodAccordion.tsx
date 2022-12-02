import {
  IconAngleDown,
  IconAngleUp,
  IconPenLine,
  IconTrash,
  StatusLabel,
  useAccordion,
} from 'hds-react';
import React, { ReactNode, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmationModal, useModal } from '../modal/ConfirmationModal';
import toast from '../notification/Toast';

type Props = {
  children: ReactNode;
  dateRange: ReactNode;
  editUrl?: string;
  id?: string;
  initiallyOpen?: boolean;
  isActive?: boolean;
  onDelete?: () => void | Promise<void>;
  periodName?: string | null;
};

const OpeningPeriodAccordion = ({
  children,
  dateRange,
  editUrl,
  id,
  initiallyOpen = false,
  isActive = false,
  onDelete,
  periodName,
}: Props): JSX.Element => {
  const deleteModalTitle = 'Oletko varma että haluat poistaa aukiolojakson?';
  const DeleteModalText = (): JSX.Element => (
    <>
      <p>Olet poistamassa aukiolojakson</p>
      <p>
        <b>
          {periodName}
          <br />
          {dateRange}
        </b>
      </p>
    </>
  );
  const { isModalOpen, openModal, closeModal } = useModal();
  const { buttonProps, isOpen } = useAccordion({
    initiallyOpen,
  });
  const [isDeleting, setDeleting] = useState(false);
  const deleteRef = useRef<HTMLButtonElement>(null);
  const AccordionIcon = (): JSX.Element =>
    isOpen ? <IconAngleUp aria-hidden /> : <IconAngleDown aria-hidden />;

  return (
    <div
      className="opening-period"
      data-test={`openingPeriod${id ? `-${id}` : ''}`}>
      <div className="opening-period-header">
        <div className="opening-period-title opening-period-header-column">
          <h3>{periodName}</h3>
        </div>
        <div className="opening-period-dates opening-period-header-column">
          {dateRange}
          {isActive && (
            <StatusLabel className="opening-period-dates-status" type="info">
              Voimassa nyt
            </StatusLabel>
          )}
        </div>
        <div className="opening-period-actions opening-period-header-column">
          <div>
            {editUrl && (
              <Link
                className="opening-period-edit-link button-icon"
                data-test={`openingPeriodEditLink${id ? `-${id}` : ''}`}
                to={editUrl}>
                <IconPenLine aria-hidden="true" />
                <span className="hiddenFromScreen">{`Muokkaa ${
                  periodName || 'nimettömän'
                } aukiolojakson tietoja`}</span>
              </Link>
            )}
            {onDelete && (
              <button
                ref={deleteRef}
                className="button-icon"
                data-test={`openingPeriodDeleteLink${id ? `-${id}` : ''}`}
                type="button"
                onClick={openModal}>
                <IconTrash aria-hidden="true" />
                <span className="hiddenFromScreen">{`Poista ${
                  periodName || 'nimetön'
                } aukiolojakso`}</span>
              </button>
            )}
          </div>
          <button
            className="button-icon"
            data-test={`openingPeriodAccordionButton${id ? `-${id}` : ''}`}
            type="button"
            {...buttonProps}>
            <AccordionIcon aria-hidden="true" />
            <span className="hiddenFromScreen">{`Näytä ${
              periodName || 'nimetön'
            }`}</span>
          </button>
        </div>
        <ConfirmationModal
          onConfirm={async (): Promise<void> => {
            if (onDelete) {
              setDeleting(true);
              try {
                await onDelete();
                setDeleting(false);
                toast.success({
                  text: `Aukiolo "${periodName}" poistettu onnistuneesti.`,
                  dataTestId: 'date-period-delete-success',
                });
              } catch (_) {
                toast.error({
                  text:
                    'Aukiolon poisto epäonnistui. Yritä myöhemmin uudelleen.',
                });
              }
            }
          }}
          isLoading={isDeleting}
          loadingText="Poistetaan aukiolojaksoa"
          title={deleteModalTitle}
          text={<DeleteModalText />}
          isOpen={isModalOpen}
          onClose={() => {
            closeModal();
            deleteRef.current?.focus();
          }}
          confirmText="Poista"
        />
      </div>
      {isOpen && children}
    </div>
  );
};

export default OpeningPeriodAccordion;
