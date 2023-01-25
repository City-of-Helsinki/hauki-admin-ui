import React from 'react';
import { getActiveDatePeriod } from '../../common/helpers/opening-hours-helpers';
import {
  DatePeriod,
  Language,
  UiDatePeriodConfig,
} from '../../common/lib/types';
import OpeningPeriodsSection from '../opening-periods-section/OpeningPeriodsSection';
import OpeningPeriod from '../opening-period/OpeningPeriod';

const OpeningPeriodsEmptyState = ({ text }: { text: string }): JSX.Element => (
  <p className="opening-periods-not-found">{text}</p>
);

type PeriodsListTheme = 'DEFAULT' | 'LIGHT';

const OpeningPeriodsList = ({
  id,
  addDatePeriodButtonText,
  addNewOpeningPeriodButtonDataTest,
  title,
  datePeriods,
  datePeriodConfig,
  theme,
  emptyState,
  deletePeriod,
  language,
  isLoading,
  newUrl,
  editUrl,
}: {
  id: string;
  addNewOpeningPeriodButtonDataTest: string;
  addDatePeriodButtonText: string;
  title: string;
  datePeriods: DatePeriod[];
  datePeriodConfig?: UiDatePeriodConfig;
  theme: PeriodsListTheme;
  emptyState: string;
  deletePeriod: (id: number) => Promise<void>;
  language: Language;
  isLoading: boolean;
  newUrl: string;
  editUrl: (datePeriod: DatePeriod) => string;
}): JSX.Element => {
  const ref = React.useRef<HTMLButtonElement>(null);
  const currentDatePeriod = getActiveDatePeriod(
    new Date().toISOString().split('T')[0],
    datePeriods
  );

  return (
    <OpeningPeriodsSection
      addDatePeriodButtonRef={ref}
      addNewOpeningPeriodButtonDataTest={addNewOpeningPeriodButtonDataTest}
      addDatePeriodButtonText={addDatePeriodButtonText}
      datePeriods={datePeriods}
      id={id}
      isLoading={isLoading}
      newUrl={newUrl}
      theme={theme}
      title={title}>
      {datePeriods.length > 0 ? (
        datePeriods.map((datePeriod: DatePeriod, index) => (
          <OpeningPeriod
            key={datePeriod.id}
            current={currentDatePeriod === datePeriod}
            datePeriodConfig={datePeriodConfig}
            editUrl={editUrl(datePeriod)}
            datePeriod={datePeriod}
            language={language}
            deletePeriod={async (datePeriodId) => {
              await deletePeriod(datePeriodId);
              ref.current?.focus();
            }}
            initiallyOpen={index <= 10}
          />
        ))
      ) : (
        <OpeningPeriodsEmptyState text={emptyState} />
      )}
    </OpeningPeriodsSection>
  );
};

export default OpeningPeriodsList;
