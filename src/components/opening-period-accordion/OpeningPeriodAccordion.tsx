import {
  Checkbox,
  IconAngleDown,
  IconAngleUp,
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconMenuDots,
  IconPenLine,
  IconTrash,
  StatusLabel,
  useAccordion,
} from 'hds-react';
import React, { ReactNode, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DatePeriod } from '../../common/lib/types';
import { ConfirmationModal, useModal } from '../modal/ConfirmationModal';
import toast from '../notification/Toast';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import useMobile from '../../hooks/useMobile';
import {
  DatePeriodSelectState,
  useSelectedDatePeriodsContext,
} from '../../common/selectedDatePeriodsContext/SelectedDatePeriodsContext';

type AccordionIconProps = {
  isOpen: boolean;
};

const AccordionIcon = ({ isOpen }: AccordionIconProps): JSX.Element =>
  isOpen ? <IconAngleUp aria-hidden /> : <IconAngleDown aria-hidden />;

type OpeningPeriodActionsMenuProps = {
  editUrl?: string;
  onCopy?: () => void;
  onDelete?: () => void;
  onMoveDown?: () => void;
  onMoveUp?: () => void;
  periodName?: string | null;
  showCopyOption?: boolean;
};

const OpeningPeriodActionsMenu = React.forwardRef<
  HTMLButtonElement,
  OpeningPeriodActionsMenuProps
>(
  (
    {
      onDelete,
      onCopy,
      editUrl,
      periodName,
      onMoveDown,
      onMoveUp,
      showCopyOption,
    },
    deleteRef
  ) => {
    const { buttonProps, isOpen, closeAccordion } = useAccordion({
      initiallyOpen: false,
    });
    const actionsMenuRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(actionsMenuRef, closeAccordion);
    const { t } = useTranslation();

    return (
      <div ref={actionsMenuRef} className="opening-period-actions-menu">
        <button
          ref={deleteRef}
          className="button-icon opening-period-actions-menu-toggle"
          type="button"
          {...buttonProps}>
          <IconMenuDots aria-hidden="true" />
          <span className="visually-hidden">
            {periodName
              ? t('ResourcePage.OpeningPeriodsSection.OpenPeriodEditMenu', {
                  periodName,
                })
              : t(
                  'ResourcePage.OpeningPeriodsSection.OpenUntitledPeriodEditMenu'
                )}
          </span>
        </button>
        {isOpen && (
          <div className="opening-period-actions-menu-items">
            {editUrl && (
              <Link className="opening-period-actions-menu-item" to={editUrl}>
                {t('ResourcePage.OpeningPeriodsSection.Modify')}
                <span className="visually-hidden">
                  {periodName
                    ? t('ResourcePage.OpeningPeriodsSection.ModifyPeriod', {
                        periodName,
                      })
                    : t(
                        'ResourcePage.OpeningPeriodsSection.ModifyUntitledPeriod'
                      )}
                </span>
              </Link>
            )}

            {onMoveUp && (
              <button
                className="opening-period-actions-menu-item"
                onClick={() => {
                  closeAccordion();
                  onMoveUp();
                }}
                type="button">
                {t('ResourcePage.OpeningPeriodsSection.MoveUp')}
              </button>
            )}

            {onMoveDown && (
              <button
                className="opening-period-actions-menu-item"
                onClick={() => {
                  closeAccordion();
                  onMoveDown();
                }}
                type="button">
                {t('ResourcePage.OpeningPeriodsSection.MoveDown')}
              </button>
            )}

            {showCopyOption && onCopy && (
              <button
                className="opening-period-actions-menu-item"
                type="button"
                onClick={() => {
                  closeAccordion();
                  onCopy();
                }}>
                {t('ResourcePastOpeningHoursPage.Main.SelectButton')}
              </button>
            )}

            {onDelete && (
              <button
                className="opening-period-actions-menu-item"
                onClick={() => {
                  closeAccordion();
                  onDelete();
                }}
                type="button">
                {t('ResourcePage.OpeningPeriodsSection.Remove')}
                <span className="visually-hidden">
                  {periodName
                    ? t('ResourcePage.OpeningPeriodsSection.RemovePeriod', {
                        periodName,
                      })
                    : t(
                        'ResourcePage.OpeningPeriodsSection.RemoveUntitledPeriod'
                      )}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

type Props = {
  children: ReactNode;
  dateRange: ReactNode;
  editUrl?: string;
  id?: string;
  toggleChecked?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  initiallyOpen?: boolean;
  isActive?: boolean;
  onDelete?: () => void | Promise<void>;
  onMoveDown?: () => void;
  onMoveUp?: () => void;
  periodName?: string | null;
  showCopyOption?: boolean;
  datePeriod?: DatePeriod;
};

const OpeningPeriodAccordion = ({
  children,
  dateRange,
  editUrl,
  id,
  initiallyOpen = false,
  isActive = false,
  onDelete,
  onMoveDown,
  onMoveUp,
  periodName,
  toggleChecked,
  checked,
  showCopyOption = false,
  datePeriod,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: resourceId, parentId } = useParams<{
    id: string;
    parentId?: string;
  }>();
  const deleteModalTitle = t(
    'ResourcePage.OpeningPeriodsSection.DeleteModalTitle'
  );
  const { isModalOpen, openModal, closeModal } = useModal();
  const {
    isModalOpen: isCopyModalOpen,
    openModal: openCopyModal,
    closeModal: closeCopyModal,
  } = useModal();
  const { buttonProps, isOpen } = useAccordion({
    initiallyOpen,
  });
  const [isDeleting, setDeleting] = useState(false);
  const deleteRef = useRef<HTMLButtonElement>(null);
  const dataTestPostFix = id ? `-${id}` : '';
  const isMobile = useMobile();
  const { datePeriodSelectState } = useSelectedDatePeriodsContext();

  return (
    <div
      className="opening-period"
      data-testid={`openingPeriod${dataTestPostFix}`}>
      <div className="opening-period-header">
        {toggleChecked !== undefined &&
          datePeriodSelectState === DatePeriodSelectState.ACTIVE && (
            <Checkbox
              id={`period-checkbox${dataTestPostFix}`}
              value={id}
              checked={checked}
              onChange={toggleChecked}
              className="opening-period-header-checkbox"
            />
          )}
        <h3 className="opening-period-title opening-period-header-column">
          {datePeriodSelectState === DatePeriodSelectState.ACTIVE ? (
            <label htmlFor={`period-checkbox${dataTestPostFix}`}>
              {periodName}
            </label>
          ) : (
            periodName
          )}
        </h3>
        <div className="opening-period-dates opening-period-header-column">
          {dateRange}
          {isActive && (
            <StatusLabel
              className="opening-period-active"
              aria-label={t(
                'ResourcePage.OpeningPeriodsSection.StatusLabelActive'
              )}
              type="info">
              {t('ResourcePage.OpeningPeriodsSection.StatusLabelActive')}
            </StatusLabel>
          )}
        </div>
        <div className="opening-period-actions opening-period-header-column">
          {!isMobile &&
            datePeriodSelectState !== DatePeriodSelectState.INACTIVE && (
              <>
                {(onMoveUp || onMoveDown) && datePeriod?.order != null && (
                  <span
                    className="opening-period-order"
                    data-testid={`openingPeriodOrder${dataTestPostFix}`}>
                    {datePeriod.order}
                  </span>
                )}
                {onMoveUp && (
                  <button
                    className="button-icon opening-period-action-move-up"
                    data-testid={`openingPeriodMoveUpButton${dataTestPostFix}`}
                    type="button"
                    onClick={onMoveUp}>
                    <IconArrowUp aria-hidden="true" />
                    <span className="visually-hidden">
                      {t('ResourcePage.OpeningPeriodsSection.MoveUp')}
                    </span>
                  </button>
                )}
                {onMoveDown && (
                  <button
                    className="button-icon opening-period-action-move-down"
                    data-testid={`openingPeriodMoveDownButton${dataTestPostFix}`}
                    type="button"
                    onClick={onMoveDown}>
                    <IconArrowDown aria-hidden="true" />
                    <span className="visually-hidden">
                      {t('ResourcePage.OpeningPeriodsSection.MoveDown')}
                    </span>
                  </button>
                )}
                {editUrl && (
                  <Link
                    className="button-icon opening-period-action-edit"
                    data-testid={`openingPeriodEditLink${dataTestPostFix}`}
                    to={editUrl}>
                    <IconPenLine aria-hidden="true" />
                    <span className="visually-hidden">
                      {periodName
                        ? t('ResourcePage.OpeningPeriodsSection.ModifyPeriod', {
                            periodName,
                          })
                        : t(
                            'ResourcePage.OpeningPeriodsSection.ModifyUntitledPeriod'
                          )}
                    </span>
                  </Link>
                )}
                {onDelete && (
                  <button
                    ref={deleteRef}
                    className="button-icon opening-period-action-delete"
                    data-testid={`openingPeriodDeleteLink${dataTestPostFix}`}
                    type="button"
                    onClick={openModal}>
                    <IconTrash aria-hidden="true" />
                    <span className="visually-hidden">
                      {periodName
                        ? t('ResourcePage.OpeningPeriodsSection.RemovePeriod', {
                            periodName,
                          })
                        : t(
                            'ResourcePage.OpeningPeriodsSection.RemoveUntitledPeriod'
                          )}
                    </span>
                  </button>
                )}
              </>
            )}
          {isMobile &&
            (editUrl || onDelete) &&
            datePeriodSelectState !== DatePeriodSelectState.INACTIVE && (
              <OpeningPeriodActionsMenu
                ref={deleteRef}
                editUrl={editUrl}
                onDelete={() => {
                  openModal();
                }}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                showCopyOption={showCopyOption && !!datePeriod && !!resourceId}
                onCopy={openCopyModal}
                periodName={periodName}
              />
            )}
          {showCopyOption && (
            <button
              className="button-icon opening-period-action-copy"
              data-testid={`openingPeriodCopyButton${dataTestPostFix}`}
              type="button"
              onClick={() => {
                if (!datePeriod || !resourceId) return;
                openCopyModal();
              }}>
              {t('ResourcePastOpeningHoursPage.Main.SelectButton')}
            </button>
          )}
          <button
            className="button-icon"
            data-testid={`openingPeriodAccordionButton${dataTestPostFix}`}
            type="button"
            {...buttonProps}>
            <AccordionIcon isOpen={isOpen} />
            <span className="visually-hidden">
              {periodName
                ? t('ResourcePage.OpeningPeriodsSection.ShowPediod', {
                    periodName,
                  })
                : t('ResourcePage.OpeningPeriodsSection.ShowUntitledPeriod')}
            </span>
          </button>
        </div>
        <ConfirmationModal
          onConfirm={() => {
            if (onDelete) {
              setDeleting(true);
              try {
                onDelete();
                setDeleting(false);
                toast.success({
                  label: t('ResourcePage.Notifications.PeriodRemoveSuccess', {
                    periodName,
                  }),
                  dataTestId: 'date-period-delete-success',
                });
              } catch (_) {
                toast.error({
                  label: t('ResourcePage.Notifications.PeriodRemoveFailed', {
                    periodName,
                  }),
                });
              }
            }
          }}
          isLoading={isDeleting}
          loadingText={t('ResourcePage.OpeningPeriodsSection.RemovingPeriod')}
          title={deleteModalTitle}
          text={
            <>
              <p>{t('ResourcePage.OpeningPeriodsSection.RemoveModalText')}</p>
              <p>
                <b>
                  {periodName}
                  <br />
                  {dateRange}
                </b>
              </p>
            </>
          }
          isOpen={isModalOpen}
          onClose={() => {
            closeModal();
            deleteRef.current?.focus();
          }}
          confirmText={t('ResourcePage.OpeningPeriodsSection.Remove')}
        />
        {showCopyOption && datePeriod && (
          <ConfirmationModal
            onConfirm={async (): Promise<void> => {
              // Build the path based on whether it's parent or child resource
              const basePath = parentId
                ? `/resource/${parentId}/child/${resourceId}`
                : `/resource/${resourceId}`;

              // Determine the target path based on period type
              const targetPath = datePeriod.override
                ? `${basePath}/exception/new`
                : `${basePath}/period/new`;

              // Navigate with the period data and return flag in state
              navigate(targetPath, {
                state: {
                  copyFrom: datePeriod,
                  returnToPastView: true,
                },
              });
            }}
            title={t('ResourcePastOpeningHoursPage.Main.CopyModalTitle')}
            text={
              <>
                <p>{t('ResourcePastOpeningHoursPage.Main.CopyModalText')}</p>
                <p>
                  {t(
                    'ResourcePastOpeningHoursPage.Main.CopyModalSelectedPeriod'
                  )}
                </p>
                <p>
                  <b>
                    {periodName}
                    <br />
                    {dateRange}
                  </b>
                </p>
              </>
            }
            isOpen={isCopyModalOpen}
            onClose={closeCopyModal}
            confirmIcon={<IconArrowRight aria-hidden />}
            confirmText={t(
              'ResourcePastOpeningHoursPage.Main.CopyModalConfirm'
            )}
          />
        )}
      </div>
      {isOpen && children}
    </div>
  );
};

export default OpeningPeriodAccordion;
