import { useEffect, useState } from 'react';
import { UiDatePeriodConfig } from '../common/lib/types';
import { getDatePeriodFormConfig } from './datePeriodFormConfig';

const useDatePeriodConfig = (): UiDatePeriodConfig | undefined => {
  const [datePeriodConfig, setDatePeriodConfig] =
    useState<UiDatePeriodConfig>();

  useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      const uiDatePeriodOptions = await getDatePeriodFormConfig();
      setDatePeriodConfig(uiDatePeriodOptions);
    };

    fetchData();
  }, []);

  return datePeriodConfig;
};

export default useDatePeriodConfig;
