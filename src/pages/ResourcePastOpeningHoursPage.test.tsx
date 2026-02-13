import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { datePeriodOptions } from '../../test/fixtures/api-options';
import {
  ApiDatePeriod,
  Resource,
  ResourceState,
  ResourceType,
  UiDatePeriodConfig,
} from '../common/lib/types';
import api from '../common/utils/api/api';
import * as datePeriodConfigService from '../services/datePeriodFormConfig';
import ResourcePastOpeningHoursPage from './ResourcePastOpeningHoursPage';
import * as holidays from '../services/holidays';
import { SelectedDatePeriodsProvider } from '../common/selectedDatePeriodsContext/SelectedDatePeriodsContext';

const testResource: Resource = {
  id: 1186,
  name: {
    fi: 'Test resource name in finnish',
    sv: 'Test resource name in swedish',
    en: 'Test resource name in english',
  },
  address: {
    fi: 'Test address in finnish',
    sv: 'Test address in swedish',
    en: 'Test address in english',
  },
  description: {
    fi: 'Test description in finnish',
    sv: 'Test description in swedish',
    en: 'Test description in english',
  },
  extra_data: {
    citizen_url: 'kansalaisen puolen url',
    admin_url: 'admin puolen url',
  },
  children: [],
  parents: [],
  resource_type: ResourceType.UNIT,
};

const testPastNormalDatePeriod: ApiDatePeriod = {
  id: 1,
  created: '2020-11-20',
  modified: '2020-11-20',
  is_removed: false,
  name: { fi: 'Past normal period', sv: null, en: null },
  description: { fi: '', sv: '', en: '' },
  start_date: '2023-01-01',
  end_date: '2023-01-31',
  resource_state: ResourceState.OPEN,
  override: false,
  resource: 1186,
  time_span_groups: [],
};

const testPastExceptionDatePeriod: ApiDatePeriod = {
  id: 2,
  created: '2020-12-20',
  modified: '2020-12-20',
  is_removed: false,
  name: { fi: 'Past exception period', sv: null, en: null },
  description: { fi: '', sv: '', en: '' },
  start_date: '2023-02-01',
  end_date: '2023-02-01',
  resource_state: ResourceState.CLOSED,
  override: true,
  resource: 1186,
  time_span_groups: [],
};

const testPastHolidayDatePeriod: ApiDatePeriod = {
  id: 3,
  created: '2020-12-25',
  modified: '2020-12-25',
  is_removed: false,
  name: { fi: 'Joulupäivä', sv: 'Juldagen', en: 'Christmas Day' },
  description: { fi: '', sv: '', en: '' },
  start_date: '2023-12-25',
  end_date: '2023-12-25',
  resource_state: ResourceState.CLOSED,
  override: true,
  resource: 1186,
  time_span_groups: [],
};

const testDatePeriodOptions: UiDatePeriodConfig = datePeriodOptions;

vi.mock('react-i18next', () => ({
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

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');

  return {
    ...mod,
    useParams: () => ({
      id: 'tprek:8100',
    }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../hooks/useReturnToResourcePage', () => ({
  default: () => vi.fn(),
}));

describe(`<ResourcePastOpeningHoursPage />`, () => {
  beforeEach(() => {
    vi.spyOn(api, 'getResource').mockImplementation(() =>
      Promise.resolve(testResource)
    );

    vi.spyOn(api, 'getPastDatePeriods').mockImplementation(() =>
      Promise.resolve([])
    );

    vi.spyOn(
      datePeriodConfigService,
      'getDatePeriodFormConfig'
    ).mockImplementation(() => Promise.resolve(testDatePeriodOptions));

    vi.spyOn(holidays, 'getHolidays').mockImplementation(() => [
      {
        name: {
          fi: 'Joulupäivä',
          sv: 'Juldagen',
          en: 'Christmas Day',
        },
        date: '2023-12-25',
        official: true,
      },
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading indicator', async () => {
    vi.spyOn(api, 'getResource')
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .mockImplementation(() => new Promise(() => {}));

    render(
      <Router>
        <SelectedDatePeriodsProvider>
          <ResourcePastOpeningHoursPage />
        </SelectedDatePeriodsProvider>
      </Router>
    );

    await act(async () => {
      expect(await screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'ResourcePastOpeningHoursPage.Notifications.IsLoading'
      );
    });
  });

  it('should show error notification', async () => {
    vi.spyOn(api, 'getResource').mockImplementation(() =>
      Promise.reject(new Error('Failed to load a resource'))
    );

    await act(async () => {
      render(
        <Router>
          <SelectedDatePeriodsProvider>
            <ResourcePastOpeningHoursPage />
          </SelectedDatePeriodsProvider>
        </Router>
      );
    });

    await act(async () => {
      expect(await screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'ResourcePastOpeningHoursPage.Notifications.Error'
      );

      expect(
        await screen.findByText(
          'ResourcePastOpeningHoursPage.Notifications.ErrorLoadingResource'
        )
      ).toBeInTheDocument();
    });
  });

  it('should show resource title and empty state when no past periods exist', async () => {
    await act(async () => {
      render(
        <Router>
          <SelectedDatePeriodsProvider>
            <ResourcePastOpeningHoursPage />
          </SelectedDatePeriodsProvider>
        </Router>
      );
    });

    await waitFor(async () => {
      expect(
        await screen.findByText('ResourcePastOpeningHoursPage.Main.EmptyState')
      ).toBeInTheDocument();
    });
  });

  it('should show past normal opening hours', async () => {
    vi.spyOn(api, 'getPastDatePeriods').mockImplementation(() =>
      Promise.resolve([testPastNormalDatePeriod])
    );

    await act(async () => {
      render(
        <Router>
          <SelectedDatePeriodsProvider>
            <ResourcePastOpeningHoursPage />
          </SelectedDatePeriodsProvider>
        </Router>
      );
    });

    await waitFor(async () => {
      expect(
        await screen.findByText(
          'ResourcePastOpeningHoursPage.Main.NormalPeriodsTitle'
        )
      ).toBeInTheDocument();

      expect(await screen.findByText('Past normal period')).toBeInTheDocument();
    });
  });

  it('should show past exception opening hours', async () => {
    vi.spyOn(api, 'getPastDatePeriods').mockImplementation(() =>
      Promise.resolve([testPastExceptionDatePeriod])
    );

    await act(async () => {
      render(
        <Router>
          <SelectedDatePeriodsProvider>
            <ResourcePastOpeningHoursPage />
          </SelectedDatePeriodsProvider>
        </Router>
      );
    });

    await waitFor(async () => {
      expect(
        await screen.findByText(
          'ResourcePastOpeningHoursPage.Main.ExceptionPeriodsTitle'
        )
      ).toBeInTheDocument();

      expect(
        await screen.findByText('Past exception period')
      ).toBeInTheDocument();
    });
  });

  it('should show past holiday opening hours separately', async () => {
    vi.spyOn(api, 'getPastDatePeriods').mockImplementation(() =>
      Promise.resolve([testPastHolidayDatePeriod])
    );

    await act(async () => {
      render(
        <Router>
          <SelectedDatePeriodsProvider>
            <ResourcePastOpeningHoursPage />
          </SelectedDatePeriodsProvider>
        </Router>
      );
    });

    await waitFor(async () => {
      expect(
        await screen.findByText(
          'ResourcePastOpeningHoursPage.Main.HolidayPeriodsTitle'
        )
      ).toBeInTheDocument();

      expect(await screen.findByText('Joulupäivä')).toBeInTheDocument();
    });
  });

  it('should show all three types of past opening hours', async () => {
    vi.spyOn(api, 'getPastDatePeriods').mockImplementation(() =>
      Promise.resolve([
        testPastNormalDatePeriod,
        testPastExceptionDatePeriod,
        testPastHolidayDatePeriod,
      ])
    );

    await act(async () => {
      render(
        <Router>
          <SelectedDatePeriodsProvider>
            <ResourcePastOpeningHoursPage />
          </SelectedDatePeriodsProvider>
        </Router>
      );
    });

    await waitFor(async () => {
      expect(
        await screen.findByText(
          'ResourcePastOpeningHoursPage.Main.NormalPeriodsTitle'
        )
      ).toBeInTheDocument();

      expect(
        await screen.findByText(
          'ResourcePastOpeningHoursPage.Main.ExceptionPeriodsTitle'
        )
      ).toBeInTheDocument();

      expect(
        await screen.findByText(
          'ResourcePastOpeningHoursPage.Main.HolidayPeriodsTitle'
        )
      ).toBeInTheDocument();

      expect(await screen.findByText('Past normal period')).toBeInTheDocument();
      expect(
        await screen.findByText('Past exception period')
      ).toBeInTheDocument();
      expect(await screen.findByText('Joulupäivä')).toBeInTheDocument();
    });
  });

  it('should show return to main page button', async () => {
    await act(async () => {
      render(
        <Router>
          <SelectedDatePeriodsProvider>
            <ResourcePastOpeningHoursPage />
          </SelectedDatePeriodsProvider>
        </Router>
      );
    });

    await waitFor(async () => {
      expect(
        await screen.findByText('ResourcePage.Main.ReturnToMainPageButton')
      ).toBeInTheDocument();
    });
  });
});
