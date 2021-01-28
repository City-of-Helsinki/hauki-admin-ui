import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconAngleDown,
  IconAngleUp,
  useAccordion,
  IconPenLine,
  IconTrash,
} from 'hds-react';
import {
  DatePeriod,
  Language,
  UiDatePeriodConfig,
} from '../../../common/lib/types';
import { formatDateRange } from '../../../common/utils/date-time/format';
import toast from '../../../components/notification/Toast';
import { displayLangVersionNotFound } from '../../../components/language-select/LanguageSelect';
import {
  ConfirmationModal,
  useModal,
} from '../../../components/modal/ConfirmationModal';
import './OpeningPeriod.scss';
import OpeningPeriodDetails from './OpeningPeriodDetails';

export default function OpeningPeriod({
  resourceId,
  datePeriod,
  datePeriodConfig,
  language,
  deletePeriod,
  initiallyOpen = false,
}: {
  resourceId: number;
  datePeriod: DatePeriod;
  datePeriodConfig: UiDatePeriodConfig;
  language: Language;
  deletePeriod: (id: number) => Promise<void>;
  initiallyOpen?: boolean;
}): JSX.Element {
  const datePeriodName = datePeriod.name[language];
  const formattedDateRange = formatDateRange({
    startDate: datePeriod.start_date,
    endDate: datePeriod.end_date,
  });
  const deleteModalTitle = 'Oletko varma että haluat poistaa aukiolojakson?';
  const DeleteModalText = (): JSX.Element => (
    <>
      <p>Olet poistamassa aukiolojakson</p>
      <p>
        <b>
          {datePeriodName}
          <br />
          {formattedDateRange}
        </b>
      </p>
    </>
  );
  const { isModalOpen, openModal, closeModal } = useModal();
  const { isOpen, toggleAccordion } = useAccordion({
    initiallyOpen,
  });
  const AccordionIcon = (): JSX.Element =>
    isOpen ? <IconAngleUp aria-hidden /> : <IconAngleDown aria-hidden />;

  return (
    <div
      className="opening-period"
      data-test={`openingPeriod-${datePeriod.id}`}>
      <div className="opening-period-header">
        <div className="opening-period-dates opening-period-header-column">
          <div>{formattedDateRange}</div>
        </div>
        <div className="opening-period-title opening-period-header-column">
          {datePeriodName ? (
            <h4>{datePeriodName}</h4>
          ) : (
            <h4 className="text-danger">
              {displayLangVersionNotFound({
                language,
                label: 'aukiolojakson nimi',
              })}
            </h4>
          )}
        </div>
        <div className="opening-period-actions opening-period-header-column">
          <Link
            className="opening-period-edit-link button-icon"
            data-test={`openingPeriodEditLink-${datePeriod.id}`}
            to={`/resource/${resourceId}/period/${datePeriod.id}`}>
            <IconPenLine aria-hidden="true" />
            <span className="sr-only">{`Muokkaa ${
              datePeriodName || 'nimettömän'
            } aukiolojakson tietoja`}</span>
          </Link>
          <button
            className="opening-period-delete-link button-icon"
            data-test={`openingPeriodDeleteLink-${datePeriod.id}`}
            type="button"
            onClick={(): void => openModal()}>
            <IconTrash aria-hidden="true" />
            <span className="sr-only">{`Poista ${
              datePeriodName || 'nimetön'
            } aukiolojakso`}</span>
          </button>
          <button
            className="button-icon"
            data-test={`openingPeriodAccordionButton-${datePeriod.id}`}
            type="button"
            onClick={(): void => toggleAccordion()}>
            <AccordionIcon />
            <span className="sr-only">{`Näytä aukioloajat jaksosta ${
              datePeriodName || 'nimetön'
            } aukiolojakso`}</span>
          </button>
        </div>
        <ConfirmationModal
          onConfirm={async (): Promise<void> => {
            if (datePeriod.id) {
              try {
                await deletePeriod(datePeriod.id);
                toast.success({
                  label: 'Aukiolo poistettu onnistuneesti',
                  text: `Aukiolo "${datePeriodName}" poistettu onnistuneesti.`,
                  dataTestId: 'date-period-delete-success',
                });
              } catch (_) {
                toast.error({
                  label: 'Aukiolon poisto epäonnistui',
                  text:
                    'Aukiolon poisto epäonnistui. Yritä myöhemmin uudelleen.',
                });
              }
            }
          }}
          title={deleteModalTitle}
          text={<DeleteModalText />}
          isOpen={isModalOpen}
          close={closeModal}
          confirmText="Poista"
        />
      </div>
      {isOpen && (
        <OpeningPeriodDetails
          datePeriod={datePeriod}
          datePeriodConfig={datePeriodConfig}
          language={language}
        />
      )}
    </div>
  );
}
