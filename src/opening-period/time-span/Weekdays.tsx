import React from 'react';
import './Weekdays.scss';
import { ArrayField } from 'react-hook-form';
import { TimeSpanFormFormat, FormWeekdays } from '../../common/lib/types';

const DayCheckbox = ({
  register,
  dataTest,
  timeSpanIndex,
  dayIndex,
  weekdays = [],
  children,
}: {
  register: Function;
  dataTest: string;
  timeSpanIndex: number;
  dayIndex: number;
  weekdays?: boolean[];
  children: string;
}): JSX.Element => {
  const checkBoxId = `timeSpans[${timeSpanIndex}].weekdays[${dayIndex}]`;

  return (
    <label data-test={dataTest} htmlFor={checkBoxId} className="day-label">
      <input
        ref={register()}
        defaultChecked={weekdays[dayIndex] || false}
        type="checkbox"
        name={checkBoxId}
        id={checkBoxId}
        data-test={`${dataTest}-checkbox`}
      />
      <span className="day-option">{children}</span>
    </label>
  );
};

export default function Weekdays({
  index,
  register,
  item,
}: {
  index: number;
  register: Function;
  item: Partial<ArrayField<Record<string, TimeSpanFormFormat>>>;
}): JSX.Element {
  const asWeekdaysValue = (item.weekdays as unknown) as FormWeekdays;

  return (
    <fieldset>
      <legend>Päivät *</legend>
      <DayCheckbox
        weekdays={asWeekdaysValue}
        register={register}
        dataTest={`weekdays-monday-${index}`}
        timeSpanIndex={index}
        dayIndex={0}>
        Ma
      </DayCheckbox>
      <DayCheckbox
        weekdays={asWeekdaysValue}
        register={register}
        dataTest={`weekdays-tuesday-${index}`}
        timeSpanIndex={index}
        dayIndex={1}>
        Ti
      </DayCheckbox>
      <DayCheckbox
        weekdays={asWeekdaysValue}
        register={register}
        dataTest={`weekdays-wednesday-${index}`}
        timeSpanIndex={index}
        dayIndex={2}>
        Ke
      </DayCheckbox>
      <DayCheckbox
        weekdays={asWeekdaysValue}
        register={register}
        dataTest={`weekdays-thursday-${index}`}
        timeSpanIndex={index}
        dayIndex={3}>
        To
      </DayCheckbox>
      <DayCheckbox
        weekdays={asWeekdaysValue}
        register={register}
        dataTest={`weekdays-friday-${index}`}
        timeSpanIndex={index}
        dayIndex={4}>
        Pe
      </DayCheckbox>
      <DayCheckbox
        weekdays={asWeekdaysValue}
        register={register}
        dataTest={`weekdays-saturday-${index}`}
        timeSpanIndex={index}
        dayIndex={5}>
        La
      </DayCheckbox>
      <DayCheckbox
        weekdays={asWeekdaysValue}
        register={register}
        dataTest={`weekdays-sunday-${index}`}
        timeSpanIndex={index}
        dayIndex={6}>
        Su
      </DayCheckbox>
    </fieldset>
  );
}
