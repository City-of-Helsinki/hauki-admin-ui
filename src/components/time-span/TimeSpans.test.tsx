import { fireEvent, render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import TimeSpans from './TimeSpans';
import {
  DatePeriod,
  ResourceState,
  TimeSpan as TTimeSpan,
  TranslatedApiChoice,
} from '../../common/lib/types';

// Mock useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const resourceStates: TranslatedApiChoice[] = [
  { value: ResourceState.OPEN, label: { fi: 'Auki', sv: null, en: null } },
  { value: ResourceState.CLOSED, label: { fi: 'Kiinni', sv: null, en: null } },
  {
    value: ResourceState.NO_OPENING_HOURS,
    label: { fi: 'Ei aukioloa', sv: null, en: null },
  },
  {
    value: ResourceState.UNDEFINED,
    label: { fi: 'Määrittelemätön', sv: null, en: null },
  },
];

const openTimeSpan: TTimeSpan = {
  description: { fi: null, sv: null, en: null },
  end_time: '16:00',
  full_day: false,
  resource_state: ResourceState.OPEN,
  start_time: '08:00',
};

const buildDatePeriod = (timeSpans: TTimeSpan[]): DatePeriod => ({
  endDate: null,
  fixed: false,
  name: { fi: '', sv: '', en: '' },
  openingHours: [
    {
      weekdays: [1],
      timeSpanGroups: [
        {
          rule: { id: undefined, type: 'week_every' },
          timeSpans,
        },
      ],
    },
  ],
  override: false,
  startDate: '01.01.2024',
});

const Wrapper = ({
  children,
  timeSpans = [openTimeSpan],
}: {
  children: ReactNode;
  timeSpans?: TTimeSpan[];
}) => {
  const methods = useForm<DatePeriod>({
    defaultValues: buildDatePeriod(timeSpans),
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

const renderTimeSpans = (timeSpans?: TTimeSpan[]) =>
  render(
    <Wrapper timeSpans={timeSpans}>
      <TimeSpans
        openingHoursIdx={0}
        timeSpanGroupIdx={0}
        resourceStates={resourceStates}
      />
    </Wrapper>
  );

// HDS inputs render their own role=group elements, so match on the aria-label
const timeSpanGroups = () =>
  screen.getAllByRole('group', {
    name: 'OpeningHours.TimeSpanAriaLabel',
  });

describe('TimeSpans', () => {
  it('renders a row for each time span', () => {
    renderTimeSpans([openTimeSpan, { ...openTimeSpan, start_time: '18:00' }]);

    expect(timeSpanGroups()).toHaveLength(2);
  });

  it('shows the start and end times of an open time span', () => {
    renderTimeSpans();

    expect(
      screen.getByText('OpeningHours.TimeSpanBegins')
    ).toBeInTheDocument();
    expect(
      screen.getByText('OpeningHours.TimeSpanEnds')
    ).toBeInTheDocument();
  });

  it('hides the time range for a full day time span', () => {
    renderTimeSpans([{ ...openTimeSpan, full_day: true }]);

    expect(
      screen.queryByText('OpeningHours.TimeSpanBegins')
    ).not.toBeInTheDocument();
  });

  it('shows the description fields when the state allows them', () => {
    renderTimeSpans();

    expect(
      screen.getByLabelText('OpeningHours.DescriptionInFinnish')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('OpeningHours.DescriptionInSwedish')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('OpeningHours.DescriptionInEnglish')
    ).toBeInTheDocument();
  });

  it('adds a time span from the add button', () => {
    renderTimeSpans();

    expect(timeSpanGroups()).toHaveLength(1);

    fireEvent.click(
      screen.getByRole('button', { name: 'OpeningHours.AddTimeSpanButton' })
    );

    expect(timeSpanGroups()).toHaveLength(2);
  });

  it('only allows removing time spans after the first one', () => {
    renderTimeSpans();

    expect(
      screen.queryByRole('button', {
        name: 'OpeningHours.RemoveTimeSpanButton',
      })
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'OpeningHours.AddTimeSpanButton' })
    );

    const removeButtons = screen.getAllByRole('button', {
      name: 'OpeningHours.RemoveTimeSpanButton',
    });
    expect(removeButtons).toHaveLength(1);

    fireEvent.click(removeButtons[0]);

    expect(timeSpanGroups()).toHaveLength(1);
  });

  it('allows only a single time span when the resource has no opening hours', () => {
    renderTimeSpans([
      { ...openTimeSpan, resource_state: ResourceState.NO_OPENING_HOURS },
    ]);

    expect(
      screen.queryByRole('button', { name: 'OpeningHours.AddTimeSpanButton' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('OpeningHours.TimeSpanBegins')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('OpeningHours.DescriptionInFinnish')
    ).not.toBeInTheDocument();
  });

  it('drops extra time spans when the state allows only one', () => {
    renderTimeSpans([
      { ...openTimeSpan, resource_state: ResourceState.NO_OPENING_HOURS },
      { ...openTimeSpan, start_time: '18:00' },
    ]);

    expect(timeSpanGroups()).toHaveLength(1);
  });

  it('hides the times of a closed first time span but keeps the description', () => {
    renderTimeSpans([
      { ...openTimeSpan, resource_state: ResourceState.CLOSED },
    ]);

    expect(
      screen.queryByText('OpeningHours.TimeSpanBegins')
    ).not.toBeInTheDocument();
    expect(
      screen.getByLabelText('OpeningHours.DescriptionInFinnish')
    ).toBeInTheDocument();
  });
});
