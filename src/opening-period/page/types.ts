import { ResourceState } from '../../common/lib/types';

export type OptionType = { value: string; label: string | null };

export type OpeningHoursTimeSpan = {
  start?: string;
  end?: string;
  fullDay?: boolean;
  state?: ResourceState;
  description?: string;
};

export type AlternatingOpeningHour = {
  rule: OptionType;
  timeSpans: OpeningHoursTimeSpan[];
};

export type OpeningHours = {
  days: number[];
  isOpen?: boolean;
  timeSpans?: OpeningHoursTimeSpan[];
  alternating?: AlternatingOpeningHour[];
};

export type OpeningHoursFormState = {
  openingHours: OpeningHours[];
};
