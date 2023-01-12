import React from 'react';
import {
  Language,
  DatePeriod,
  UiDatePeriodConfig,
  ResourceState,
} from '../../common/lib/types';
import { formatDateRange } from '../../common/utils/date-time/format';
import './OpeningPeriod.scss';
import OpeningHoursPreview from '../opening-hours-preview/OpeningHoursPreview';
import OpeningPeriodAccordion from '../opening-period-accordion/OpeningPeriodAccordion';
import { getDatePeriodName } from '../../common/helpers/opening-hours-helpers';

const OpeningPeriod = ({
  current = false,
  datePeriod,
  datePeriodConfig,
  editUrl,
  language,
  deletePeriod,
  initiallyOpen = false,
}: {
  current?: boolean;
  datePeriod: DatePeriod;
  datePeriodConfig?: UiDatePeriodConfig;
  editUrl: string;
  language: Language;
  deletePeriod: (id: number) => Promise<void>;
  initiallyOpen: boolean;
}): JSX.Element => {
  const formattedDateRange = formatDateRange({
    startDate: datePeriod.startDate,
    endDate: datePeriod.endDate,
  });

  return (
    <OpeningPeriodAccordion
      id={`${datePeriod.id}`}
      periodName={getDatePeriodName(language, datePeriod)}
      dateRange={formattedDateRange}
      onDelete={(): Promise<void> => {
        if (datePeriod.id) {
          return deletePeriod(datePeriod.id);
        }
        return Promise.resolve();
      }}
      editUrl={editUrl}
      initiallyOpen={initiallyOpen}
      isActive={current}>
      <div className="date-period-details-container">
        {datePeriod.resourceState === ResourceState.CLOSED ? (
          'Suljettu'
        ) : (
          <OpeningHoursPreview
            openingHours={datePeriod.openingHours}
            resourceStates={datePeriodConfig?.resourceState.options ?? []}
          />
        )}
      </div>
    </OpeningPeriodAccordion>
  );
};

export default OpeningPeriod;
