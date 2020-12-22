// Based on: https://github.com/City-of-Helsinki/palvelutarjotin-admin/blob/release-0.1.0/src/common/components/datepicker/Day.tsx
import { useDay } from '@datepicker-react/hooks';
import formatDate from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import isToday from 'date-fns/isToday';
import React, { useContext, useRef } from 'react';
import fiLocale from 'date-fns/locale/fi';
import './Datepicker.scss';
import DatepickerContext from './datepickerContext';

const Day: React.FC<{ dayLabel: string; date: Date }> = ({
  dayLabel,
  date,
}) => {
  const dayRef = useRef(null);

  const {
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    onDateSelect,
    onDateFocus,
    onDateHover,
    selectedDate,
  } = useContext(DatepickerContext);

  // after version 2.4.1 days won't focus automatically!!!!
  // https://github.com/tresko/react-datepicker/commit/eae4f52 <-- here is the change

  // might need to add something like this here:
  //   useEffect(() => {
  //  if (dayRef && dayRef.current && isDateFocused(date)) {
  //   dayRef.current.focus()
  // }
  // }, [dayRef, date, isDateFocused])
  const { disabledDate, onClick, onKeyDown, onMouseEnter, tabIndex } = useDay({
    date,
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    onDateFocus,
    onDateSelect,
    onDateHover,
    dayRef,
  });

  if (!dayLabel) {
    return <div />;
  }

  const userHasSelectedThisDate = (): boolean => {
    return !!(selectedDate && isSameDay(selectedDate, date));
  };

  return (
    <button
      className={`dayButton ${userHasSelectedThisDate() ? 'daySelected ' : ''}${
        disabledDate ? 'dayDisabled ' : ''
      }${isToday(date) ? 'dayToday' : ''}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onFocus={(): void => onDateFocus(date)}
      tabIndex={tabIndex}
      type="button"
      ref={dayRef}
      aria-label={`Valitse ${formatDate(date, 'dd.MM.yyyy', {
        locale: fiLocale,
      })}`}>
      {dayLabel}
    </button>
  );
};

export default Day;
