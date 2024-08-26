import React from 'react';
import { useTranslation } from 'react-i18next';
import { DatePeriod, TranslatedApiChoice } from '../../common/lib/types';
import { formatDateRange } from '../../common/utils/date-time/format';
import OpeningHoursPreview from '../opening-hours-preview/OpeningHoursPreview';
import './OpeningHoursFormPreview.scss';

const OpeningHoursFormPreview = ({
  datePeriod,
  resourceStates,
  className,
  tabIndex,
}: {
  datePeriod: DatePeriod;

  resourceStates: TranslatedApiChoice[];
  tabIndex?: number;
  className?: string;
}): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div
      aria-labelledby="opening-hours-form-preview"
      className={`card opening-hours-form-preview ${className || ''}`}
      tabIndex={tabIndex}>
      <h2
        id="opening-hours-form-preview"
        className="opening-hours-form-preview__title">
        {t('OpeningHours.OpeningHoursFormPreview')}
      </h2>
      <p>{formatDateRange(datePeriod)}</p>
      <OpeningHoursPreview
        openingHours={datePeriod.openingHours}
        resourceStates={resourceStates}
      />
    </div>
  );
};

export default OpeningHoursFormPreview;
