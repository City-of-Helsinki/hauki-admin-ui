export type Language = 'fi' | 'sv' | 'en';

export type LanguageStrings = {
  [x in Language]: string | null;
};

export enum ResourceState {
  OPEN = 'open',
  SELF_SERVICE = 'self_service',
  CLOSED = 'closed',
}

enum WeekdayTypes {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7,
}

type Weekdays = Array<WeekdayTypes>;

export type TimeSpan = {
  start_time: string;
  end_time: string;
  weekdays: Weekdays;
  id?: number;
  created?: string;
  modified?: string;
  is_removed?: boolean;
  name?: LanguageStrings;
  description?: LanguageStrings;
  full_day?: boolean;
  resource_state?: ResourceState;
  group?: number;
};

export type TimeSpanFormFormat = {
  description: string;
  endTime: string;
  startTime: string;
  resourceState: ResourceState;
  weekdays: [
    true | false,
    true | false,
    true | false,
    true | false,
    true | false,
    true | false,
    true | false
  ];
};

type ResourceStateApiOption = {
  value: string;
  display_name: string;
};

export type ResourceStateOption = {
  label: string;
  value: string;
};

export type DatePeriodOptions = {
  actions: {
    POST: {
      resource_state: {
        choices: ResourceStateApiOption[];
      };
    };
  };
};

export type TimeSpanGroup = {
  id?: number;
  time_spans: TimeSpan[];
  rules: [];
  period?: number;
};

export type DatePeriod = {
  id?: number;
  created?: string;
  modified?: string;
  is_removed?: boolean;
  name: LanguageStrings;
  description: LanguageStrings;
  start_date: string;
  end_date: string;
  resource_state?: ResourceState;
  override: boolean;
  resource: number;
  time_span_groups: TimeSpanGroup[];
};

export interface Resource {
  id: number;
  name: {
    fi: string;
    sv: string;
    en: string;
  };
  description: {
    fi: string;
    sv: string;
    en: string;
  };
  address: {
    fi: string;
    sv: string;
    en: string;
  };
  extra_data: {
    citizen_url: string;
    admin_url: string;
  };
}
