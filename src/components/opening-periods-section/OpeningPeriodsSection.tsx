import { Checkbox, LoadingSpinner } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DatePeriod } from '../../common/lib/types';
import { PrimaryButton, SecondaryButton } from '../button/Button';
import './OpeningPeriodsSection.scss';
import {
  DatePeriodSelectState,
  useSelectedDatePeriodsContext,
} from '../../common/selectedDatePeriodsContext/SelectedDatePeriodsContext';

type Props = {
  addDatePeriodButtonRef?: React.Ref<HTMLButtonElement>;
  addDatePeriodButtonText: string;
  addNewOpeningPeriodButtonDataTest: string;
  children: React.ReactNode;
  datePeriods: DatePeriod[];
  id?: string;
  isLoading: boolean;
  newUrl: string;
  theme: 'DEFAULT' | 'LIGHT';
  title: string;
  showCopyOption?: boolean;
};

const OpeningPeriodsSection = ({
  addDatePeriodButtonRef,
  addDatePeriodButtonText,
  addNewOpeningPeriodButtonDataTest,
  children,
  id,
  isLoading,
  datePeriods,
  newUrl,
  title,
  theme,
  showCopyOption = false,
}: Props): JSX.Element => {
  const navigate = useNavigate();
  const {
    selectedDatePeriods,
    removeDatePeriods,
    addDatePeriods,
    datePeriodSelectState,
  } = useSelectedDatePeriodsContext();
  const { t } = useTranslation();
  
  let openingPeriodsHeaderClassName = 'opening-periods-header';
  if (showCopyOption) {
    openingPeriodsHeaderClassName = 'opening-periods-header-copy-mode';
  } else if (theme === 'LIGHT') {
    openingPeriodsHeaderClassName = 'opening-periods-header-light';
  }

  // custom checkbox style for default style TODO: FINALS?
  const customCheckboxStyle =
    theme === 'DEFAULT'
      ? {
          backgroundColor: 'var(--color-white)',
          '--background-selected': 'var(--color-coat-of-arms)',
          '--border-color-selected': 'var(--color-coat-of-arms)',
        }
      : {};

  const Button = theme === 'LIGHT' ? PrimaryButton : SecondaryButton;

  const noOfSelectedDatePeriods = selectedDatePeriods.filter((sdp) =>
    datePeriods.some((dp) => dp.id === sdp.id)
  ).length;

  const someSelectedDatePeriods =
    noOfSelectedDatePeriods > 0 && noOfSelectedDatePeriods < datePeriods.length;

  const allChecked =
    noOfSelectedDatePeriods === datePeriods.length && datePeriods.length > 0;

  const onChangeHandler = (): void => {
    if (!allChecked) {
      addDatePeriods(datePeriods);
    } else {
      removeDatePeriods(datePeriods);
    }
  };

  const combinedIdsString = `all-periods-checkbox-${datePeriods
    .map((dp) => dp.id)
    .join('-')}`;

  return (
    <section className="opening-periods-section">
      <header className={openingPeriodsHeaderClassName}>
        {datePeriodSelectState === DatePeriodSelectState.ACTIVE && (
          <Checkbox
            label={undefined}
            id={combinedIdsString}
            checked={allChecked}
            indeterminate={someSelectedDatePeriods}
            onChange={onChangeHandler}
            disabled={datePeriods.length === 0}
            style={customCheckboxStyle as React.CSSProperties}
            className="opening-periods-header-checkbox"
          />
        )}
        <h2 className="opening-periods-header-title">
          {datePeriodSelectState === DatePeriodSelectState.ACTIVE ? (
            <label htmlFor={combinedIdsString}>{title}</label>
          ) : (
            title
          )}
        </h2>
        <p className="opening-periods-period-count">
          {datePeriods.length}{' '}
          {datePeriods.length === 1
            ? t('ResourcePage.OpeningPeriodsSection.CountSingular')
            : t('ResourcePage.OpeningPeriodsSection.CountPlural')}
        </p>
        {datePeriodSelectState !== DatePeriodSelectState.INACTIVE && (
          <Button
            ref={addDatePeriodButtonRef}
            className="opening-period-header-button"
            dataTest={addNewOpeningPeriodButtonDataTest}
            light
            onClick={(): void => {
              navigate(newUrl);
            }}
            size="small">
            {addDatePeriodButtonText}
          </Button>
        )}
      </header>
      {isLoading ? (
        <div className="opening-period-loading-spinner-container">
          <LoadingSpinner
            loadingText={t('ResourcePage.OpeningPeriodsSection.LoadingText')}
            small
          />
        </div>
      ) : (
        <ul className="opening-periods-list" data-testid={id}>
          {React.Children.map(children, (child) => (
            <li>{child}</li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default OpeningPeriodsSection;
