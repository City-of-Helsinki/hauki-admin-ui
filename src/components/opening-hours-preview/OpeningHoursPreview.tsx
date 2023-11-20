import React from 'react';
import { useAppContext } from '../../App-context';
import { openingHoursToPreviewRows } from '../../common/helpers/preview-helpers';
import {
  Language,
  TranslatedApiChoice,
  OpeningHours,
  TimeSpan as TTimeSpan,
  ResourceState,
} from '../../common/lib/types';
import { createWeekdaysStringFromIndices } from '../../common/utils/date-time/format';
import { uiRuleLabels } from '../../constants';
import './OpeningHoursPreview.scss';

const shouldHideOpeningHours = (timeSpan: TTimeSpan, idx: number): boolean =>
  !timeSpan.start_time &&
  !timeSpan.end_time &&
  !!timeSpan.resource_state &&
  [
    ResourceState.CLOSED,
    ResourceState.MAINTENANCE,
    ResourceState.NOT_IN_USE,
    ResourceState.UNDEFINED,
  ].includes(timeSpan.resource_state) &&
  idx === 0;

const shouldHideState = (timeSpan: TTimeSpan): boolean =>
  !!timeSpan.resource_state &&
  [ResourceState.OPEN, ResourceState.NO_OPENING_HOURS].includes(
    timeSpan.resource_state
  );

const TimeSpanState = ({
  language,
  resourceStates,
  timeSpan,
}: {
  language: Language;
  resourceStates: TranslatedApiChoice[];
  timeSpan?: TTimeSpan;
}): JSX.Element | null => {
  if (!timeSpan) {
    return <>Tuntematon</>;
  }

  if (shouldHideState(timeSpan)) {
    return null;
  }

  return (
    <>
      {resourceStates.find((state) => state.value === timeSpan.resource_state)
        ?.label[language] ?? 'Tuntematon'}
    </>
  );
};

const emptyHours = '-- : --';

export const TimeSpan = ({
  idx,
  resourceStates,
  timeSpan,
}: {
  idx: number;
  resourceStates: TranslatedApiChoice[];
  timeSpan?: TTimeSpan;
}): JSX.Element | null => {
  const { language = Language.FI } = useAppContext();
  if (!timeSpan) {
    return null;
  }

  const hideOpeningHours = shouldHideOpeningHours(timeSpan, idx);
  const description = timeSpan.description[language];

  return (
    <span
      className={`opening-hours-preview-time-span-container${
        hideOpeningHours
          ? ' opening-hours-preview-time-span-container--no-time-spans'
          : ''
      }`}>
      {!hideOpeningHours && (
        <span className="opening-hours-preview-time-span">
          {timeSpan?.full_day ? (
            '24h'
          ) : (
            <>
              <span className="opening-hours-preview-time-span__time">
                {timeSpan?.start_time?.substring(0, 5) || emptyHours}
              </span>
              <span>-</span>
              <span className="opening-hours-preview-time-span__time">
                {timeSpan?.end_time?.substring(0, 5) || emptyHours}
              </span>
            </>
          )}
        </span>
      )}
      <TimeSpanState
        language={language}
        resourceStates={resourceStates}
        timeSpan={timeSpan}
      />
      {description && <span>{description}</span>}
    </span>
  );
};

const TimeSpanRow = ({
  className,
  idx,
  label,
  resourceStates,
  timeSpan,
}: {
  className: string;
  idx: number;
  label?: string;
  resourceStates: TranslatedApiChoice[];
  timeSpan?: TTimeSpan;
}): JSX.Element => (
  <tr className={className}>
    <td className="opening-hours-preview-table__day-column">{label}</td>
    <td
      className={`opening-hours-preview-table__time-span-column ${
        className ?? ''
      }`}>
      <TimeSpan idx={idx} resourceStates={resourceStates} timeSpan={timeSpan} />
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
            {previewRow.rule.type === 'week_every' ? null : (
              <caption className="opening-hours-preview-table__caption">
                {uiRuleLabels[previewRow.rule.type][language]}
              </caption>
            )}
            <thead className="opening-hours-preview-table__header visually-hidden">
              <tr>
                <th
                  className="opening-hours-preview-table__day-column"
                  scope="col">
                  Päivä
                </th>
                <th
                  className="opening-hours-preview-table__time-span-column"
                  scope="col">
                  Aukioloaika
                </th>
              </tr>
            </thead>
            <tbody>
              {previewRow.openingHours.map((openingHour, openingHourIdx) =>
                openingHour.timeSpans.map((timeSpan, timeSpanIdx) => (
                  <TimeSpanRow
                    key={`time-span-row-${timeSpanIdx}`}
                    className={
                      openingHourIdx % 2 === 0
                        ? 'time-span-row--odd'
                        : 'time-span-row--even'
                    }
                    idx={timeSpanIdx}
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
                ))
              )}
            </tbody>
          </table>
        )
      )}
    </>
  );
};

export default OpeningHoursPreview;
