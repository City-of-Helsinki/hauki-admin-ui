import {
  IconAngleDown,
  IconAngleUp,
  IconMenuDots,
  IconPenLine,
  IconTrash,
  StatusLabel,
  useAccordion,
} from 'hds-react';
import React, { ReactNode, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmationModal, useModal } from '../modal/ConfirmationModal';
import toast from '../notification/Toast';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import useMobile from '../../hooks/useMobile';

type DeleteModalTextProps = {
  dateRange?: ReactNode | null;
  periodName?: string | null;
};

const DeleteModalText = ({
  dateRange,
  periodName,
}: DeleteModalTextProps): JSX.Element => (
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

type AccordionIconProps = {
  isOpen: boolean;
};

const AccordionIcon = ({ isOpen }: AccordionIconProps): JSX.Element =>
  isOpen ? <IconAngleUp aria-hidden /> : <IconAngleDown aria-hidden />;

type OpeningPeriodActionsMenuProps = {
  editUrl?: string;
  onDelete?: () => void;
  periodName?: string | null;
};

const OpeningPeriodActionsMenu = React.forwardRef<
  HTMLButtonElement,
  OpeningPeriodActionsMenuProps
>(({ onDelete, editUrl, periodName }, deleteRef) => {
  const { buttonProps, isOpen, closeAccordion } = useAccordion({
    initiallyOpen: false,
  });
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(actionsMenuRef, closeAccordion);

  return (
    <div ref={actionsMenuRef} className="opening-period-actions-menu">
      <button
        ref={deleteRef}
        className="button-icon opening-period-actions-menu-toggle"
        type="button"
        {...buttonProps}>
        <IconMenuDots aria-hidden="true" />
        <span className="hiddenFromScreen">{`Avaa ${
          periodName || 'nimetön'
        } aukiolojakson muokkaa ja poista valikko`}</span>
      </button>
      {isOpen && (
        <div className="opening-period-actions-menu-items">
          {editUrl && (
            <Link className="opening-period-actions-menu-item" to={editUrl}>
              Muokkaa
              <span className="hiddenFromScreen">{`Muokkaa ${
                periodName || 'nimettömän'
              } aukiolojakson tietoja`}</span>
            </Link>
          )}
          {onDelete && (
            <button
              className="opening-period-actions-menu-item"
              onClick={() => {
                closeAccordion();
                onDelete();
              }}
              type="button">
              Poista
              <span className="hiddenFromScreen">{`Poista ${
                periodName || 'nimetön'
              } aukiolojakso`}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
});

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
  const { isModalOpen, openModal, closeModal } = useModal();
  const { buttonProps, isOpen } = useAccordion({
    initiallyOpen,
  });
  const [isDeleting, setDeleting] = useState(false);
  const deleteRef = useRef<HTMLButtonElement>(null);
  const dataTestPostFix = id ? `-${id}` : '';
  const isMobile = useMobile();

  return (
    <div
      className="opening-period"
      data-test={`openingPeriod${dataTestPostFix}`}>
      <div className="opening-period-header">
        <h3 className="opening-period-title opening-period-header-column">
          {periodName}
        </h3>
        <div className="opening-period-dates opening-period-header-column">
          {dateRange}
          {isActive && (
            <StatusLabel
              className="opening-period-active"
              aria-label="Voimassa nyt"
              type="info">
              Voimassa nyt
            </StatusLabel>
          )}
        </div>
        <div className="opening-period-actions opening-period-header-column">
          {!isMobile && (
            <>
              {editUrl && (
                <Link
                  className="button-icon opening-period-action-edit"
                  data-test={`openingPeriodEditLink${dataTestPostFix}`}
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
                  className="button-icon opening-period-action-delete"
                  data-test={`openingPeriodDeleteLink${dataTestPostFix}`}
                  type="button"
                  onClick={openModal}>
                  <IconTrash aria-hidden="true" />
                  <span className="hiddenFromScreen">{`Poista ${
                    periodName || 'nimetön'
                  } aukiolojakso`}</span>
                </button>
              )}
            </>
          )}
          {isMobile && (editUrl || onDelete) && (
            <OpeningPeriodActionsMenu
              ref={deleteRef}
              editUrl={editUrl}
              onDelete={() => {
                openModal();
              }}
              periodName={periodName}
            />
          )}
          <button
            className="button-icon"
            data-test={`openingPeriodAccordionButton${dataTestPostFix}`}
            type="button"
            {...buttonProps}>
            <AccordionIcon isOpen={isOpen} />
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
                  label: `Aukiolo "${periodName}" poistettu onnistuneesti.`,
                  dataTestId: 'date-period-delete-success',
                });
              } catch (_) {
                toast.error({
                  label:
                    'Aukiolon poisto epäonnistui. Yritä myöhemmin uudelleen.',
                });
              }
            }
          }}
          isLoading={isDeleting}
          loadingText="Poistetaan aukiolojaksoa"
          title={deleteModalTitle}
          text={
            <DeleteModalText periodName={periodName} dateRange={dateRange} />
          }
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
