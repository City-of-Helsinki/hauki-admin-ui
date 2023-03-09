import { LoadingSpinner } from 'hds-react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { DatePeriod } from '../../common/lib/types';
import { PrimaryButton, SecondaryButton } from '../button/Button';
import './OpeningPeriodsSection.scss';

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
}: Props): JSX.Element => {
  const history = useHistory();
  const openingPeriodsHeaderClassName =
    theme === 'LIGHT'
      ? 'opening-periods-header-light'
      : 'opening-periods-header';

  const Button = theme === 'LIGHT' ? PrimaryButton : SecondaryButton;

  return (
    <section className="opening-periods-section">
      <header className={openingPeriodsHeaderClassName}>
        <h2 className="opening-periods-header-title">{title}</h2>
        <p className="opening-periods-period-count">
          {datePeriods.length}{' '}
          {datePeriods.length === 1 ? 'aukioloaika' : 'aukioloaikaa'}
        </p>
        <Button
          ref={addDatePeriodButtonRef}
          className="opening-period-header-button"
          dataTest={addNewOpeningPeriodButtonDataTest}
          light
          onClick={(): void => {
            history.push(newUrl);
          }}
          size="small">
          {addDatePeriodButtonText}
        </Button>
      </header>
      {isLoading ? (
        <div className="opening-period-loading-spinner-container">
          <LoadingSpinner loadingText="Haetaan aukioloja" small />
        </div>
      ) : (
        <ul className="opening-periods-list" data-test={id}>
          {React.Children.map(children, (child) => (
            <li>{child}</li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default OpeningPeriodsSection;
