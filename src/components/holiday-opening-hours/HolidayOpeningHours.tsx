import React from 'react';
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
  if (datePeriod) {
    return (
      <div>
        {datePeriod.resourceState === ResourceState.CLOSED
          ? 'Suljettu'
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

  return <>Ei poikkeavia aukioloja</>;
};

export default HolidayOpeningHours;
