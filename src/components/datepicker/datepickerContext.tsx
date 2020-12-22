// Based on: https://github.com/City-of-Helsinki/palvelutarjotin-admin/blob/release-0.1.0/src/common/components/datepicker/datepickerContext.tsx
import { createContext } from 'react';

export const datepickerContextDefaultValue: DatepickerContext = {
  focusedDate: null,
  selectedDate: null,
  isDateFocused: () => false,
  isDateSelected: () => false,
  isDateHovered: () => false,
  isDateBlocked: () => false,
  isFirstOrLastSelectedDate: () => false,
  onDateFocus: () => {
    // do nothing
  },
  onDateHover: () => {
    // do nothing
  },
  onDateSelect: () => {
    // do nothing
  },
};

type DatepickerContext = {
  focusedDate: Date | null;
  selectedDate: Date | null;
  isDateFocused: (date: Date) => boolean;
  isDateSelected: (date: Date) => boolean;
  isDateHovered: (date: Date) => boolean;
  isDateBlocked: (date: Date) => boolean;
  isFirstOrLastSelectedDate: (date: Date) => boolean;
  onDateFocus: (date: Date) => void;
  onDateHover: (date: Date) => void;
  onDateSelect: (date: Date) => void;
};

export default createContext(datepickerContextDefaultValue);
