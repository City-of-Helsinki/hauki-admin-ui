import React from 'react';
import {
  DatePeriod,
  Language,
  UiDatePeriodConfig,
} from '../../common/lib/types';
import api from '../../common/utils/api/api';
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
  reloadPeriods,
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
  reloadPeriods?: () => void;
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

  const movePeriod = async (
    datePeriod: DatePeriod,
    direction: 'up' | 'down'
  ): Promise<void> => {
    const idx = sortedDatePeriods.findIndex((p) => p.id === datePeriod.id);
    const neighborIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (neighborIdx < 0 || neighborIdx >= sortedDatePeriods.length) return;

    const period = sortedDatePeriods[idx];
    const neighbor = sortedDatePeriods[neighborIdx];

    const periodNewOrder = neighbor.order ?? neighborIdx;
    const neighborNewOrder = period.order ?? idx;

    await Promise.all([
      api.patchDatePeriodOrder(period.id!, periodNewOrder),
      api.patchDatePeriodOrder(neighbor.id!, neighborNewOrder),
    ]);
    reloadPeriods?.();
  };

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
              index > 0 ? () => movePeriod(datePeriod, 'up') : undefined
            }
            onMoveDown={
              index < sortedDatePeriods.length - 1
                ? () => movePeriod(datePeriod, 'down')
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
