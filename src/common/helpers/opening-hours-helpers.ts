import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import { partition } from 'lodash';
import {
  defaultNoOpeningHoursTimeSpanGroup,
  defaultTimeSpanGroup,
  defaultRule,
} from '../../constants';
import { Holiday } from '../../services/holidays';
import {
  ApiDatePeriod,
  GroupRule,
  OpeningHours,
  DatePeriod,
  TimeSpan,
  TimeSpanGroup,
  ResourceState,
  Rule,
  ApiTimeSpan,
  ApiTimeSpanGroup,
  Weekdays,
  RuleType,
  Language,
} from '../lib/types';
import { getEnabledWeekdays } from '../utils/date-time/date-time';
import {
  formatDate,
  transformDateToApiFormat,
} from '../utils/date-time/format';
import { updateOrAdd } from '../utils/fp/list';

export const byWeekdays = (
  openingHours1: { weekdays: number[] },
  openingHours2: { weekdays: number[] }
): number => {
  const day1 = [...openingHours1.weekdays].sort((a, b) => a - b)[0];
  const day2 = [...openingHours2.weekdays].sort((a, b) => a - b)[0];

  return day1 - day2;
};

const toApiTimeSpan =
  (group: number | undefined, days: number[]) =>
  (timeSpan: TimeSpan): ApiTimeSpan => ({
    id: timeSpan.id,
    description: timeSpan.description,
    end_time: (!timeSpan.full_day && timeSpan.end_time) || null,
    full_day: timeSpan.full_day,
    group,
    resource_state: timeSpan.resource_state,
    start_time: (!timeSpan.full_day && timeSpan.start_time) || null,
    weekdays: days,
    end_time_on_next_day:
      (timeSpan.start_time &&
        timeSpan.end_time &&
        timeSpan.start_time > timeSpan.end_time) ||
      false,
  });

const frequencyModifierMap: { [key in RuleType]: string } = {
  week_every: 'every',
  week_even: 'even',
  week_odd: 'odd',
};

const timeSpanGroupToApiRule = ({ rule }: TimeSpanGroup): GroupRule => ({
  id: rule.id,
  group: rule.group,
  context: 'year',
  subject: 'week',
  frequency_ordinal: null,
  frequency_modifier: frequencyModifierMap[rule.type],
});

export const toApiTimeSpanGroups = (
  datePeriod: DatePeriod
): ApiTimeSpanGroup[] =>
  datePeriod.openingHours.reduce(
    (result: ApiTimeSpanGroup[], openingHour: OpeningHours) =>
      openingHour.timeSpanGroups.reduce(
        (
          apiTimeSpanGroups: ApiTimeSpanGroup[],
          uiTimeSpanGroup: TimeSpanGroup
        ) =>
          updateOrAdd(
            (apiTimeSpanGroup) => {
              const rule = timeSpanGroupToApiRule(uiTimeSpanGroup);

              return (
                (apiTimeSpanGroup.rules.length === 0 &&
                  rule.frequency_modifier === 'every') ||
                apiTimeSpanGroup.rules[0]?.frequency_modifier ===
                  rule.frequency_modifier
              );
            },
            (apiTimeSpanGroup) => ({
              ...apiTimeSpanGroup,
              time_spans: [
                ...apiTimeSpanGroup.time_spans,
                ...uiTimeSpanGroup.timeSpans.map(
                  toApiTimeSpan(apiTimeSpanGroup.id, openingHour.weekdays)
                ),
              ],
            }),
            {
              id: uiTimeSpanGroup.rule.group,
              rules:
                uiTimeSpanGroup.rule.type === 'week_every'
                  ? []
                  : [timeSpanGroupToApiRule(uiTimeSpanGroup)],
              period: datePeriod.id,
              time_spans: uiTimeSpanGroup.timeSpans.map(
                toApiTimeSpan(uiTimeSpanGroup.rule.group, openingHour.weekdays)
              ),
            },
            apiTimeSpanGroups
          ),
        result
      ),
    []
  );

export const datePeriodToApiDatePeriod = (
  resource: number,
  datePeriod: DatePeriod
): ApiDatePeriod => ({
  name: datePeriod.name,
  end_date:
    datePeriod.fixed && datePeriod.endDate
      ? transformDateToApiFormat(datePeriod.endDate)
      : null,
  id: datePeriod.id,
  description: {
    en: null,
    fi: null,
    sv: null,
  },
  override: datePeriod.override,
  resource,
  start_date: datePeriod.startDate
    ? transformDateToApiFormat(datePeriod.startDate)
    : null,
  time_span_groups: toApiTimeSpanGroups(datePeriod),
  ...(datePeriod.resourceState
    ? { resource_state: datePeriod.resourceState }
    : {}),
});

const weekDaysMatch = (weekdays1: Weekdays, weekdays2: Weekdays): boolean =>
  weekdays1.every((weekday) => weekdays2.includes(weekday));

export const apiTimeSpanToTimeSpan = (timeSpan: ApiTimeSpan): TimeSpan => ({
  id: timeSpan.id,
  description: timeSpan.description,
  end_time: timeSpan.end_time ? timeSpan.end_time.substring(0, 5) : null,
  full_day:
    timeSpan.resource_state === ResourceState.CLOSED
      ? false
      : timeSpan.full_day,
  resource_state: timeSpan.resource_state,
  start_time: timeSpan.start_time ? timeSpan.start_time.substring(0, 5) : null,
});

const apiRuleToRuleType = (apiRule: GroupRule): RuleType => {
  if (apiRule && apiRule.context === 'year' && apiRule.subject === 'week') {
    switch (apiRule.frequency_modifier) {
      case 'even':
        return 'week_even';
      case 'odd':
        return 'week_odd';
      default:
        console.error(
          `Invalid frequency modifier ${apiRule.frequency_modifier}. Defaulting to every week`
        );
        return 'week_every';
    }
  }

  if (apiRule) {
    console.error(
      `Invalid api rule ${JSON.stringify(apiRule)}. Defaulting to every week`
    );
  }
  return 'week_every';
};

const apiRulesToRule = (apiTimeSpanGroup: ApiTimeSpanGroup): Rule => {
  const apiRule = apiTimeSpanGroup.rules[0];

  if (!apiRule) {
    return {
      id: undefined,
      group: apiTimeSpanGroup.id,
      type: 'week_every',
    };
  }

  return {
    id: apiRule.id,
    group: apiTimeSpanGroup.id,
    type: apiRuleToRuleType(apiRule),
  };
};

const apiTimeSpanGroupsToOpeningHours = (
  timeSpanGroups: ApiTimeSpanGroup[]
): OpeningHours[] =>
  // Go through time span groups to start mapping them to opening hours. We have to go deep to the time span level.
  timeSpanGroups
    .reduce(
      (allOpeningHours: OpeningHours[], apiTimeSpanGroup: ApiTimeSpanGroup) =>
        // Go thru time spans in time span group to find matching weekdays
        apiTimeSpanGroup.time_spans.reduce(
          (openingHours, timeSpan) =>
            updateOrAdd(
              // Match  openings hours with same weekdays
              (openingHour) =>
                weekDaysMatch(openingHour.weekdays, timeSpan.weekdays ?? []),
              // If opening hours are found go thru opening hour's time span groups
              (openingHour) => ({
                ...openingHour,
                timeSpanGroups: updateOrAdd(
                  // Match time span groups with same rule
                  (timeSpanGroup) =>
                    apiRulesToRule(apiTimeSpanGroup).type ===
                    timeSpanGroup.rule.type,
                  // Add time span to matching time span group
                  (timeSpanGroup) => ({
                    ...timeSpanGroup,
                    timeSpans: [
                      ...timeSpanGroup.timeSpans,
                      apiTimeSpanToTimeSpan(timeSpan),
                    ],
                  }),
                  // If no matching time span group found add new item to arr.
                  {
                    rule: apiRulesToRule(apiTimeSpanGroup),
                    timeSpans: [apiTimeSpanToTimeSpan(timeSpan)],
                  },
                  openingHour.timeSpanGroups
                ),
              }),
              // If no matching opening hours is found add new item to arr.
              {
                weekdays: timeSpan.weekdays ?? [],
                timeSpanGroups: [
                  {
                    rule: apiRulesToRule(apiTimeSpanGroup),
                    timeSpans: [apiTimeSpanToTimeSpan(timeSpan)],
                  },
                ],
              },
              openingHours
            ),
          allOpeningHours
        ),
      []
    )
    .sort(byWeekdays);

export const apiDatePeriodToDatePeriod = (
  datePeriod: ApiDatePeriod
): DatePeriod => ({
  name: datePeriod.name,
  endDate: datePeriod.end_date ? formatDate(datePeriod.end_date) : null,
  fixed:
    (!!datePeriod.start_date && !!datePeriod.end_date) || !!datePeriod.end_date,
  startDate: datePeriod.start_date ? formatDate(datePeriod.start_date) : null,
  openingHours: apiTimeSpanGroupsToOpeningHours(datePeriod.time_span_groups),
  id: datePeriod.id,
  resourceState: datePeriod.resource_state,
  override: datePeriod.override,
});

const isWithinRange = (date: string, datePeriod: DatePeriod): boolean =>
  (datePeriod.startDate == null ||
    transformDateToApiFormat(datePeriod.startDate) <= date) &&
  (datePeriod.endDate == null ||
    transformDateToApiFormat(datePeriod.endDate) >= date);

const toTimeWithDefault = (
  uiDate: string | null,
  defaultUiDate: string
): number =>
  new Date(transformDateToApiFormat(uiDate ?? defaultUiDate)).getTime();

const getTimeRange = (datePeriod: DatePeriod) =>
  toTimeWithDefault(datePeriod.endDate, '31.12.2045') -
  toTimeWithDefault(datePeriod.startDate, '01.01.1975');

const dateRangeIsShorter = (
  other: DatePeriod,
  datePeriod: DatePeriod
): boolean => getTimeRange(datePeriod) < getTimeRange(other);

const getShortestDatePeriod = (dates: DatePeriod[]): DatePeriod | undefined =>
  dates.reduce((acc: DatePeriod, current: DatePeriod) => {
    if (!acc || dateRangeIsShorter(acc, current)) {
      return current;
    }

    return acc;
  }, dates[0]);

export const getActiveDatePeriods = (
  date: string,
  dates: DatePeriod[]
): DatePeriod[] => {
  const [exceptions, normalDatePeriods] = partition(
    dates.filter((datePeriod) => isWithinRange(date, datePeriod)),
    (datePeriod) => datePeriod.override
  );

  if (exceptions.length) {
    const shortestDatePeriod = getShortestDatePeriod(exceptions);
    return shortestDatePeriod ? [shortestDatePeriod] : [];
  }

  return normalDatePeriods;
};

const dayInMilliseconds = 24 * 60 * 60 * 1000;

export const isHolidayOrEve = (
  datePeriod: DatePeriod,
  holidays: Holiday[]
): boolean =>
  !!datePeriod.endDate &&
  !!datePeriod.startDate &&
  !!datePeriod.override &&
  !!holidays.find(
    (holiday) =>
      !!datePeriod.endDate &&
      holiday.date === transformDateToApiFormat(datePeriod.endDate) &&
      holiday.name.fi === datePeriod.name.fi
  ) &&
  differenceInMilliseconds(
    new Date(transformDateToApiFormat(datePeriod.endDate)),
    new Date(transformDateToApiFormat(datePeriod.startDate))
  ) <= dayInMilliseconds;

export const isDescriptionAllowed = (resourceState: ResourceState): boolean =>
  resourceState !== ResourceState.NO_OPENING_HOURS;

export const areStartAndEndTimesAllowed = (
  timeSpanIdx: number,
  resourceState?: ResourceState
): boolean =>
  resourceState === undefined ||
  [ResourceState.NO_OPENING_HOURS, ResourceState.CLOSED].includes(
    resourceState
  ) === false ||
  timeSpanIdx !== 0;

const ruleTypeOrder: RuleType[] = ['week_every', 'week_even', 'week_odd'];

export const byRuleType = (a: Rule, b: Rule): number =>
  ruleTypeOrder.indexOf(a.type) - ruleTypeOrder.indexOf(b.type);

export const datePeriodToRules = (datePeriod: DatePeriod): Rule[] => {
  const result = datePeriod.openingHours
    .reduce(
      (rules: Rule[], openingHours: OpeningHours) =>
        openingHours.timeSpanGroups.reduce(
          (timeSpanGroupRules, timeSpanGroup) => {
            if (
              timeSpanGroupRules.some(
                (rule) => rule.type === timeSpanGroup.rule.type
              )
            ) {
              return timeSpanGroupRules;
            }

            return [...timeSpanGroupRules, timeSpanGroup.rule];
          },
          rules
        ),
      []
    )
    .sort(byRuleType);

  return ruleTypeOrder.map(
    (ruleType) =>
      result.find((rule) => rule.type === ruleType) || {
        id: undefined,
        group: undefined,
        type: ruleType,
      }
  );
};

export const getDatePeriodName = (
  language: Language,
  datePeriod: DatePeriod
): string => {
  const name = datePeriod.name[language];
  if (name) {
    return name;
  }

  if (datePeriod.override) {
    switch (language) {
      case Language.FI:
        return 'Poikkeava aukiolo';
      case Language.SV:
        return 'Ovanliga öppettider';
      default:
        return 'Exceptional opening hours';
    }
  }
  switch (language) {
    case Language.FI:
      return 'Normaali aukiolo';
    case Language.SV:
      return 'Normala öppettider';
    default:
      return 'Normal opening hours';
  }
};

const updateWeekdays =
  (enabledWeekdays: number[]) =>
  (openingHours: OpeningHours): OpeningHours => ({
    ...openingHours,
    weekdays: openingHours.weekdays.filter((d: number) =>
      enabledWeekdays.includes(d)
    ),
  });

const hasWeekdays = (openingHours: OpeningHours) =>
  openingHours.weekdays.length > 0;

const hasWeekday = (weekday: number) => (openingHours: OpeningHours) =>
  openingHours.weekdays.includes(weekday);

export const alignOpeningHoursWeekdaysToDateRange = (
  openingHours: OpeningHours[],
  startDate: string | null,
  endDate: string | null
): OpeningHours[] => {
  const enabledWeekdays = getEnabledWeekdays(startDate, endDate);

  if (enabledWeekdays.length === 0) {
    return openingHours;
  }

  const updatedOpeningHours = openingHours
    .map(updateWeekdays(enabledWeekdays))
    .filter(hasWeekdays);

  const nonFoundWeekdays = enabledWeekdays.filter(
    (weekday) => !updatedOpeningHours.some(hasWeekday(weekday))
  );

  if (updatedOpeningHours.length > 0) {
    return updatedOpeningHours.reduce((acc, elem, idx) => {
      if (idx === 0) {
        return [
          {
            ...elem,
            // Adds previously non found weekdays to the first row
            weekdays: [...elem.weekdays, ...nonFoundWeekdays].sort(
              (a, b) => a - b
            ),
          },
          // And keeps rest as is
          ...acc.slice(1),
        ];
      }
      return acc;
    }, updatedOpeningHours);
  }

  if (openingHours.length === 1) {
    return [{ ...openingHours[0], weekdays: nonFoundWeekdays }];
  }

  return [
    {
      weekdays: nonFoundWeekdays,
      timeSpanGroups: [defaultTimeSpanGroup],
    },
  ];
};

type SelectResult = {
  updated: {
    idx: number;
    weekdays: number[];
  }[];
};

type SelectWeekdayResult = SelectResult & {
  removed?: number;
};

type UnselectWeekdayResult = SelectResult & {
  added?: { idx: number; value: OpeningHours };
};

const addWeekday = (
  weekday: number,
  openingHours: OpeningHours
): OpeningHours => ({
  ...openingHours,
  weekdays: [...openingHours.weekdays, weekday],
});

const removeWeekday = (
  weekday: number,
  openingHours: OpeningHours
): OpeningHours => ({
  ...openingHours,
  weekdays: openingHours.weekdays.filter((d) => d !== weekday),
});

const setSelected = (
  openingHours: OpeningHours[],
  weekday: number,
  row: number
): SelectWeekdayResult => {
  const result: SelectWeekdayResult = {
    updated: [],
  };
  const curr = openingHours[row];

  if (curr.weekdays.includes(weekday)) {
    return result;
  }

  result.updated = [{ idx: row, weekdays: addWeekday(weekday, curr).weekdays }];

  const prevIdx = openingHours.findIndex((o) => o.weekdays.includes(weekday));
  if (prevIdx >= 0) {
    const prev = removeWeekday(weekday, openingHours[prevIdx]);
    if (prev.weekdays.length === 0) {
      result.removed = prevIdx;
    } else {
      result.updated = [
        ...result.updated,
        { idx: prevIdx, weekdays: prev.weekdays },
      ];
    }
  }

  return result;
};

const setUnselected = (
  openingHours: OpeningHours[],
  weekday: number,
  row: number
): UnselectWeekdayResult => {
  const result: UnselectWeekdayResult = { updated: [] };
  const curr = openingHours[row];

  if (curr.weekdays.length === 1) {
    return result;
  }

  result.updated = [
    { idx: row, weekdays: removeWeekday(weekday, curr).weekdays },
  ];

  result.added = {
    idx: row + 1,
    value: {
      weekdays: [weekday],
      timeSpanGroups: [defaultNoOpeningHoursTimeSpanGroup],
    },
  };

  return result;
};

/**
 * Helper function for managing opening hours rows
 *
 * It returns a result of which rows should be updated
 * with which data, which rows should be deleted and which
 * one added depending on if a weekday is selected on unselected.
 */
export const updateWeekday = (
  openingHours: OpeningHours[],
  weekday: number,
  select: boolean,
  row: number
): SelectWeekdayResult | UnselectWeekdayResult =>
  select
    ? setSelected(openingHours, weekday, row)
    : setUnselected(openingHours, weekday, row);
type UpdateRuleResult = {
  updated: { idx: number; value: Rule }[];
  removed?: number;
  added?: TimeSpanGroup;
};

const counterparts: {
  [key in RuleType]: RuleType;
} = {
  week_even: 'week_odd',
  week_odd: 'week_even',
  week_every: 'week_every',
};

const toValue = (ruleValues: Rule[], ruleType: RuleType) =>
  ruleValues.find((elem) => elem.type === ruleType) || defaultRule;

export const updateRule = (
  ruleValues: Rule[],
  timeSpanGroups: TimeSpanGroup[],
  rule: RuleType,
  idx: number
): UpdateRuleResult => {
  let result: UpdateRuleResult = {
    updated: [],
  };

  if (timeSpanGroups[idx].rule.type === rule) {
    return result;
  }

  result.updated = [{ idx, value: toValue(ruleValues, rule) }];

  if (rule === 'week_every') {
    if (timeSpanGroups.length > 1) {
      result.removed = idx ? 0 : 1;
    }
    return result;
  }

  if (timeSpanGroups.length > 1) {
    result = {
      ...result,
      updated: [
        ...result.updated,
        {
          idx: idx ? 0 : 1,
          value: toValue(ruleValues, counterparts[rule]),
        },
      ],
    };
  } else {
    result.added = {
      ...defaultTimeSpanGroup,
      rule: toValue(ruleValues, counterparts[rule]),
    };
  }

  return result;
};
