import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import OpeningHoursWeekdays from './OpeningHoursWeekdays';
import {
  DatePeriod,
  OpeningHours as TOpeningHours,
  ResourceState,
  TranslatedApiChoice,
} from '../../common/lib/types';
import { defaultRule } from '../../constants';

// Mock useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const resourceStates: TranslatedApiChoice[] = [
  { value: ResourceState.OPEN, label: { fi: 'Auki', sv: null, en: null } },
  { value: ResourceState.CLOSED, label: { fi: 'Kiinni', sv: null, en: null } },
];

const openingHours: TOpeningHours = {
  weekdays: [1],
  timeSpanGroups: [
    {
      rule: defaultRule,
      timeSpans: [
        {
          description: { fi: null, sv: null, en: null },
          end_time: '16:00',
          full_day: false,
          resource_state: ResourceState.OPEN,
          start_time: '08:00',
        },
      ],
    },
  ],
};

const datePeriod: DatePeriod = {
  endDate: null,
  fixed: false,
  name: { fi: '', sv: '', en: '' },
  openingHours: [openingHours],
  override: false,
  startDate: '01.01.2024',
};

const Wrapper = ({ children }: { children: ReactNode }) => {
  const methods = useForm<DatePeriod>({ defaultValues: datePeriod });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

const renderWeekdays = () =>
  render(
    <Wrapper>
      <OpeningHoursWeekdays
        dropIn={false}
        i={0}
        item={openingHours}
        onDayChange={vi.fn()}
        onDropFinished={vi.fn()}
        resourceStates={resourceStates}
        rules={[defaultRule]}
      />
    </Wrapper>
  );

// These groups are the accessible structure of the opening hours form and have
// been tuned deliberately. They are rendered as native <fieldset> elements
// rather than div[role="group"], so assert both the accessible name and the
// element: either regressing would change what assistive tech announces.
describe('OpeningHoursWeekdays', () => {
  it('exposes the weekday group with its accessible name', () => {
    renderWeekdays();

    const group = screen.getByRole('group', {
      name: 'OpeningHours.WeekdayGroupAria',
    });

    expect(group.tagName).toBe('FIELDSET');
  });

  it('exposes the weekday checkboxes as a group labelled by the visible label', () => {
    renderWeekdays();

    const group = screen.getByRole('group', {
      name: 'OpeningHours.WeekdaysLabel',
    });

    expect(group.tagName).toBe('FIELDSET');
  });

  it('exposes the opening hours of the weekday group as a group', () => {
    renderWeekdays();

    const group = screen.getByRole('group', {
      name: 'OpeningHours.WeekdayGroupOpeningHoursAria',
    });

    expect(group.tagName).toBe('FIELDSET');
  });
});
