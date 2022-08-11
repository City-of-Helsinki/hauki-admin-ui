import React from 'react';
import {
  OpeningHoursFormValues,
  ResourceState,
  UiDatePeriodConfig,
} from '../../common/lib/types';
import { TimeSpan } from '../opening-hours-preview/OpeningHoursPreview';

type Props = {
  datePeriod: OpeningHoursFormValues;
  datePeriodConfig?: UiDatePeriodConfig;
};

const ExceptionOpeningHours = ({
  datePeriod,
  datePeriodConfig,
}: Props): JSX.Element => (
  <div>
    {datePeriod.resourceState === ResourceState.CLOSED
      ? 'Suljettu'
      : datePeriod.openingHours.map((openingHours) =>
          openingHours.timeSpanGroups.map((timeSpanGroup) =>
            timeSpanGroup.timeSpans.map((timeSpan) => (
              <TimeSpan
                key={timeSpan.id}
                resourceStates={datePeriodConfig?.resourceState.options || []}
                timeSpan={timeSpan}
              />
            ))
          )
        )}
  </div>
);

export default ExceptionOpeningHours;
