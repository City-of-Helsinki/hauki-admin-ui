import React from 'react';
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
  onMovePeriod,
  language,
  isLoading,
  newUrl,
  editUrl,
  showCopyOption = false,
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
  onMovePeriod?: (
    datePeriod: DatePeriod,
    direction: 'up' | 'down'
  ) => Promise<void>;
  language: Language;
  showCopyOption?: boolean;
  isLoading: boolean;
  newUrl: string;
  editUrl?: (datePeriod: DatePeriod) => string;
}): JSX.Element => {
  const ref = React.useRef<HTMLButtonElement>(null);

  const sortedDatePeriods = [...datePeriods].sort((a, b) => {
    if (a.order == null && b.order == null) return 0;
    if (a.order == null) return 1;
    if (b.order == null) return -1;
    return a.order - b.order;
  });

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
      title={title}
      showCopyOption={showCopyOption}>
      {datePeriods.length > 0 ? (
        sortedDatePeriods.map((datePeriod, index) => (
          <OpeningPeriod
            key={datePeriod.id}
            datePeriodConfig={datePeriodConfig}
            editUrl={editUrl && editUrl(datePeriod)}
            datePeriod={datePeriod}
            language={language}
            deletePeriod={async (datePeriodId) => {
              await deletePeriod(datePeriodId);
              ref.current?.focus();
            }}
            onMoveUp={
              onMovePeriod && index > 0
                ? () => onMovePeriod(datePeriod, 'up')
                : undefined
            }
            onMoveDown={
              onMovePeriod && index < sortedDatePeriods.length - 1
                ? () => onMovePeriod(datePeriod, 'down')
                : undefined
            }
            initiallyOpen={index <= 10}
            showCopyOption={showCopyOption}
          />
        ))
      ) : (
        <OpeningPeriodsEmptyState text={emptyState} />
      )}
    </OpeningPeriodsSection>
  );
};

export default OpeningPeriodsList;
