import React, { Fragment } from 'react';
import { useAppContext } from '../../App-context';
import { openingHoursToPreviewRows } from '../../common/helpers/preview-helpers';
import {
  Language,
  ResourceState,
  TranslatedApiChoice,
  OpeningHours,
  OpeningHoursTimeSpan,
} from '../../common/lib/types';
import { createWeekdaysStringFromIndices } from '../../common/utils/date-time/format';
import { uiFrequencyRules } from '../../constants';
import './OpeningHoursPreview.scss';

const emptyHours = '-- : --';

const TimeSpan = ({
  start,
  end,
}: {
  start?: string | null;
  end?: string | null;
}): JSX.Element => (
  <>
    <span className="opening-hours-preview-time-span__time">
      {start || emptyHours}
    </span>
    <span>-</span>
    <span className="opening-hours-preview-time-span__time">
      {end || emptyHours}
    </span>
  </>
);

const renderStartAndEndTimes = (
  timeSpan?: OpeningHoursTimeSpan
): JSX.Element => (
  <span className="opening-hours-preview-time-span">
    {timeSpan?.full_day ? (
      '24h'
    ) : (
      <TimeSpan start={timeSpan?.start_time} end={timeSpan?.end_time} />
    )}
  </span>
);

const resolveDescription = (
  language: Language,
  resourceStates: TranslatedApiChoice[],
  timeSpan?: OpeningHoursTimeSpan
): string => {
  if (!timeSpan) {
    return 'Tuntematon';
  }

  if (timeSpan.resource_state === ResourceState.OPEN) {
    return '';
  }

  return timeSpan.resource_state === ResourceState.OTHER
    ? timeSpan.description?.fi ?? ''
    : resourceStates.find((state) => state.value === timeSpan.resource_state)
        ?.label[language] ?? 'Tuntematon';
};

const TimeSpanRow = ({
  className,
  label,
  language,
  resourceStates,
  timeSpan,
}: {
  className: string;
  label?: string;
  language: Language;
  resourceStates: TranslatedApiChoice[];
  timeSpan?: OpeningHoursTimeSpan;
}): JSX.Element => (
  <tr className={className}>
    <td className="opening-hours-preview-table__day-column">{label}</td>
    <td
      className={`opening-hours-preview-table__time-span-column ${
        className ?? ''
      }`}>
      <span className="opening-hours-preview-table__opening-hours">
        {timeSpan?.resource_state === ResourceState.CLOSED
          ? ''
          : renderStartAndEndTimes(timeSpan)}
        <span>{resolveDescription(language, resourceStates, timeSpan)}</span>
      </span>
    </td>
  </tr>
);

const OpeningHoursPreview = ({
  openingHours,
  resourceStates,
}: {
  openingHours: OpeningHours[];
  resourceStates: TranslatedApiChoice[];
}): JSX.Element => {
  const { language = Language.FI } = useAppContext();
  return (
    <>
      {openingHoursToPreviewRows(openingHours).map(
        (previewRow, previewRowIdx) => (
          <table
            key={`preview-row-${previewRowIdx}`}
            className="opening-hours-preview-table">
            {previewRow.rule === 'week_every' ? null : (
              <caption className="opening-hours-preview-table__caption">
                {
                  uiFrequencyRules.find(
                    (rule) => rule.value === previewRow.rule
                  )?.label[language]
                }
              </caption>
            )}
            <thead className="opening-hours-preview-table__header">
              <tr>
                <th
                  className="opening-hours-preview-table__day-column sr-only"
                  scope="col">
                  Päivä
                </th>
                <th
                  className="opening-hours-preview-table__time-span-column sr-only"
                  scope="col">
                  Aukioloaika
                </th>
              </tr>
            </thead>
            <tbody>
              {previewRow.openingHours.map((openingHour, openingHourIdx) => {
                const rowClass =
                  openingHourIdx % 2 === 0
                    ? 'time-span-row--odd'
                    : 'time-span-row--even';

                return (
                  <Fragment key={`opening-hours-${openingHourIdx}`}>
                    {openingHour.timeSpans.map((timeSpan, timeSpanIdx) => (
                      <Fragment key={`time-span-${timeSpanIdx}`}>
                        <TimeSpanRow
                          key={`time-span-row-${timeSpanIdx}`}
                          className={rowClass}
                          language={language}
                          label={
                            timeSpanIdx === 0
                              ? createWeekdaysStringFromIndices(
                                  openingHour.weekdays,
                                  language
                                )
                              : ''
                          }
                          resourceStates={resourceStates}
                          timeSpan={timeSpan}
                        />
                      </Fragment>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )
      )}
    </>
  );
};

export default OpeningHoursPreview;