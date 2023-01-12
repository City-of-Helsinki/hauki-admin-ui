import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { alignOpeningHoursWeekdaysToDateRange } from '../../common/helpers/opening-hours-helpers';
import {
  DatePeriod,
  ResourceState,
  Rule,
  TranslatedApiChoice,
} from '../../common/lib/types';
import { defaultTimeSpan, defaultTimeSpanGroup } from '../../constants';
import OpeningHoursWeekdays from '../opening-hours-weekdays/OpeningHoursWeekdays';

type Props = {
  resourceStates: TranslatedApiChoice[];
  rules: Rule[];
};

const OpeningHours = ({ resourceStates, rules }: Props): JSX.Element => {
  const [dropInRow, setDropInRow] = useState<number>();
  const offsetTop = useRef<number>();
  const { control, getValues, setValue, watch } = useFormContext<DatePeriod>();
  const [startDate, endDate] = watch(['startDate', 'endDate']);
  const { insert, fields, remove } = useFieldArray({
    control,
    name: 'openingHours',
  });

  const allDayAreUncheckedForRow = (idx: number): boolean => {
    const weekdays = getValues(`openingHours.${idx}.weekdays`) as number[];

    return weekdays.length === 0;
  };

  const setDay = (i: number, day: number, checked: boolean): void => {
    const weekdays = getValues(`openingHours.${i}.weekdays`) as number[];
    if (checked) {
      setValue(`openingHours.${i}.weekdays`, [...weekdays, day]);
    } else {
      setValue(
        `openingHours.${i}.weekdays`,
        weekdays.filter((d) => d !== day)
      );
    }
  };

  const findPreviousChecked = (currentIdx: number, day: number): number =>
    fields.findIndex(
      (item, idx: number) =>
        idx !== currentIdx &&
        (getValues(`openingHours.${idx}.weekdays`) as number[]).includes(day)
    );

  const addNewRow = (currIndex: number, day: number): void => {
    const newIdx = currIndex + 1;
    const values = {
      weekdays: [day],
      timeSpanGroups: [
        {
          ...defaultTimeSpanGroup,
          timeSpans: [
            {
              ...defaultTimeSpan,
              resource_state: ResourceState.NO_OPENING_HOURS,
            },
          ],
        },
      ],
    };
    insert(newIdx, values, { shouldFocus: false });
    // FIXME: For some reason the normal array won't get added in the insert
    setValue(`openingHours.${newIdx}`, values);
    setDropInRow(newIdx);
  };

  const toggleWeekday = (openingHoursIdx: number) => (
    day: number,
    checked: boolean,
    newOffsetTop: number
  ) => {
    offsetTop.current = newOffsetTop;
    setDropInRow(undefined);
    if (checked) {
      setDay(openingHoursIdx, day, true);
      const prevId = findPreviousChecked(openingHoursIdx, day);
      if (prevId >= 0) {
        setDay(prevId, day, false);
        if (allDayAreUncheckedForRow(prevId)) {
          remove(prevId);
        }
      }
    } else {
      const weekdays = getValues(
        `openingHours.${openingHoursIdx}.weekdays`
      ).filter((d) => d !== day);
      if (weekdays.length) {
        setValue(`openingHours.${openingHoursIdx}.weekdays`, weekdays);
        addNewRow(openingHoursIdx, day);
      }
    }
  };

  const resetDropInRow = useCallback(() => setDropInRow(undefined), [
    setDropInRow,
  ]);

  useEffect(() => {
    setDropInRow(undefined);
    setValue(
      'openingHours',
      alignOpeningHoursWeekdaysToDateRange(
        getValues().openingHours,
        startDate,
        endDate
      )
    );
  }, [startDate, endDate, getValues, setValue, setDropInRow]);

  return (
    <>
      {fields.map((field, i) => (
        <OpeningHoursWeekdays
          key={field.id}
          dropIn={dropInRow === i}
          i={i}
          item={field}
          offsetTop={offsetTop.current}
          onDayChange={toggleWeekday(i)}
          onDropFinished={resetDropInRow}
          resourceStates={resourceStates}
          rules={rules}
        />
      ))}
    </>
  );
};

export default OpeningHours;
