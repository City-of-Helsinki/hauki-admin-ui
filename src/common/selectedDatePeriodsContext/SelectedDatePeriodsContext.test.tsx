import { renderHook, act } from '@testing-library/react-hooks';
import { useContext } from 'react';
import {
  SelectedDatePeriodsProvider,
  SelectedDatePeriodsContext,
} from './SelectedDatePeriodsContext';
import { DatePeriod, DatePeriodType } from '../lib/types';

const datePeriod: DatePeriod = {
  id: 1,
  endDate: '2022-01-31',
  fixed: true,
  name: { fi: 'Test period', sv: 'Test period', en: 'Test period' },
  openingHours: [],
  startDate: '2022-01-01',
  override: false,
};

const datePeriodTwo: DatePeriod = {
  id: 2,
  endDate: '2022-01-31',
  fixed: true,
  name: { fi: 'Test period 2', sv: 'Test period 2', en: 'Test period 2' },
  openingHours: [],
  startDate: '2022-01-01',
  override: false,
};

const datePeriodThree: DatePeriod = {
  id: 3,
  endDate: '2022-01-31',
  fixed: true,
  name: { fi: 'Test period 3', sv: 'Test period 3', en: 'Test period 3' },
  openingHours: [],
  startDate: '2022-01-01',
  override: false,
};

describe('SelectedDatePeriodsContext', () => {
  it('toggleDatePeriod function changes the state as expected', () => {
    const { result } = renderHook(
      () => useContext(SelectedDatePeriodsContext),
      {
        wrapper: SelectedDatePeriodsProvider,
      }
    );

    act(() => {
      result?.current?.toggleDatePeriod(datePeriod);
    });

    act(() => {
      result?.current?.toggleDatePeriod(datePeriodTwo);
    });

    act(() => {
      result?.current?.toggleDatePeriod(datePeriodThree);
    });

    expect(result?.current?.selectedDatePeriods).toEqual(
      expect.arrayContaining([datePeriod, datePeriodTwo, datePeriodThree])
    );

    act(() => {
      result?.current?.toggleDatePeriod(datePeriodTwo);
    });

    expect(result?.current?.selectedDatePeriods).toHaveLength(2);

    expect(result?.current?.selectedDatePeriods).toEqual([
      datePeriod,
      datePeriodThree,
    ]);
  });

  it('clearDatePeriods function changes the state as expected', () => {
    const { result } = renderHook(
      () => useContext(SelectedDatePeriodsContext),
      {
        wrapper: SelectedDatePeriodsProvider,
      }
    );

    act(() => {
      result?.current?.clearDatePeriods();
    });

    expect(result?.current?.selectedDatePeriods).toHaveLength(0);
  });

  it('addDatePeriodIds function changes the state as expected', () => {
    const { result } = renderHook(
      () => useContext(SelectedDatePeriodsContext),
      {
        wrapper: SelectedDatePeriodsProvider,
      }
    );

    act(() => {
      result?.current?.addDatePeriods([datePeriod, datePeriodTwo]);
    });

    act(() => {
      result?.current?.addDatePeriods([datePeriodTwo]);
    });

    expect(result?.current?.selectedDatePeriods).toEqual([
      datePeriod,
      datePeriodTwo,
    ]);

    expect(result?.current?.selectedDatePeriods).toHaveLength(2);

    act(() => {
      result?.current?.addDatePeriods([datePeriodThree]);
    });

    expect(result?.current?.selectedDatePeriods).toEqual([
      datePeriod,
      datePeriodTwo,
      datePeriodThree,
    ]);
  });

  it('removeDatePeriodIds function changes the state as expected', () => {
    const { result } = renderHook(
      () => useContext(SelectedDatePeriodsContext),
      {
        wrapper: SelectedDatePeriodsProvider,
      }
    );

    act(() => {
      result?.current?.clearDatePeriods();
    });

    act(() => {
      result?.current?.addDatePeriods([datePeriod, datePeriodTwo]);
    });

    expect(result?.current?.selectedDatePeriods).toHaveLength(2);

    act(() => {
      result?.current?.removeDatePeriods([datePeriod, datePeriodThree]);
    });

    expect(result?.current?.selectedDatePeriods).toEqual([datePeriodTwo]);
    expect(result?.current?.selectedDatePeriods).toHaveLength(1);
  });

  it('removeDatePeriodIds function changes the state as expected', () => {
    const { result } = renderHook(
      () => useContext(SelectedDatePeriodsContext),
      {
        wrapper: SelectedDatePeriodsProvider,
      }
    );

    act(() => {
      result?.current?.clearDatePeriods();
    });

    act(() => {
      result?.current?.addDatePeriods([datePeriod, datePeriodTwo]);
    });

    expect(result?.current?.selectedDatePeriods).toHaveLength(2);

    act(() => {
      result?.current?.removeDatePeriods([datePeriod, datePeriodThree]);
    });

    expect(result?.current?.selectedDatePeriods).toEqual([datePeriodTwo]);
    expect(result?.current?.selectedDatePeriods).toHaveLength(1);
  });

  it('updateSelectedDatePeriods function changes the state as expected', () => {
    const { result } = renderHook(
      () => useContext(SelectedDatePeriodsContext),
      {
        wrapper: SelectedDatePeriodsProvider,
      }
    );

    act(() => {
      result?.current?.clearDatePeriods();
    });

    act(() => {
      result?.current?.addDatePeriods([
        datePeriod,
        datePeriodTwo,
        datePeriodThree,
      ]);
    });

    const copiesWithTypes: DatePeriod[] = [
      { ...datePeriod, type: DatePeriodType.NORMAL },
      { ...datePeriodTwo, type: DatePeriodType.EXCEPTION },
      { ...datePeriodThree, type: DatePeriodType.HOLIDAY },
    ];

    act(() => {
      result?.current?.updateSelectedDatePeriods(copiesWithTypes);
    });

    expect(result?.current?.selectedDatePeriods).toEqual(copiesWithTypes);
    expect(result?.current?.selectedDatePeriods).toHaveLength(3);
  });
});
