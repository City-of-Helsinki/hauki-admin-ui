import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DatePeriod,
  ResourceState,
  UiDatePeriodConfig,
} from '../../common/lib/types';
import { TimeSpan } from '../opening-hours-preview/OpeningHoursPreview';

type Props = {
  datePeriod?: DatePeriod;
  datePeriodConfig?: UiDatePeriodConfig;
};

const HolidayOpeningHours = ({
  datePeriod,
  datePeriodConfig,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  if (datePeriod) {
    return (
      <div>
        {datePeriod.resourceState === ResourceState.CLOSED
          ? t('ResourcePage.OpeningPeriodsSection.StateClosed')
          : datePeriod.openingHours.map((openingHours) =>
              openingHours.timeSpanGroups.map((timeSpanGroup) =>
                timeSpanGroup.timeSpans.map((timeSpan, timeSpanIdx) => (
                  <TimeSpan
                    key={timeSpan.id}
                    idx={timeSpanIdx}
                    resourceStates={
                      datePeriodConfig?.resourceState.options || []
                    }
                    timeSpan={timeSpan}
                  />
                ))
              )
            )}
      </div>
    );
  }

  return <>{t('OpeningHours.NoExceptions')}</>;
};

export default HolidayOpeningHours;
