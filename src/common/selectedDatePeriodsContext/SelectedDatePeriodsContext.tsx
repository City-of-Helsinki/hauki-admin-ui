import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import store from '../utils/storage/sessionStorage';
import { DatePeriod } from '../lib/types';

export enum DatePeriodSelectState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISABLED = 'DISABLED',
}

export type SelectedDatePeriodsContextType = {
  addDatePeriods: (datePeriods: DatePeriod[]) => void;
  clearDatePeriods: () => void;
  datePeriodSelectState: DatePeriodSelectState;
  removeDatePeriods: (datePeriods: DatePeriod[]) => void;
  selectedDatePeriods: DatePeriod[];
  setDatePeriodSelectState: (state: DatePeriodSelectState) => void;
  toggleDatePeriod: (datePeriod: DatePeriod) => void;
  updateSelectedDatePeriods: (datePeriods: DatePeriod[]) => void;
};

export const SelectedDatePeriodsContext = createContext<
  SelectedDatePeriodsContextType | undefined
>(undefined);

export const SelectedDatePeriodsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedDatePeriods, setSelectedDatePeriods] = useState<DatePeriod[]>(
    () => {
      const storedDatePeriods: DatePeriod[] =
        store.getItem('selectedDatePeriods') ?? [];
      return storedDatePeriods;
    }
  );

  const [datePeriodSelectState, setDatePeriodSelectState] =
    useState<DatePeriodSelectState>(DatePeriodSelectState.DISABLED);

  useEffect(() => {
    store.storeItem({ key: 'selectedDatePeriods', value: selectedDatePeriods });
  }, [selectedDatePeriods]);

  // toggles datePeriods in selectedDatePeriods
  const toggleDatePeriod = useCallback(
    (datePeriod: DatePeriod) => {
      const included = selectedDatePeriods.some(
        (dp) => dp.id === datePeriod.id
      );
      if (included) {
        const filteredDatePeriods = selectedDatePeriods.filter(
          (dp) => dp.id !== datePeriod.id
        );
        setSelectedDatePeriods(filteredDatePeriods);
      } else {
        const combinedDatePeriods = [...selectedDatePeriods, datePeriod];
        setSelectedDatePeriods(combinedDatePeriods);
      }
    },
    [selectedDatePeriods]
  );

  // checks if all given datePeriods are already in selectedDatePeriods and if they all have type in selectedDatePeriods
  const updateSelectedDatePeriods = useCallback(
    (datePeriods: DatePeriod[]) => {
      const allDatePeriodsIncludedWithType = datePeriods.every((dp) =>
        selectedDatePeriods.some(
          (sdp) => sdp.id === dp.id && sdp.type === dp.type
        )
      );

      if (!allDatePeriodsIncludedWithType) {
        setSelectedDatePeriods(datePeriods);
      }
    },
    [selectedDatePeriods]
  );

  // adds datePeriods to selectedDatePeriods not duplicating existing ones
  const addDatePeriods = useCallback(
    (datePeriods: DatePeriod[]) => {
      const datePeriodsToBeAdded = datePeriods.filter((dp) => {
        return !selectedDatePeriods.some((sdp) => sdp.id === dp.id);
      });

      const combinedDatePeriods = [
        ...selectedDatePeriods,
        ...datePeriodsToBeAdded,
      ];
      setSelectedDatePeriods(combinedDatePeriods);
    },
    [setSelectedDatePeriods, selectedDatePeriods]
  );

  // removes datePeriods from selectedDatePeriods
  const removeDatePeriods = useCallback(
    (datePeriods: DatePeriod[]) => {
      const filteredDatePeriods = selectedDatePeriods.filter(
        (dp) => !datePeriods.some((sdp) => sdp.id === dp.id)
      );
      setSelectedDatePeriods(filteredDatePeriods);
    },
    [selectedDatePeriods]
  );

  const clearDatePeriods = useCallback(() => {
    setSelectedDatePeriods([]);
  }, []);

  const value = useMemo(
    () => ({
      clearDatePeriods,
      datePeriodSelectState,
      setDatePeriodSelectState,
      selectedDatePeriods,
      toggleDatePeriod,
      addDatePeriods,
      removeDatePeriods,
      updateSelectedDatePeriods,
    }),
    [
      addDatePeriods,
      clearDatePeriods,
      datePeriodSelectState,
      removeDatePeriods,
      selectedDatePeriods,
      toggleDatePeriod,
      updateSelectedDatePeriods,
    ]
  );

  return (
    <SelectedDatePeriodsContext.Provider value={value}>
      {children}
    </SelectedDatePeriodsContext.Provider>
  );
};

export const useSelectedDatePeriodsContext =
  (): SelectedDatePeriodsContextType => {
    const context = React.useContext(SelectedDatePeriodsContext);
    if (context === undefined) {
      throw new Error(
        'useSelectedDatePeriodsContext must be used within a SelectedDatePeriodsProvider'
      );
    }
    return context;
  };
