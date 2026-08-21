import { fireEvent, render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import ExceptionOpeningHoursValidity from './ExceptionOpeningHoursValidity';
import { DatePeriod, ResourceState } from '../../common/lib/types';

// Mock useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const defaultValues: DatePeriod = {
  endDate: '10.01.2024',
  fixed: false,
  name: { fi: '', sv: '', en: '' },
  openingHours: [],
  override: true,
  resourceState: ResourceState.CLOSED,
  startDate: '01.01.2024',
};

// Exposes the live form state so the component's setValue calls can be
// asserted. The HDS DateInput keeps its own internal value, so reading the
// rendered input would test HDS rather than this component.
const FormState = () => {
  const { watch } = useFormContext<DatePeriod>();
  const [startDate, endDate, resourceState, openingHours] = watch([
    'startDate',
    'endDate',
    'resourceState',
    'openingHours',
  ]);

  return (
    <div data-testid="form-state">
      {`${startDate}|${endDate}|${resourceState}|${openingHours.length}`}
    </div>
  );
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

  return (
    <FormProvider {...methods}>
      {children}
      <FormState />
    </FormProvider>
  );
};

// The HDS DateInput only commits its value on blur
const enterDate = (testId: string, value: string): void => {
  const input = screen.getByTestId(testId);
  fireEvent.change(input, { target: { value } });
  fireEvent.blur(input);
};

describe('ExceptionOpeningHoursValidity', () => {
  it('shows the start and end dates of the exception', () => {
    render(
      <Wrapper>
        <ExceptionOpeningHoursValidity />
      </Wrapper>
    );

    expect(screen.getByTestId('exception-start-date')).toHaveValue('01.01.2024');
    expect(screen.getByTestId('exception-end-date')).toHaveValue('10.01.2024');
  });

  it('pushes the end date forward when the start date passes it', () => {
    render(
      <Wrapper>
        <ExceptionOpeningHoursValidity />
      </Wrapper>
    );

    enterDate('exception-start-date', '20.01.2024');

    expect(screen.getByTestId('form-state')).toHaveTextContent(
      '20.01.2024|20.01.2024'
    );
  });

  it('leaves the end date alone when the start date stays before it', () => {
    render(
      <Wrapper>
        <ExceptionOpeningHoursValidity />
      </Wrapper>
    );

    enterDate('exception-start-date', '05.01.2024');

    expect(screen.getByTestId('form-state')).toHaveTextContent(
      '05.01.2024|10.01.2024'
    );
  });

  it('starts closed when the resource state is closed', () => {
    render(
      <Wrapper>
        <ExceptionOpeningHoursValidity />
      </Wrapper>
    );

    expect(screen.getByTestId('closed-state-checkbox')).toBeChecked();
    expect(screen.getByTestId('open-state-checkbox')).not.toBeChecked();
  });

  it('starts open when the resource state is anything else', () => {
    render(
      <Wrapper values={{ resourceState: ResourceState.OPEN }}>
        <ExceptionOpeningHoursValidity />
      </Wrapper>
    );

    expect(screen.getByTestId('open-state-checkbox')).toBeChecked();
  });

  it('adds default opening hours when switched to open', () => {
    render(
      <Wrapper>
        <ExceptionOpeningHoursValidity />
      </Wrapper>
    );

    fireEvent.click(screen.getByTestId('open-state-checkbox'));

    expect(screen.getByTestId('form-state')).toHaveTextContent(
      `${ResourceState.UNDEFINED}|1`
    );
  });

  it('clears opening hours when switched to closed', () => {
    render(
      <Wrapper values={{ resourceState: ResourceState.OPEN }}>
        <ExceptionOpeningHoursValidity />
      </Wrapper>
    );

    fireEvent.click(screen.getByTestId('closed-state-checkbox'));

    expect(screen.getByTestId('form-state')).toHaveTextContent(
      `${ResourceState.CLOSED}|0`
    );
  });
});
