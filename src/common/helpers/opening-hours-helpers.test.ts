import {
  defaultNoOpeningHoursTimeSpanGroup,
  defaultTimeSpanGroup,
} from '../../constants';
import { DatePeriod, OpeningHours, ResourceState } from '../lib/types';
import {
  apiDatePeriodToDatePeriod,
  datePeriodToApiDatePeriod,
  datePeriodToRules,
  getActiveDatePeriods,
  alignOpeningHoursWeekdaysToDateRange,
  isHolidayOrEve,
  updateRule,
  updateWeekday,
} from './opening-hours-helpers';

const openingHours: OpeningHours[] = [
  {
    weekdays: [1, 2, 3, 4, 5],
    timeSpanGroups: [
      {
        rule: { id: undefined, group: 1, type: 'week_every' },
        timeSpans: [
          {
            id: 1,
            description: { en: null, fi: null, sv: null },
            end_time: '16:00',
            full_day: false,
            resource_state: ResourceState.OPEN,
            start_time: '08:00',
          },
          {
            id: 2,
            description: { en: null, fi: null, sv: null },
            end_time: '17:00',
            full_day: false,
            resource_state: ResourceState.SELF_SERVICE,
            start_time: '16:00',
          },
        ],
      },
    ],
  },
  {
    weekdays: [6],
    timeSpanGroups: [
      {
        rule: { id: 2, group: 2, type: 'week_even' },
        timeSpans: [
          {
            id: 3,
            description: { en: null, fi: null, sv: null },
            end_time: '16:00',
            full_day: false,
            resource_state: ResourceState.OPEN,
            start_time: '10:00',
          },
          {
            id: 4,
            description: { en: null, fi: null, sv: null },
            end_time: null,
            full_day: false,
            resource_state: ResourceState.CLOSED,
            start_time: null,
          },
        ],
      },
      {
        rule: { id: 3, group: 3, type: 'week_odd' },
        timeSpans: [
          {
            id: 5,
            description: { en: null, fi: null, sv: null },
            end_time: '16:00',
            full_day: false,
            resource_state: ResourceState.OPEN,
            start_time: '10:00',
          },
        ],
      },
    ],
  },
  {
    weekdays: [7],
    timeSpanGroups: [
      {
        rule: { id: undefined, group: 1, type: 'week_every' },
        timeSpans: [
          {
            id: 6,
            description: { en: null, fi: null, sv: null },
            end_time: null,
            full_day: false,
            resource_state: ResourceState.OPEN,
            start_time: null,
          },
        ],
      },
    ],
  },
];

const apiDatePeriod = {
  id: 1,
  end_date: '2022-12-31',
  name: { en: null, fi: 'Normaali aukiolo', sv: null },
  description: { en: null, fi: null, sv: null },
  override: false,
  resource: 8414,
  start_date: '2022-06-06',
  time_span_groups: [
    {
      id: 1,
      period: 1,
      rules: [],
      time_spans: [
        {
          id: 1,
          group: 1,
          end_time: '16:00',
          full_day: false,
          resource_state: ResourceState.OPEN,
          start_time: '08:00',
          weekdays: [1, 2, 3, 4, 5],
          end_time_on_next_day: false,
          description: { en: null, fi: null, sv: null },
        },
        {
          id: 2,
          group: 1,
          end_time: '17:00',
          full_day: false,
          resource_state: ResourceState.SELF_SERVICE,
          start_time: '16:00',
          weekdays: [1, 2, 3, 4, 5],
          end_time_on_next_day: false,
          description: { en: null, fi: null, sv: null },
        },
        {
          id: 6,
          group: 1,
          end_time: null,
          full_day: false,
          resource_state: ResourceState.OPEN,
          start_time: null,
          weekdays: [7],
          end_time_on_next_day: false,
          description: { en: null, fi: null, sv: null },
        },
      ],
    },
    {
      id: 2,
      period: 1,
      rules: [
        {
          id: 2,
          group: 2,
          context: 'year',
          subject: 'week',
          frequency_modifier: 'even',
          frequency_ordinal: null,
        },
      ],
      time_spans: [
        {
          id: 3,
          group: 2,
          end_time: '16:00',
          full_day: false,
          resource_state: ResourceState.OPEN,
          start_time: '10:00',
          weekdays: [6],
          end_time_on_next_day: false,
          description: { en: null, fi: null, sv: null },
        },
        {
          id: 4,
          group: 2,
          end_time_on_next_day: false,
          end_time: null,
          full_day: false,
          resource_state: ResourceState.CLOSED,
          start_time: null,
          weekdays: [6],
          description: { en: null, fi: null, sv: null },
        },
      ],
    },
    {
      id: 3,
      period: 1,
      rules: [
        {
          id: 3,
          group: 3,
          context: 'year',
          subject: 'week',
          frequency_modifier: 'odd',
          frequency_ordinal: null,
        },
      ],
      time_spans: [
        {
          id: 5,
          group: 3,
          end_time: '16:00',
          full_day: false,
          resource_state: ResourceState.OPEN,
          start_time: '10:00',
          weekdays: [6],
          end_time_on_next_day: false,
          description: { en: null, fi: null, sv: null },
        },
      ],
    },
  ],
};

const datePeriod: DatePeriod = {
  id: 1,
  name: { en: null, fi: 'Normaali aukiolo', sv: null },
  endDate: '31.12.2022',
  fixed: true,
  startDate: '6.6.2022',
  openingHours: [
    {
      weekdays: [1, 2, 3, 4, 5],
      timeSpanGroups: [
        {
          rule: { id: undefined, group: 1, type: 'week_every' },
          timeSpans: [
            {
              description: { en: null, fi: null, sv: null },
              end_time: '16:00',
              full_day: false,
              resource_state: ResourceState.OPEN,
              start_time: '08:00',
            },
            {
              description: { en: null, fi: null, sv: null },
              end_time: '17:00',
              full_day: false,
              resource_state: ResourceState.SELF_SERVICE,
              start_time: '16:00',
            },
          ],
        },
      ],
    },
    {
      weekdays: [6],
      timeSpanGroups: [
        {
          rule: { id: 1, group: 2, type: 'week_even' },
          timeSpans: [
            {
              description: { en: null, fi: null, sv: null },
              end_time: '16:00',
              full_day: false,
              resource_state: ResourceState.OPEN,
              start_time: '10:00',
            },
            {
              description: { en: null, fi: null, sv: null },
              end_time: null,
              full_day: false,
              resource_state: ResourceState.CLOSED,
              start_time: null,
            },
          ],
        },
        {
          rule: { id: 1, group: 3, type: 'week_odd' },
          timeSpans: [
            {
              description: { en: null, fi: null, sv: null },
              end_time: '16:00',
              full_day: false,
              resource_state: ResourceState.OPEN,
              start_time: '10:00',
            },
          ],
        },
      ],
    },
    {
      weekdays: [7],
      timeSpanGroups: [
        {
          rule: {
            id: undefined,
            group: 1,
            type: 'week_every',
          },
          timeSpans: [
            {
              description: { en: null, fi: null, sv: null },
              end_time: null,
              full_day: false,
              resource_state: ResourceState.OPEN,
              start_time: null,
            },
          ],
        },
      ],
    },
  ],
  override: false,
};

const datePeriods: DatePeriod[] = [
  {
    name: { fi: 'Normaaliaukiolo', sv: '', en: '' },
    endDate: '31.12.2022',
    fixed: true,
    startDate: '01.01.2022',
    openingHours: [
      {
        weekdays: [1, 2, 3, 4, 5],
        timeSpanGroups: [
          {
            rule: { type: 'week_every' },
            timeSpans: [
              {
                id: 890209,
                description: { fi: null, sv: null, en: null },
                end_time: null,
                full_day: false,
                resource_state: ResourceState.OPEN,
                start_time: null,
              },
            ],
          },
        ],
      },
      {
        weekdays: [6, 7],
        timeSpanGroups: [
          {
            rule: { type: 'week_every' },
            timeSpans: [
              {
                id: 890210,
                description: { fi: null, sv: null, en: null },
                end_time: null,
                full_day: false,
                resource_state: ResourceState.CLOSED,
                start_time: null,
              },
            ],
          },
        ],
      },
    ],
    id: 1041529,
    resourceState: ResourceState.UNDEFINED,
    override: false,
  },
  {
    name: { fi: 'Kesäkuun aukiolot', sv: '', en: '' },
    endDate: '30.06.2022',
    fixed: true,
    startDate: '01.06.2022',
    openingHours: [
      {
        weekdays: [1, 2, 3, 4, 5],
        timeSpanGroups: [
          {
            rule: { type: 'week_every' },
            timeSpans: [
              {
                id: 890207,
                description: { fi: null, sv: null, en: null },
                end_time: '15:00',
                full_day: false,
                resource_state: ResourceState.OPEN,
                start_time: '10:00',
              },
            ],
          },
        ],
      },
      {
        weekdays: [6, 7],
        timeSpanGroups: [
          {
            rule: { type: 'week_every' },
            timeSpans: [
              {
                id: 890208,
                description: { fi: null, sv: null, en: null },
                end_time: null,
                full_day: false,
                resource_state: ResourceState.CLOSED,
                start_time: null,
              },
            ],
          },
        ],
      },
    ],
    id: 1039083,
    resourceState: ResourceState.UNDEFINED,
    override: false,
  },
  {
    name: { fi: 'Juhannus', sv: '', en: '' },
    endDate: '24.06.2022',
    fixed: true,
    startDate: '24.06.2022',
    openingHours: [
      {
        weekdays: [5],
        timeSpanGroups: [
          {
            rule: { type: 'week_every' },
            timeSpans: [
              {
                id: 889998,
                description: { fi: null, sv: null, en: null },
                end_time: null,
                full_day: true,
                resource_state: ResourceState.CLOSED,
                start_time: null,
              },
            ],
          },
        ],
      },
    ],
    id: 1039084,
    resourceState: ResourceState.UNDEFINED,
    override: true,
  },
  {
    name: { fi: 'Heinäkuun aukiolot', sv: '', en: '' },
    endDate: '31.07.2022',
    fixed: true,
    startDate: '01.07.2022',
    openingHours: [
      {
        weekdays: [1, 2, 3, 4, 5],
        timeSpanGroups: [
          {
            rule: { type: 'week_every' },
            timeSpans: [
              {
                id: 889630,
                description: { fi: null, sv: null, en: null },
                end_time: null,
                full_day: false,
                resource_state: ResourceState.OPEN,
                start_time: null,
              },
            ],
          },
        ],
      },
      {
        weekdays: [6, 7],
        timeSpanGroups: [
          {
            rule: { type: 'week_every' },
            timeSpans: [
              {
                id: 889631,
                description: { fi: null, sv: null, en: null },
                end_time: null,
                full_day: false,
                resource_state: ResourceState.CLOSED,
                start_time: null,
              },
            ],
          },
        ],
      },
    ],
    id: 1041197,
    resourceState: ResourceState.UNDEFINED,
    override: false,
  },
  {
    name: { fi: 'Remontti', sv: '', en: '' },
    endDate: '19.05.2023',
    fixed: true,
    startDate: '15.05.2023',
    openingHours: [
      {
        weekdays: [1, 2, 3, 4, 5, 6, 7],
        timeSpanGroups: [
          {
            rule: { type: 'week_every' },
            timeSpans: [
              {
                id: 889998,
                description: { fi: null, sv: null, en: null },
                end_time: null,
                full_day: true,
                resource_state: ResourceState.CLOSED,
                start_time: null,
              },
            ],
          },
        ],
      },
    ],
    id: 1039078,
    resourceState: ResourceState.UNDEFINED,
    override: true,
  },
  {
    name: { fi: 'Helatorstai', sv: '', en: '' },
    endDate: '18.05.2023',
    fixed: true,
    startDate: '18.05.2023',
    openingHours: [
      {
        weekdays: [4],
        timeSpanGroups: [
          {
            rule: { type: 'week_every' },
            timeSpans: [
              {
                id: 889998,
                description: { fi: null, sv: null, en: null },
                end_time: null,
                full_day: true,
                resource_state: ResourceState.CLOSED,
                start_time: null,
              },
            ],
          },
        ],
      },
    ],
    id: 1039079,
    resourceState: ResourceState.UNDEFINED,
    override: true,
  },
];

describe('opening-hours-helpers', () => {
  describe('openingHoursToApiDatePeriod', () => {
    it('should map to correct data', () => {
      expect(
        datePeriodToApiDatePeriod(8414, {
          endDate: '31.12.2022',
          fixed: true,
          name: { fi: 'Normaali aukiolo', sv: null, en: null },
          openingHours,
          id: 1,
          override: false,
          startDate: '6.6.2022',
        })
      ).toEqual(apiDatePeriod);
    });

    it('should map to correct data', () => {
      expect(
        datePeriodToApiDatePeriod(8414, {
          endDate: '31.12.2022',
          fixed: true,
          name: { fi: 'Normaali aukiolo', sv: null, en: null },
          openingHours,
          id: 1,
          startDate: '6.6.2022',
          override: true,
        })
      ).toEqual({ ...apiDatePeriod, override: true });
    });
  });

  describe('apiDatePeriodToOpeningHours', () => {
    it('should map to correct data', () => {
      expect(apiDatePeriodToDatePeriod(apiDatePeriod)).toEqual({
        endDate: '31.12.2022',
        fixed: true,
        name: { fi: 'Normaali aukiolo', sv: null, en: null },
        openingHours,
        startDate: '6.6.2022',
        id: 1,
        override: false,
        resourceState: undefined,
      });
    });
  });

  describe('getActiveDatePeriods', () => {
    it('should return one date period', () => {
      expect(
        getActiveDatePeriods('2022-03-23', datePeriods).map((d) => d.id)
      ).toEqual([1041529]);
    });

    it('should return two overlapping date periods', () => {
      expect(
        getActiveDatePeriods('2022-06-20', datePeriods).map((d) => d.id)
      ).toEqual([1041529, 1039083]);
    });

    it('should return one exceptional date period', () => {
      expect(
        getActiveDatePeriods('2022-06-24', datePeriods).map((d) => d.id)
      ).toEqual([1039084]);
    });

    it('should return shortest exceptional date period in case of overlapping exceptional ones', () => {
      expect(
        getActiveDatePeriods('2023-05-18', datePeriods).map((d) => d.id)
      ).toEqual([1039079]);
    });
  });

  describe('isHoliday', () => {
    const holidays = [
      {
        date: '2022-12-31',
        end_date: '2022-12-31',
        name: {
          fi: 'Uudenvuodenaatto',
          sv: 'Nyårsafton',
          en: "New Year's Eve",
        },
        start_date: '2022-12-31',
        official: true,
      },
      {
        date: '2023-01-01',
        end_date: '2023-01-01',
        name: {
          fi: 'Uudenvuodenpäiväs',
          sv: 'Nyårsdagen',
          en: "New Year's Day",
        },
        start_date: '2022-12-31',
        official: true,
      },
    ];

    it('should return true when datePeriod is override and matches with holiday', () => {
      expect(
        isHolidayOrEve(
          {
            ...datePeriod,
            startDate: '31.12.2022',
            endDate: '31.12.2022',
            name: {
              fi: 'Uudenvuodenaatto',
              sv: 'Nyårsafton',
              en: "New Year's Eve",
            },
            override: true,
          },
          holidays
        )
      ).toBe(true);
    });

    it('should return false when datePeriod is override but the range does not match with holiday', () => {
      expect(
        isHolidayOrEve(
          {
            ...datePeriod,
            startDate: '25.12.2022',
            endDate: '31.12.2022',
            name: {
              fi: 'Uudenvuodenaatto',
              sv: 'Nyårsafton',
              en: "New Year's Eve",
            },
            override: true,
          },
          holidays
        )
      ).toBe(false);
    });

    it('should return false when datePeriod is override and name does not match with holiday', () => {
      expect(
        isHolidayOrEve(
          {
            ...datePeriod,
            startDate: '31.12.2022',
            endDate: '31.12.2022',
            name: { fi: 'Talvi', sv: '', en: '' },
            override: true,
          },
          holidays
        )
      ).toBe(false);
    });
  });

  describe('datePeriodToRules', () => {
    it('should return correct rules ', () => {
      expect(datePeriodToRules(datePeriod)).toMatchInlineSnapshot(`
        [
          {
            "group": 1,
            "id": undefined,
            "type": "week_every",
          },
          {
            "group": 2,
            "id": 1,
            "type": "week_even",
          },
          {
            "group": 3,
            "id": 1,
            "type": "week_odd",
          },
        ]
      `);
    });
  });

  describe('alignOpeningHoursWeekdaysToDateRange', () => {
    it('should return opening hours as is when the date range is one week', () => {
      expect(
        alignOpeningHoursWeekdaysToDateRange(
          openingHours,
          '16.01.2023',
          '22.01.2023'
        )
      ).toEqual(openingHours);
    });

    it('should return opening hours as is when the date range is way over week', () => {
      expect(
        alignOpeningHoursWeekdaysToDateRange(
          openingHours,
          '12.01.2023',
          '29.01.2023'
        )
      ).toEqual(openingHours);
    });

    it('should drop out Sunday when the date range is less than week', () => {
      expect(
        alignOpeningHoursWeekdaysToDateRange(
          openingHours,
          '16.01.2023',
          '21.01.2023'
        )
      ).toEqual(openingHours.slice(0, 2));
    });

    it('should drop out Monday, Tuesday, Saturday and Sunday when the date range starts from the middle', () => {
      let expectedOpeningHours = openingHours.slice(0, 2);
      expectedOpeningHours = [
        {
          ...expectedOpeningHours[0],
          weekdays: [3, 4, 5],
        },
      ];
      expect(
        alignOpeningHoursWeekdaysToDateRange(
          openingHours,
          '18.01.2023',
          '20.01.2023'
        )
      ).toEqual(expectedOpeningHours);
    });

    it('should add Monday and Tuesday to first row when previously the date range was less than a week', () => {
      const prevOpeningHours = [
        {
          ...openingHours[0],
          weekdays: [3, 4, 5],
        },
        ...openingHours.slice(1),
      ];
      expect(
        alignOpeningHoursWeekdaysToDateRange(
          prevOpeningHours,
          '16.01.2023',
          '22.01.2023'
        )
      ).toEqual(openingHours);
    });

    it('should return default time span group with all the weekdays when there were no previously existing opening hours', () => {
      expect(
        alignOpeningHoursWeekdaysToDateRange([], '16.01.2023', '22.01.2023')
      ).toEqual([
        {
          timeSpanGroups: [defaultTimeSpanGroup],
          weekdays: [1, 2, 3, 4, 5, 6, 7],
        },
      ]);
    });

    it('should return default time span group with all the days in range when there were no previously existing opening hours', () => {
      expect(
        alignOpeningHoursWeekdaysToDateRange([], '17.01.2023', '20.01.2023')
      ).toEqual([
        {
          timeSpanGroups: [defaultTimeSpanGroup],
          weekdays: [2, 3, 4, 5],
        },
      ]);
    });

    it('should return opening hours as is when end date is before start date', () => {
      expect(
        alignOpeningHoursWeekdaysToDateRange(
          openingHours,
          '17.01.2023',
          '15.01.2023'
        )
      ).toEqual(openingHours);
    });
  });
});

describe('updateWeekday', () => {
  it('should add new row when weekday gets unselected', () => {
    expect(updateWeekday(openingHours, 3, false, 0)).toEqual({
      updated: [
        {
          idx: 0,
          weekdays: [1, 2, 4, 5],
        },
      ],
      added: {
        idx: 1,
        value: {
          weekdays: [3],
          timeSpanGroups: [defaultNoOpeningHoursTimeSpanGroup],
        },
      },
    });
  });

  it('should remove row when its` last weekday gets selected from another row', () => {
    expect(updateWeekday(openingHours, 7, true, 1)).toEqual({
      updated: [{ idx: 1, weekdays: [6, 7] }],
      removed: 2,
    });
  });

  it('should return no updates when trying to select already selected weekday on a row', () => {
    expect(updateWeekday(openingHours, 4, true, 0)).toEqual({
      updated: [],
    });
  });

  it('should return no updates when trying to unselect the only weekday on a row', () => {
    expect(updateWeekday(openingHours, 6, true, 1)).toEqual({
      updated: [],
    });
  });
});

describe('updateRule', () => {
  it('should add new time span group when selecting week even rule', () => {
    expect(
      updateRule(
        [
          { type: 'week_every', id: undefined, group: undefined },
          { type: 'week_odd', id: undefined, group: undefined },
          { type: 'week_even', id: undefined, group: undefined },
        ],
        openingHours[0].timeSpanGroups,
        'week_even',
        0
      )
    ).toEqual({
      updated: [
        {
          idx: 0,
          value: { type: 'week_even', id: undefined, group: undefined },
        },
      ],
      added: {
        ...defaultTimeSpanGroup,
        rule: { type: 'week_odd', id: undefined, group: undefined },
      },
    });
  });

  it('should add new time span group when selecting odd week rule', () => {
    expect(
      updateRule(
        [
          { type: 'week_every', id: undefined, group: undefined },
          { type: 'week_odd', id: undefined, group: undefined },
          { type: 'week_even', id: undefined, group: undefined },
        ],
        openingHours[0].timeSpanGroups,
        'week_odd',
        0
      )
    ).toEqual({
      updated: [
        {
          idx: 0,
          value: { type: 'week_odd', id: undefined, group: undefined },
        },
      ],
      added: {
        ...defaultTimeSpanGroup,
        rule: { type: 'week_even', id: undefined, group: undefined },
      },
    });
  });

  it('should swap rules when selecting odd week rule', () => {
    expect(
      updateRule(
        [
          { type: 'week_every', id: undefined, group: undefined },
          { type: 'week_odd', id: undefined, group: undefined },
          { type: 'week_even', id: undefined, group: undefined },
        ],
        openingHours[1].timeSpanGroups,
        'week_odd',
        0
      )
    ).toEqual({
      updated: [
        {
          idx: 0,
          value: { type: 'week_odd', id: undefined, group: undefined },
        },
        {
          idx: 1,
          value: { type: 'week_even', id: undefined, group: undefined },
        },
      ],
    });
  });

  it('should swap rules when selecting week even rule', () => {
    expect(
      updateRule(
        [
          { type: 'week_every', id: undefined, group: undefined },
          { type: 'week_odd', id: undefined, group: undefined },
          { type: 'week_even', id: undefined, group: undefined },
        ],
        [
          {
            ...openingHours[1].timeSpanGroups[0],
            rule: { type: 'week_odd', id: undefined, group: undefined },
          },
          {
            ...openingHours[1].timeSpanGroups[1],
            rule: { type: 'week_even', id: undefined, group: undefined },
          },
        ],
        'week_even',
        0
      )
    ).toEqual({
      updated: [
        {
          idx: 0,
          value: { type: 'week_even', id: undefined, group: undefined },
        },
        {
          idx: 1,
          value: { type: 'week_odd', id: undefined, group: undefined },
        },
      ],
    });
  });

  it('should swap rules when selecting odd week rule', () => {
    expect(
      updateRule(
        [
          { type: 'week_every', id: undefined, group: undefined },
          { type: 'week_odd', id: undefined, group: undefined },
          { type: 'week_even', id: undefined, group: undefined },
        ],
        openingHours[1].timeSpanGroups,
        'week_odd',
        0
      )
    ).toEqual({
      updated: [
        {
          idx: 0,
          value: { type: 'week_odd', id: undefined, group: undefined },
        },
        {
          idx: 1,
          value: { type: 'week_even', id: undefined, group: undefined },
        },
      ],
    });
  });

  it('should swap rules when selecting week even rule on second row', () => {
    expect(
      updateRule(
        [
          { type: 'week_every', id: undefined, group: undefined },
          { type: 'week_odd', id: undefined, group: undefined },
          { type: 'week_even', id: undefined, group: undefined },
        ],
        [
          {
            ...openingHours[1].timeSpanGroups[0],
            rule: { type: 'week_even', id: undefined, group: undefined },
          },
          {
            ...openingHours[1].timeSpanGroups[1],
            rule: { type: 'week_odd', id: undefined, group: undefined },
          },
        ],
        'week_even',
        1
      )
    ).toEqual({
      updated: [
        {
          idx: 1,
          value: { type: 'week_even', id: undefined, group: undefined },
        },
        {
          idx: 0,
          value: { type: 'week_odd', id: undefined, group: undefined },
        },
      ],
    });
  });

  it('should swap rules when selecting week odd rule on second row', () => {
    expect(
      updateRule(
        [
          { type: 'week_every', id: undefined, group: undefined },
          { type: 'week_odd', id: undefined, group: undefined },
          { type: 'week_even', id: undefined, group: undefined },
        ],
        [
          {
            ...openingHours[1].timeSpanGroups[0],
            rule: { type: 'week_odd', id: undefined, group: undefined },
          },
          {
            ...openingHours[1].timeSpanGroups[1],
            rule: { type: 'week_even', id: undefined, group: undefined },
          },
        ],
        'week_odd',
        1
      )
    ).toEqual({
      updated: [
        {
          idx: 1,
          value: { type: 'week_odd', id: undefined, group: undefined },
        },
        {
          idx: 0,
          value: { type: 'week_even', id: undefined, group: undefined },
        },
      ],
    });
  });

  it('should delete second row when selecting week every for first row', () => {
    expect(
      updateRule(
        [
          { type: 'week_every', id: undefined, group: undefined },
          { type: 'week_odd', id: undefined, group: undefined },
          { type: 'week_even', id: undefined, group: undefined },
        ],
        [
          {
            ...openingHours[1].timeSpanGroups[0],
            rule: { type: 'week_odd', id: undefined, group: undefined },
          },
          {
            ...openingHours[1].timeSpanGroups[1],
            rule: { type: 'week_even', id: undefined, group: undefined },
          },
        ],
        'week_every',
        0
      )
    ).toEqual({
      updated: [
        {
          idx: 0,
          value: { type: 'week_every', id: undefined, group: undefined },
        },
      ],
      removed: 1,
    });
  });

  it('should delete first row when selecting week every for second row', () => {
    expect(
      updateRule(
        [
          { type: 'week_every', id: undefined, group: undefined },
          { type: 'week_odd', id: undefined, group: undefined },
          { type: 'week_even', id: undefined, group: undefined },
        ],
        [
          {
            ...openingHours[1].timeSpanGroups[0],
            rule: { type: 'week_odd', id: undefined, group: undefined },
          },
          {
            ...openingHours[1].timeSpanGroups[1],
            rule: { type: 'week_even', id: undefined, group: undefined },
          },
        ],
        'week_every',
        1
      )
    ).toEqual({
      updated: [
        {
          idx: 1,
          value: { type: 'week_every', id: undefined, group: undefined },
        },
      ],
      removed: 0,
    });
  });

  it('should return no updates when updating existing value', () => {
    expect(
      updateRule(
        [
          { type: 'week_every', id: undefined, group: undefined },
          { type: 'week_odd', id: undefined, group: undefined },
          { type: 'week_even', id: undefined, group: undefined },
        ],
        openingHours[0].timeSpanGroups,
        'week_every',
        0
      )
    ).toEqual({
      updated: [],
    });
  });
});
