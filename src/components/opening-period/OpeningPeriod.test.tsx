import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { datePeriodOptions } from '../../../test/fixtures/api-options';
import { datePeriod } from '../../../test/fixtures/date-period';
import {
  DatePeriod,
  Language,
  UiDatePeriodConfig,
} from '../../common/lib/types';
import OpeningPeriod from './OpeningPeriod';
import { SelectedDatePeriodsProvider } from '../../common/selectedDatePeriodsContext/SelectedDatePeriodsContext';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    init: () => {},
  },
}));

const testDatePeriod: DatePeriod = { ...datePeriod, isActive: false };
const testDatePeriodOptions: UiDatePeriodConfig = datePeriodOptions;

describe(`<OpeningPeriod />`, () => {
  it('should show opening period', async () => {
    const { container } = render(
      <Router>
        <SelectedDatePeriodsProvider>
          <OpeningPeriod
            editUrl="some-url"
            initiallyOpen={false}
            datePeriod={testDatePeriod}
            language={Language.FI}
            datePeriodConfig={testDatePeriodOptions}
            deletePeriod={(): Promise<void> => Promise.resolve()}
          />
        </SelectedDatePeriodsProvider>
      </Router>
    );

    expect(
      await container.querySelector('div[data-test="openingPeriod-1"]')
    ).toBeInTheDocument();
  });

  jest.clearAllMocks();
});
