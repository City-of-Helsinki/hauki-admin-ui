import React from 'react';
import { Link } from 'react-router-dom';
import { IconPenLine, IconTrash } from 'hds-react';
import { DatePeriod, Language } from '../../../common/lib/types';
import { formatDateRange } from '../../../common/utils/date-time/format';
import { displayLangVersionNotFound } from '../../../components/language-select/LanguageSelect';
import {
  ConfirmationModal,
  useModal,
} from '../../../components/modal/ConfirmationModal';
import './OpeningPeriod.scss';

export default function OpeningPeriod({
  resourceId,
  datePeriod,
  language,
  deletePeriod,
}: {
  resourceId: number;
  datePeriod: DatePeriod;
  language: Language;
  deletePeriod: (id: number) => Promise<void>;
}): JSX.Element {
  const name = datePeriod.name[language];
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
          {name}
          <br />
          {formattedDateRange}
        </b>
      </p>
    </>
  );
  const { isOpen, toggle } = useModal();

  const deleteDatePeriod = (id: number | undefined): void => {
    if (id) {
      deletePeriod(id);
    }
    toggle();
  };

  return (
    <div
      className="opening-period"
      data-test={`openingPeriod-${datePeriod.id}`}>
      <div className="opening-period-row">
        <div className="opening-period-dates opening-period-row-column">
          <div>{formattedDateRange}</div>
        </div>
        <div className="opening-period-title opening-period-row-column">
          {name ? (
            <h4>{name}</h4>
          ) : (
            <h4 className="text-danger">
              {displayLangVersionNotFound({
                language,
                label: 'aukiolojakson nimi',
              })}
            </h4>
          )}
        </div>
        <div className="opening-period-actions opening-period-row-column">
          <Link
            className="opening-period-edit-link button-icon"
            data-test={`openingPeriodEditLink-${datePeriod.id}`}
            to={`/resource/${resourceId}/period/${datePeriod.id}`}>
            <IconPenLine aria-hidden="true" />
            <span className="sr-only">{`Muokkaa ${
              name || 'nimettömän'
            } aukiolojakson tietoja`}</span>
          </Link>
          <button
            className="opening-period-delete-link button-icon"
            data-test={`openingPeriodDeleteLink-${datePeriod.id}`}
            type="button"
            onClick={(): void => toggle()}>
            <IconTrash aria-hidden="true" />
            <span className="sr-only">{`Poista ${
              name || 'nimetön'
            } aukiolojakso`}</span>
          </button>
        </div>
        {datePeriod.id && (
          <ConfirmationModal
            onConfirm={(): void => deleteDatePeriod(datePeriod.id)}
            title={deleteModalTitle}
            text={<DeleteModalText />}
            isOpen={isOpen}
            close={toggle}
            confirmText="Poista"
          />
        )}
      </div>
    </div>
  );
}
