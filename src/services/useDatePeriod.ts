import { useEffect, useState } from 'react';
import { ApiDatePeriod } from '../common/lib/types';
import api from '../common/utils/api/api';

const useDatePeriod = (datePeriodId: string): ApiDatePeriod | undefined => {
  const [datePeriod, setDatePeriod] = useState<ApiDatePeriod>();

  useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      const apiDatePeriod = await api.getDatePeriod(parseInt(datePeriodId, 10));
      setDatePeriod(apiDatePeriod);
    };

    fetchData();
  }, [datePeriodId]);

  return datePeriod;
};

export default useDatePeriod;
