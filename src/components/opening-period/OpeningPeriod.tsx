import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Language,
  UiDatePeriodConfig,
  ResourceState,
  DatePeriod,
} from '../../common/lib/types';
import { formatDateRange } from '../../common/utils/date-time/format';
import './OpeningPeriod.scss';
import OpeningHoursPreview from '../opening-hours-preview/OpeningHoursPreview';
import OpeningPeriodAccordion from '../opening-period-accordion/OpeningPeriodAccordion';
import { getDatePeriodName } from '../../common/helpers/opening-hours-helpers';
import {
  DatePeriodSelectState,
  useSelectedDatePeriodsContext,
} from '../../common/selectedDatePeriodsContext/SelectedDatePeriodsContext';

const OpeningPeriod = ({
  datePeriod,
  datePeriodConfig,
  editUrl,
  language,
  deletePeriod,
  initiallyOpen = false,
  showCopyOption = false,
}: {
  datePeriod: DatePeriod;
  datePeriodConfig?: UiDatePeriodConfig;
  editUrl?: string;
  language: Language;
  deletePeriod?: (id: number) => Promise<void>;
  initiallyOpen: boolean;
  showCopyOption?: boolean;
}): JSX.Element => {
  const {
    selectedDatePeriods,
    toggleDatePeriod,
    removeDatePeriods,
    datePeriodSelectState,
  } = useSelectedDatePeriodsContext();
  const { t } = useTranslation();

  const toggleChecked =
    datePeriodSelectState === DatePeriodSelectState.ACTIVE
      ? (): void => {
          toggleDatePeriod(datePeriod);
        }
      : undefined;

  return (
    <OpeningPeriodAccordion
      id={`${datePeriod.id}`}
      toggleChecked={toggleChecked}
      checked={selectedDatePeriods.some((dp) => dp.id === datePeriod.id)}
      periodName={getDatePeriodName(language, datePeriod)}
      dateRange={formatDateRange({
        startDate: datePeriod.startDate,
        endDate: datePeriod.endDate,
      })}
      onDelete={(): Promise<void> => {
        removeDatePeriods([datePeriod]);
        if (datePeriod.id && deletePeriod) {
          return deletePeriod(datePeriod.id);
        }
        return Promise.resolve();
      }}
      editUrl={editUrl}
      initiallyOpen={initiallyOpen}
      isActive={datePeriod.isActive}
      showCopyOption={showCopyOption}>
      <div className="date-period-details-container">
        {datePeriod.resourceState === ResourceState.CLOSED ? (
          t('ResourcePage.OpeningPeriodsSection.StateClosed')
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
