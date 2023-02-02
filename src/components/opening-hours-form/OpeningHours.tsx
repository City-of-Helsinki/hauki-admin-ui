import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  alignOpeningHoursWeekdaysToDateRange,
  updateWeekday,
} from '../../common/helpers/opening-hours-helpers';
import { DatePeriod, Rule, TranslatedApiChoice } from '../../common/lib/types';
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

  const handleDayChange = (openingHoursIdx: number) => (
    day: number,
    checked: boolean,
    newOffsetTop: number
  ) => {
    offsetTop.current = newOffsetTop;
    setDropInRow(undefined);
    const openingHours = getValues('openingHours');
    const result = updateWeekday(openingHours, day, checked, openingHoursIdx);

    result.updated.forEach((o) =>
      setValue(`openingHours.${o.idx}.weekdays`, o.weekdays)
    );

    if ('added' in result && result.added) {
      insert(result.added.idx, result.added.value, { shouldFocus: false });
      // FIXME: For some reason basic array won't get added in the insert.
      // Probably because of the weekdays because they have not registered inputs.
      setValue(`openingHours.${result.added.idx}`, result.added.value);
      setDropInRow(result.added.idx);
    }

    if ('removed' in result && result.removed !== undefined) {
      remove(result.removed);
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
          onDayChange={handleDayChange(i)}
          onDropFinished={resetDropInRow}
          resourceStates={resourceStates}
          rules={rules}
        />
      ))}
    </>
  );
};

export default OpeningHours;
