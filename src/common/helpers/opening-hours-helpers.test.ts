/// <reference types="jest" />

import { ResourceState } from '../lib/types';
import {
  apiDatePeriodToFormValues,
  formValuesToApiDatePeriod,
  sortByValidity,
} from './opening-hours-helpers';

const openingHours = [
  {
    weekdays: [1, 2, 3, 4, 5],
    timeSpanGroups: [
      {
        rule: 'week_every' as const,
        timeSpans: [
          {
            description: undefined,
            end_time: '16:00',
            full_day: false,
            resource_state: ResourceState.OPEN,
            start_time: '08:00',
          },
          {
            description: undefined,
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
        rule: 'week_even' as const,
        timeSpans: [
          {
            description: undefined,
            end_time: '16:00',
            full_day: false,
            resource_state: ResourceState.OPEN,
            start_time: '10:00',
          },
          {
            description: undefined,
            end_time: null,
            full_day: true,
            resource_state: ResourceState.CLOSED,
            start_time: null,
          },
        ],
      },
      {
        rule: 'week_odd' as const,
        timeSpans: [
          {
            description: undefined,
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
        rule: 'week_every' as const,
        timeSpans: [
          {
            description: undefined,
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

const datePeriod = {
  id: undefined,
  end_date: '2022-12-31',
  name: { en: null, fi: 'Normaali aukiolo', sv: null },
  description: { en: null, fi: null, sv: null },
  override: false,
  resource: 8414,
  start_date: '2022-06-06',
  time_span_groups: [
    {
      rules: [],
      time_spans: [
        {
          end_time: '16:00',
          full_day: false,
          resource_state: ResourceState.OPEN,
          start_time: '08:00',
          weekdays: [1, 2, 3, 4, 5],
          end_time_on_next_day: false,
        },
        {
          end_time: '17:00',
          full_day: false,
          resource_state: ResourceState.SELF_SERVICE,
          start_time: '16:00',
          weekdays: [1, 2, 3, 4, 5],
          end_time_on_next_day: false,
        },
        {
          end_time: null,
          full_day: false,
          resource_state: ResourceState.OPEN,
          start_time: null,
          weekdays: [7],
          end_time_on_next_day: false,
        },
      ],
    },
    {
      rules: [
        {
          context: 'year',
          subject: 'week',
          frequency_modifier: 'even',
          frequency_ordinal: null,
        },
      ],
      time_spans: [
        {
          end_time: '16:00',
          full_day: false,
          resource_state: ResourceState.OPEN,
          start_time: '10:00',
          weekdays: [6],
          end_time_on_next_day: false,
        },
        {
          end_time_on_next_day: false,
          end_time: null,
          full_day: true,
          resource_state: ResourceState.CLOSED,
          start_time: null,
          weekdays: [6],
        },
      ],
    },
    {
      rules: [
        {
          context: 'year',
          subject: 'week',
          frequency_modifier: 'odd',
          frequency_ordinal: null,
        },
      ],
      time_spans: [
        {
          end_time: '16:00',
          full_day: false,
          resource_state: ResourceState.OPEN,
          start_time: '10:00',
          weekdays: [6],
          end_time_on_next_day: false,
        },
      ],
    },
  ],
};

describe('opening-hours-helpers', () => {
  describe('openingHoursToApiDatePeriod', () => {
    it('should map to correct data', () => {
      expect(
        formValuesToApiDatePeriod(8414, {
          endDate: '31.12.2022',
          fixed: true,
          name: { fi: 'Normaali aukiolo', sv: null, en: null },
          openingHours,
          startDate: '06.06.2022',
        })
      ).toEqual(datePeriod);
    });
  });

  describe('apiDatePeriodToOpeningHours', () => {
    it('should map to correct data', () => {
      expect(apiDatePeriodToFormValues(datePeriod)).toEqual({
        endDate: '31.12.2022',
        fixed: true,
        name: { fi: 'Normaali aukiolo', sv: null, en: null },
        openingHours,
        startDate: '06.06.2022',
      });
    });
  });

  describe('sortByValidity', () => {
    expect(
      sortByValidity([
        {
          id: 1041529,
          resource: 8414,
          name: { fi: 'Normaaliaukiolo', sv: '', en: '' },
          description: { fi: null, sv: null, en: null },
          start_date: '2022-01-01',
          end_date: '2022-12-31',
          resource_state: ResourceState.UNDEFINED,
          override: false,
          created: '2022-06-21T14:56:59.033814+03:00',
          modified: '2022-06-21T14:56:59.033814+03:00',
          time_span_groups: [
            {
              id: 567524,
              period: 1041529,
              time_spans: [
                {
                  id: 890209,
                  group: 567524,
                  name: { fi: null, sv: null, en: null },
                  description: { fi: null, sv: null, en: null },
                  start_time: null,
                  end_time: null,
                  end_time_on_next_day: false,
                  full_day: false,
                  weekdays: [1, 2, 3, 4, 5],
                  resource_state: ResourceState.OPEN,
                  created: '2022-06-21T14:56:59.197663+03:00',
                  modified: '2022-06-21T14:56:59.197663+03:00',
                },
                {
                  id: 890210,
                  group: 567524,
                  name: { fi: null, sv: null, en: null },
                  description: { fi: null, sv: null, en: null },
                  start_time: null,
                  end_time: null,
                  end_time_on_next_day: false,
                  full_day: true,
                  weekdays: [6, 7],
                  resource_state: ResourceState.CLOSED,
                  created: '2022-06-21T14:56:59.280643+03:00',
                  modified: '2022-06-21T14:56:59.280643+03:00',
                },
              ],
              rules: [],
            },
          ],
        },
        {
          id: 1039083,
          resource: 8414,
          name: { fi: 'Kesäkuun aukiolot', sv: '', en: '' },
          description: { fi: null, sv: null, en: null },
          start_date: '2022-06-22',
          end_date: '2022-07-23',
          resource_state: ResourceState.UNDEFINED,
          override: false,
          created: '2022-06-20T13:05:25.148379+03:00',
          modified: '2022-06-21T14:55:51.688527+03:00',
          time_span_groups: [
            {
              id: 567523,
              period: 1039083,
              time_spans: [
                {
                  id: 890207,
                  group: 567523,
                  name: { fi: null, sv: null, en: null },
                  description: { fi: null, sv: null, en: null },
                  start_time: '10:00:00',
                  end_time: '15:00:00',
                  end_time_on_next_day: false,
                  full_day: false,
                  weekdays: [1, 2, 3, 4, 5],
                  resource_state: ResourceState.OPEN,
                  created: '2022-06-21T14:56:54.188062+03:00',
                  modified: '2022-06-21T14:56:54.188062+03:00',
                },
                {
                  id: 890208,
                  group: 567523,
                  name: { fi: null, sv: null, en: null },
                  description: { fi: null, sv: null, en: null },
                  start_time: null,
                  end_time: null,
                  end_time_on_next_day: false,
                  full_day: true,
                  weekdays: [6, 7],
                  resource_state: ResourceState.CLOSED,
                  created: '2022-06-21T14:56:54.315006+03:00',
                  modified: '2022-06-21T14:56:54.315006+03:00',
                },
              ],
              rules: [],
            },
          ],
        },
        {
          id: 1039084,
          resource: 8414,
          name: { fi: 'Juhannus', sv: '', en: '' },
          description: { fi: null, sv: null, en: null },
          start_date: '2022-06-24',
          end_date: '2022-06-26',
          resource_state: ResourceState.UNDEFINED,
          override: false,
          created: '2022-06-20T13:08:05.928020+03:00',
          modified: '2022-06-21T13:32:20.734883+03:00',
          time_span_groups: [
            {
              id: 567431,
              period: 1039084,
              time_spans: [
                {
                  id: 889998,
                  group: 567431,
                  name: { fi: null, sv: null, en: null },
                  description: { fi: null, sv: null, en: null },
                  start_time: null,
                  end_time: null,
                  end_time_on_next_day: false,
                  full_day: true,
                  weekdays: [1, 2, 3, 4, 5],
                  resource_state: ResourceState.OPEN,
                  created: '2022-06-21T13:32:20.937190+03:00',
                  modified: '2022-06-21T13:32:20.937190+03:00',
                },
                {
                  id: 889999,
                  group: 567431,
                  name: { fi: null, sv: null, en: null },
                  description: { fi: null, sv: null, en: null },
                  start_time: null,
                  end_time: null,
                  end_time_on_next_day: false,
                  full_day: true,
                  weekdays: [6, 7],
                  resource_state: ResourceState.CLOSED,
                  created: '2022-06-21T13:32:21.029582+03:00',
                  modified: '2022-06-21T13:32:21.029582+03:00',
                },
              ],
              rules: [],
            },
          ],
        },
        {
          id: 1039186,
          resource: 8414,
          name: { fi: 'Provinssi', sv: '', en: '' },
          description: { fi: null, sv: null, en: null },
          start_date: '2022-07-01',
          end_date: '2022-07-03',
          resource_state: ResourceState.UNDEFINED,
          override: false,
          created: '2022-06-20T14:17:55.858804+03:00',
          modified: '2022-06-21T13:31:51.677848+03:00',
          time_span_groups: [
            {
              id: 567430,
              period: 1039186,
              time_spans: [
                {
                  id: 889996,
                  group: 567430,
                  name: { fi: null, sv: null, en: null },
                  description: { fi: null, sv: null, en: null },
                  start_time: null,
                  end_time: null,
                  end_time_on_next_day: false,
                  full_day: false,
                  weekdays: [1, 2, 3, 4, 5],
                  resource_state: ResourceState.OPEN,
                  created: '2022-06-21T13:31:51.952458+03:00',
                  modified: '2022-06-21T13:31:51.952458+03:00',
                },
                {
                  id: 889997,
                  group: 567430,
                  name: { fi: null, sv: null, en: null },
                  description: { fi: null, sv: null, en: null },
                  start_time: null,
                  end_time: null,
                  end_time_on_next_day: false,
                  full_day: true,
                  weekdays: [6, 7],
                  resource_state: ResourceState.CLOSED,
                  created: '2022-06-21T13:31:52.078913+03:00',
                  modified: '2022-06-21T13:31:52.078913+03:00',
                },
              ],
              rules: [],
            },
          ],
        },
        {
          id: 1041197,
          resource: 8414,
          name: { fi: 'Heinäkuun aukiolot', sv: '', en: '' },
          description: { fi: null, sv: null, en: null },
          start_date: '2022-07-01',
          end_date: '2022-07-31',
          resource_state: ResourceState.UNDEFINED,
          override: false,
          created: '2022-06-21T11:09:42.531658+03:00',
          modified: '2022-06-21T11:09:51.534521+03:00',
          time_span_groups: [
            {
              id: 567284,
              period: 1041197,
              time_spans: [
                {
                  id: 889630,
                  group: 567284,
                  name: { fi: null, sv: null, en: null },
                  description: { fi: null, sv: null, en: null },
                  start_time: null,
                  end_time: null,
                  end_time_on_next_day: false,
                  full_day: false,
                  weekdays: [1, 2, 3, 4, 5],
                  resource_state: ResourceState.OPEN,
                  created: '2022-06-21T11:09:51.706396+03:00',
                  modified: '2022-06-21T11:09:51.706396+03:00',
                },
                {
                  id: 889631,
                  group: 567284,
                  name: { fi: null, sv: null, en: null },
                  description: { fi: null, sv: null, en: null },
                  start_time: null,
                  end_time: null,
                  end_time_on_next_day: false,
                  full_day: true,
                  weekdays: [6, 7],
                  resource_state: ResourceState.CLOSED,
                  created: '2022-06-21T11:09:51.798962+03:00',
                  modified: '2022-06-21T11:09:51.798962+03:00',
                },
              ],
              rules: [],
            },
          ],
        },
      ])
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "created": "2022-06-21T14:56:59.033814+03:00",
          "description": Object {
            "en": null,
            "fi": null,
            "sv": null,
          },
          "end_date": "2022-12-31",
          "id": 1041529,
          "modified": "2022-06-21T14:56:59.033814+03:00",
          "name": Object {
            "en": "",
            "fi": "Normaaliaukiolo",
            "sv": "",
          },
          "override": false,
          "resource": 8414,
          "resource_state": "undefined",
          "start_date": "2022-01-01",
          "time_span_groups": Array [
            Object {
              "id": 567524,
              "period": 1041529,
              "rules": Array [],
              "time_spans": Array [
                Object {
                  "created": "2022-06-21T14:56:59.197663+03:00",
                  "description": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "end_time": null,
                  "end_time_on_next_day": false,
                  "full_day": false,
                  "group": 567524,
                  "id": 890209,
                  "modified": "2022-06-21T14:56:59.197663+03:00",
                  "name": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "resource_state": "open",
                  "start_time": null,
                  "weekdays": Array [
                    1,
                    2,
                    3,
                    4,
                    5,
                  ],
                },
                Object {
                  "created": "2022-06-21T14:56:59.280643+03:00",
                  "description": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "end_time": null,
                  "end_time_on_next_day": false,
                  "full_day": true,
                  "group": 567524,
                  "id": 890210,
                  "modified": "2022-06-21T14:56:59.280643+03:00",
                  "name": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "resource_state": "closed",
                  "start_time": null,
                  "weekdays": Array [
                    6,
                    7,
                  ],
                },
              ],
            },
          ],
        },
        Object {
          "created": "2022-06-20T13:05:25.148379+03:00",
          "description": Object {
            "en": null,
            "fi": null,
            "sv": null,
          },
          "end_date": "2022-07-23",
          "id": 1039083,
          "modified": "2022-06-21T14:55:51.688527+03:00",
          "name": Object {
            "en": "",
            "fi": "Kesäkuun aukiolot",
            "sv": "",
          },
          "override": false,
          "resource": 8414,
          "resource_state": "undefined",
          "start_date": "2022-06-22",
          "time_span_groups": Array [
            Object {
              "id": 567523,
              "period": 1039083,
              "rules": Array [],
              "time_spans": Array [
                Object {
                  "created": "2022-06-21T14:56:54.188062+03:00",
                  "description": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "end_time": "15:00:00",
                  "end_time_on_next_day": false,
                  "full_day": false,
                  "group": 567523,
                  "id": 890207,
                  "modified": "2022-06-21T14:56:54.188062+03:00",
                  "name": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "resource_state": "open",
                  "start_time": "10:00:00",
                  "weekdays": Array [
                    1,
                    2,
                    3,
                    4,
                    5,
                  ],
                },
                Object {
                  "created": "2022-06-21T14:56:54.315006+03:00",
                  "description": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "end_time": null,
                  "end_time_on_next_day": false,
                  "full_day": true,
                  "group": 567523,
                  "id": 890208,
                  "modified": "2022-06-21T14:56:54.315006+03:00",
                  "name": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "resource_state": "closed",
                  "start_time": null,
                  "weekdays": Array [
                    6,
                    7,
                  ],
                },
              ],
            },
          ],
        },
        Object {
          "created": "2022-06-20T13:08:05.928020+03:00",
          "description": Object {
            "en": null,
            "fi": null,
            "sv": null,
          },
          "end_date": "2022-06-26",
          "id": 1039084,
          "modified": "2022-06-21T13:32:20.734883+03:00",
          "name": Object {
            "en": "",
            "fi": "Juhannus",
            "sv": "",
          },
          "override": false,
          "resource": 8414,
          "resource_state": "undefined",
          "start_date": "2022-06-24",
          "time_span_groups": Array [
            Object {
              "id": 567431,
              "period": 1039084,
              "rules": Array [],
              "time_spans": Array [
                Object {
                  "created": "2022-06-21T13:32:20.937190+03:00",
                  "description": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "end_time": null,
                  "end_time_on_next_day": false,
                  "full_day": true,
                  "group": 567431,
                  "id": 889998,
                  "modified": "2022-06-21T13:32:20.937190+03:00",
                  "name": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "resource_state": "open",
                  "start_time": null,
                  "weekdays": Array [
                    1,
                    2,
                    3,
                    4,
                    5,
                  ],
                },
                Object {
                  "created": "2022-06-21T13:32:21.029582+03:00",
                  "description": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "end_time": null,
                  "end_time_on_next_day": false,
                  "full_day": true,
                  "group": 567431,
                  "id": 889999,
                  "modified": "2022-06-21T13:32:21.029582+03:00",
                  "name": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "resource_state": "closed",
                  "start_time": null,
                  "weekdays": Array [
                    6,
                    7,
                  ],
                },
              ],
            },
          ],
        },
        Object {
          "created": "2022-06-20T14:17:55.858804+03:00",
          "description": Object {
            "en": null,
            "fi": null,
            "sv": null,
          },
          "end_date": "2022-07-03",
          "id": 1039186,
          "modified": "2022-06-21T13:31:51.677848+03:00",
          "name": Object {
            "en": "",
            "fi": "Provinssi",
            "sv": "",
          },
          "override": false,
          "resource": 8414,
          "resource_state": "undefined",
          "start_date": "2022-07-01",
          "time_span_groups": Array [
            Object {
              "id": 567430,
              "period": 1039186,
              "rules": Array [],
              "time_spans": Array [
                Object {
                  "created": "2022-06-21T13:31:51.952458+03:00",
                  "description": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "end_time": null,
                  "end_time_on_next_day": false,
                  "full_day": false,
                  "group": 567430,
                  "id": 889996,
                  "modified": "2022-06-21T13:31:51.952458+03:00",
                  "name": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "resource_state": "open",
                  "start_time": null,
                  "weekdays": Array [
                    1,
                    2,
                    3,
                    4,
                    5,
                  ],
                },
                Object {
                  "created": "2022-06-21T13:31:52.078913+03:00",
                  "description": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "end_time": null,
                  "end_time_on_next_day": false,
                  "full_day": true,
                  "group": 567430,
                  "id": 889997,
                  "modified": "2022-06-21T13:31:52.078913+03:00",
                  "name": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "resource_state": "closed",
                  "start_time": null,
                  "weekdays": Array [
                    6,
                    7,
                  ],
                },
              ],
            },
          ],
        },
        Object {
          "created": "2022-06-21T11:09:42.531658+03:00",
          "description": Object {
            "en": null,
            "fi": null,
            "sv": null,
          },
          "end_date": "2022-07-31",
          "id": 1041197,
          "modified": "2022-06-21T11:09:51.534521+03:00",
          "name": Object {
            "en": "",
            "fi": "Heinäkuun aukiolot",
            "sv": "",
          },
          "override": false,
          "resource": 8414,
          "resource_state": "undefined",
          "start_date": "2022-07-01",
          "time_span_groups": Array [
            Object {
              "id": 567284,
              "period": 1041197,
              "rules": Array [],
              "time_spans": Array [
                Object {
                  "created": "2022-06-21T11:09:51.706396+03:00",
                  "description": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "end_time": null,
                  "end_time_on_next_day": false,
                  "full_day": false,
                  "group": 567284,
                  "id": 889630,
                  "modified": "2022-06-21T11:09:51.706396+03:00",
                  "name": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "resource_state": "open",
                  "start_time": null,
                  "weekdays": Array [
                    1,
                    2,
                    3,
                    4,
                    5,
                  ],
                },
                Object {
                  "created": "2022-06-21T11:09:51.798962+03:00",
                  "description": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "end_time": null,
                  "end_time_on_next_day": false,
                  "full_day": true,
                  "group": 567284,
                  "id": 889631,
                  "modified": "2022-06-21T11:09:51.798962+03:00",
                  "name": Object {
                    "en": null,
                    "fi": null,
                    "sv": null,
                  },
                  "resource_state": "closed",
                  "start_time": null,
                  "weekdays": Array [
                    6,
                    7,
                  ],
                },
              ],
            },
          ],
        },
      ]
    `);
  });
});
