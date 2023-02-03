import React from 'react';
import {
  ActiveDatePeriod,
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
  onSelect,
  selected,
}: {
  id: string;
  addNewOpeningPeriodButtonDataTest: string;
  addDatePeriodButtonText: string;
  title: string;
  datePeriods: ActiveDatePeriod[];
  datePeriodConfig?: UiDatePeriodConfig;
  theme: PeriodsListTheme;
  emptyState: string;
  deletePeriod: (id: number) => Promise<void>;
  language: Language;
  isLoading: boolean;
  newUrl: string;
  editUrl: (datePeriod: DatePeriod) => string;
  onSelect?: (datePeriodId: number[], selected: boolean) => void;
  selected?: number[];
}): JSX.Element => {
  const ref = React.useRef<HTMLButtonElement>(null);

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
      selected={
        !!datePeriods.length &&
        datePeriods.every((i) => selected?.includes(i.id!))
      }
      onSelect={
        onSelect &&
        ((allSelected) => {
          onSelect(
            datePeriods.map((d) => d.id!),
            allSelected
          );
        })
      }>
      {datePeriods.length > 0 ? (
        datePeriods.map((datePeriod, index) => (
          <OpeningPeriod
            key={datePeriod.id}
            datePeriodConfig={datePeriodConfig}
            editUrl={editUrl(datePeriod)}
            datePeriod={datePeriod}
            language={language}
            deletePeriod={async (datePeriodId) => {
              await deletePeriod(datePeriodId);
              ref.current?.focus();
            }}
            selected={selected?.includes(datePeriod.id!)}
            onSelect={
              onSelect &&
              ((s) => {
                onSelect([datePeriod.id!], s);
              })
            }
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
