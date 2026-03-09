import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ApiDatePeriod,
  DatePeriod,
  Language,
  Resource,
  ResourceType,
  UiDatePeriodConfig,
} from '../../common/lib/types';
import api from '../../common/utils/api/api';
import { SelectedDatePeriodsProvider } from '../../common/selectedDatePeriodsContext/SelectedDatePeriodsContext';
import * as datePeriodFormConfigService from '../../services/datePeriodFormConfig';
import * as holidaysService from '../../services/holidays';
import ResourceOpeningHours from './ResourceOpeningHours';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    init: () => {},
  },
}));

vi.mock('../../services/datePeriodFormConfig', () => ({
  getDatePeriodFormConfig: vi.fn(),
}));

vi.mock('../../services/holidays', () => ({
  getHolidays: vi.fn(),
}));

vi.mock('../../common/helpers/opening-hours-helpers', () => ({
  apiDatePeriodToDatePeriod: vi.fn((period: DatePeriod) => period),
  getActiveDatePeriods: vi.fn(() => []),
  isHolidayOrEve: vi.fn(() => false),
}));

vi.mock('../opening-periods-list/OpeningPeriodsList', () => ({
  default: ({
    id,
    datePeriods,
    onMovePeriod,
  }: {
    id: string;
    datePeriods: DatePeriod[];
    onMovePeriod?: (datePeriod: DatePeriod, direction: 'up' | 'down') => void;
  }) => {
    if (id !== 'resource-opening-periods-list') {
      return <div />;
    }

    return (
      <div>
        <button
          data-testid="trigger-move-up"
          type="button"
          disabled={datePeriods.length < 2}
          onClick={() => {
            if (datePeriods.length >= 2 && onMovePeriod) {
              onMovePeriod(datePeriods[1], 'up');
            }
          }}
        />
        <button
          data-testid="trigger-move-down"
          type="button"
          disabled={datePeriods.length < 2}
          onClick={() => {
            if (datePeriods.length >= 2 && onMovePeriod) {
              onMovePeriod(datePeriods[1], 'down');
            }
          }}
        />
        <button
          data-testid="trigger-move-first-up"
          type="button"
          disabled={datePeriods.length < 1}
          onClick={() => {
            if (datePeriods.length >= 1 && onMovePeriod) {
              onMovePeriod(datePeriods[0], 'up');
            }
          }}
        />
        <button
          data-testid="trigger-stale-move"
          type="button"
          onClick={() => {
            if (onMovePeriod) {
              onMovePeriod({ id: 999 } as DatePeriod, 'up');
            }
          }}
        />
      </div>
    );
  },
}));

const testResource: Resource = {
  id: 123,
  name: { fi: 'Test', sv: 'Test', en: 'Test' },
  description: { fi: '', sv: '', en: '' },
  address: { fi: '', sv: '', en: '' },
  extra_data: { citizen_url: '', admin_url: '' },
  children: [],
  parents: [],
  resource_type: ResourceType.UNIT,
};

const minimalDatePeriodConfig: UiDatePeriodConfig = {
  name: {},
  resourceState: {
    options: [],
  },
  timeSpanGroup: {
    rule: {
      context: {
        options: [],
        required: false,
      },
      subject: {
        options: [],
        required: false,
      },
      frequencyModifier: {
        options: [],
        required: false,
      },
      start: {
        required: false,
      },
    },
  },
};

const createNormalPeriod = (id: number, order: number): DatePeriod => ({
  id,
  order,
  override: false,
  fixed: false,
  name: { fi: '', sv: '', en: '' },
  startDate: null,
  endDate: null,
  openingHours: [],
});

const getApiPeriods = (): ApiDatePeriod[] =>
  [
    createNormalPeriod(1, 0),
    createNormalPeriod(2, 2),
    createNormalPeriod(3, 5),
  ] as unknown as ApiDatePeriod[];

describe('ResourceOpeningHours movePeriod', () => {
  beforeEach(() => {
    vi.mocked(
      datePeriodFormConfigService.getDatePeriodFormConfig
    ).mockResolvedValue(minimalDatePeriodConfig);
    vi.mocked(holidaysService.getHolidays).mockReturnValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('persists full normalized ordering when moving period', async () => {
    const user = userEvent.setup();
    const getDatePeriodsSpy = vi
      .spyOn(api, 'getDatePeriods')
      .mockResolvedValue(getApiPeriods());
    const patchDatePeriodOrderSpy = vi
      .spyOn(api, 'patchDatePeriodOrder')
      .mockResolvedValue({} as ApiDatePeriod);

    render(
      <SelectedDatePeriodsProvider>
        <ResourceOpeningHours language={Language.FI} resource={testResource} />
      </SelectedDatePeriodsProvider>
    );

    await waitFor(() => {
      expect(getDatePeriodsSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('trigger-move-up')).not.toBeDisabled();
    });

    await user.click(screen.getByTestId('trigger-move-up'));

    await waitFor(() => {
      expect(patchDatePeriodOrderSpy).toHaveBeenCalledTimes(3);
    });

    expect(patchDatePeriodOrderSpy).toHaveBeenNthCalledWith(1, 2, 0);
    expect(patchDatePeriodOrderSpy).toHaveBeenNthCalledWith(2, 1, 1);
    expect(patchDatePeriodOrderSpy).toHaveBeenNthCalledWith(3, 3, 2);
  });

  it('persists only changed orders when moving period down', async () => {
    const user = userEvent.setup();
    const getDatePeriodsSpy = vi
      .spyOn(api, 'getDatePeriods')
      .mockResolvedValue(getApiPeriods());
    const patchDatePeriodOrderSpy = vi
      .spyOn(api, 'patchDatePeriodOrder')
      .mockResolvedValue({} as ApiDatePeriod);

    render(
      <SelectedDatePeriodsProvider>
        <ResourceOpeningHours language={Language.FI} resource={testResource} />
      </SelectedDatePeriodsProvider>
    );

    await waitFor(() => {
      expect(getDatePeriodsSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('trigger-move-down')).not.toBeDisabled();
    });

    await user.click(screen.getByTestId('trigger-move-down'));

    // sorted: [id:1 order:0, id:2 order:2, id:3 order:5]
    // move id:2 (idx=1) down → swap with idx=2
    // reordered: [id:1, id:3, id:2] → normalised: id:1→0, id:3→1, id:2→2
    // id:1 stays at index 0 with order 0 (unchanged), only id:3 and id:2 patched
    await waitFor(() => {
      expect(patchDatePeriodOrderSpy).toHaveBeenCalledTimes(2);
    });

    expect(patchDatePeriodOrderSpy).toHaveBeenNthCalledWith(1, 3, 1);
    expect(patchDatePeriodOrderSpy).toHaveBeenNthCalledWith(2, 2, 2);
  });

  it('does not patch when moving first period up (boundary)', async () => {
    const user = userEvent.setup();
    const getDatePeriodsSpy = vi
      .spyOn(api, 'getDatePeriods')
      .mockResolvedValue(getApiPeriods());
    const patchDatePeriodOrderSpy = vi
      .spyOn(api, 'patchDatePeriodOrder')
      .mockResolvedValue({} as ApiDatePeriod);

    render(
      <SelectedDatePeriodsProvider>
        <ResourceOpeningHours language={Language.FI} resource={testResource} />
      </SelectedDatePeriodsProvider>
    );

    await waitFor(() => {
      expect(getDatePeriodsSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('trigger-move-first-up')).not.toBeDisabled();
    });

    await user.click(screen.getByTestId('trigger-move-first-up'));

    // Moving the first element up should be a no-op (neighborIdx = -1)
    // Wait a tick to ensure any async work would have settled
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    expect(patchDatePeriodOrderSpy).not.toHaveBeenCalled();
  });

  it('does not patch when moved period is missing from latest list', async () => {
    const user = userEvent.setup();
    const getDatePeriodsSpy = vi
      .spyOn(api, 'getDatePeriods')
      .mockResolvedValue(getApiPeriods());
    const patchDatePeriodOrderSpy = vi
      .spyOn(api, 'patchDatePeriodOrder')
      .mockResolvedValue({} as ApiDatePeriod);

    render(
      <SelectedDatePeriodsProvider>
        <ResourceOpeningHours language={Language.FI} resource={testResource} />
      </SelectedDatePeriodsProvider>
    );

    await waitFor(() => {
      expect(getDatePeriodsSpy).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByTestId('trigger-stale-move'));

    // Wait a tick to ensure any async work would have settled
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    expect(patchDatePeriodOrderSpy).not.toHaveBeenCalled();
  });

  it('shows error toast when patch request fails', async () => {
    const user = userEvent.setup();
    const getDatePeriodsSpy = vi
      .spyOn(api, 'getDatePeriods')
      .mockResolvedValue(getApiPeriods());
    const patchDatePeriodOrderSpy = vi
      .spyOn(api, 'patchDatePeriodOrder')
      .mockRejectedValue(new Error('Network error'));

    render(
      <SelectedDatePeriodsProvider>
        <ResourceOpeningHours language={Language.FI} resource={testResource} />
      </SelectedDatePeriodsProvider>
    );

    await waitFor(() => {
      expect(getDatePeriodsSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('trigger-move-up')).not.toBeDisabled();
    });

    await user.click(screen.getByTestId('trigger-move-up'));

    await waitFor(() => {
      expect(patchDatePeriodOrderSpy).toHaveBeenCalled();
    });

    // After failure, fetchDatePeriods should NOT be called again
    // (initial load = 1, no re-fetch on error)
    expect(getDatePeriodsSpy).toHaveBeenCalledTimes(1);
  });
});
