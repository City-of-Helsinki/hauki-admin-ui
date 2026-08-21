import { fireEvent, render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import NormalOpeningHoursValidity from './NormalOpeningHoursValidity';
import { DatePeriod } from '../../common/lib/types';

// Mock useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const defaultValues: DatePeriod = {
  endDate: null,
  fixed: false,
  name: { fi: '', sv: '', en: '' },
  openingHours: [],
  override: false,
  startDate: '01.01.2024',
};

const Wrapper = ({
  children,
  values = {},
}: {
  children: ReactNode;
  values?: Partial<DatePeriod>;
}) => {
  const methods = useForm<DatePeriod>({
    defaultValues: { ...defaultValues, ...values },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('NormalOpeningHoursValidity', () => {
  it('shows only the start date for a recurring period', () => {
    render(
      <Wrapper>
        <NormalOpeningHoursValidity />
      </Wrapper>
    );

    expect(screen.getByTestId('opening-period-begin-date')).toHaveValue(
      '01.01.2024'
    );
    expect(
      screen.queryByTestId('opening-period-end-date')
    ).not.toBeInTheDocument();
  });

  it('shows the end date for a fixed period', () => {
    render(
      <Wrapper values={{ fixed: true, endDate: '31.12.2024' }}>
        <NormalOpeningHoursValidity />
      </Wrapper>
    );

    expect(screen.getByTestId('opening-period-end-date')).toHaveValue(
      '31.12.2024'
    );
  });

  it('reveals the end date when the fixed option is selected', () => {
    render(
      <Wrapper>
        <NormalOpeningHoursValidity />
      </Wrapper>
    );

    expect(
      screen.queryByTestId('opening-period-end-date')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('opening-hours-validity-fixed-option'));

    expect(screen.getByTestId('opening-period-end-date')).toBeInTheDocument();
  });

  it('renders both validity options', () => {
    render(
      <Wrapper>
        <NormalOpeningHoursValidity />
      </Wrapper>
    );

    expect(
      screen.getByLabelText('OpeningHours.ValidityRecurring')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('OpeningHours.ValidityFixed')
    ).toBeInTheDocument();
  });
});
