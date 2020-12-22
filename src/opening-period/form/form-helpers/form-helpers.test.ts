/// <reference types="jest" />
import {
  FormWeekdays,
  ResourceState,
  TimeSpan,
  TimeSpanFormFormat,
} from '../../../common/lib/types';
import {
  formatApiTimeSpansToFormFormat,
  formatTimeSpansToApiFormat,
} from './form-helpers';

const formTimeSpanA: TimeSpanFormFormat = {
  description: 'description text A',
  endTime: '18:00',
  startTime: '10:00',
  resourceState: ResourceState.OPEN,
  weekdays: [false, false, false, false, false, true, true] as FormWeekdays,
};

const apiTimeSpanA: TimeSpan = {
  id: 1234,
  name: { en: null, fi: null, sv: null },
  description: { en: null, fi: 'description text A', sv: null },
  end_time: '18:00:00',
  resource_state: ResourceState.OPEN,
  start_time: '10:00:00',
  weekdays: [3, 5, 6, 7],
  created: '2020-12-16T12:21:37.255923+02:00',
  modified: '2020-12-16T12:21:37.255923+02:00',
  full_day: false,
  group: 1136,
};

const apiTimeSpanB: TimeSpan = {
  id: 2345,
  name: { en: null, fi: null, sv: null },
  description: { en: null, fi: null, sv: null },
  end_time: '18:00:00',
  resource_state: ResourceState.SELF_SERVICE,
  start_time: '10:00:00',
  weekdays: [],
  created: '2020-12-16T12:21:37.255923+02:00',
  modified: '2020-12-16T12:21:37.255923+02:00',
  full_day: false,
  group: 1136,
};

describe('opening-period form-helpers', () => {
  describe('formatTimeSpansToApiFormat', () => {
    it('should return time-spans in api-format', () => {
      expect(formatTimeSpansToApiFormat([formTimeSpanA])).toEqual([
        {
          description: { en: null, fi: 'description text A', sv: null },
          end_time: '18:00:00',
          resource_state: ResourceState.OPEN,
          start_time: '10:00:00',
          weekdays: [6, 7],
        },
      ]);
    });
  });

  describe('formatApiTimeSpansToFormFormat', () => {
    it('should return time-spans in form-format (ui-format)', () => {
      expect(formatApiTimeSpansToFormFormat([apiTimeSpanA])).toEqual([
        {
          id: 1234,
          description: 'description text A',
          endTime: '18:00',
          resourceState: ResourceState.OPEN,
          startTime: '10:00',
          weekdays: [false, false, true, false, true, true, true],
        },
      ]);
    });

    it('should provide default values for form-format (ui-format)', () => {
      expect(formatApiTimeSpansToFormFormat([apiTimeSpanB])).toEqual([
        {
          id: 2345,
          description: '',
          endTime: '18:00',
          resourceState: ResourceState.SELF_SERVICE,
          startTime: '10:00',
          weekdays: [false, false, false, false, false, false, false],
        },
      ]);
    });

    it('should sort time-spans by weekdays (spans with selected days in the beginning of the week are listed higher)', () => {
      const [
        formTimeSpanFirst,
        formTimeSpanSecond,
      ] = formatApiTimeSpansToFormFormat([apiTimeSpanA, apiTimeSpanB]);

      expect(formTimeSpanFirst.weekdays).toEqual([
        false,
        false,
        true,
        false,
        true,
        true,
        true,
      ]);

      expect(formTimeSpanSecond.weekdays).toEqual([
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]);
    });
  });
});
