import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
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
import ResourcePage from './ResourcePage';
import * as holidays from '../services/holidays';
import { SelectedDatePeriodsProvider } from '../common/selectedDatePeriodsContext/SelectedDatePeriodsContext';
import * as useGotToResourceBatchUpdataPage from '../hooks/useGoToResourceBatchUpdatePage';

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
  children: [123],
  parents: [321],
  resource_type: ResourceType.UNIT,
};

const testParentResource: Resource = {
  id: 321,
  name: {
    fi: 'Test parent resource name in finnish',
    sv: 'Test parent resource name in swedish',
    en: 'Test parent resource name in english',
  },
  address: {
    fi: 'Test parent address in finnish',
    sv: 'Test parent address in swedish',
    en: 'Test parent address in english',
  },
  description: {
    fi: 'Test parent description in finnish',
    sv: 'Test parent description in swedish',
    en: 'Test parent description in english',
  },
  extra_data: {
    citizen_url: 'kansalaisen puolen url',
    admin_url: 'admin puolen url',
  },
  children: [1186],
  parents: [],
  resource_type: ResourceType.UNIT,
};

const testChildResource: Resource = {
  id: 123,
  name: {
    fi: 'Test child resource name in finnish',
    sv: 'Test child resource name in swedish',
    en: 'Test child resource name in english',
  },
  address: {
    fi: 'Test child address in finnish',
    sv: 'Test child address in swedish',
    en: 'Test child address in english',
  },
  description: {
    fi: 'Test child description in finnish',
    sv: 'Test child description in swedish',
    en: 'Test child description in english',
  },
  extra_data: {
    citizen_url: 'kansalaisen puolen url',
    admin_url: 'admin puolen url',
  },
  children: [],
  parents: [1186],
  resource_type: ResourceType.CONTACT,
};

const testDatePeriod: ApiDatePeriod = {
  id: 1,
  created: '2020-11-20',
  modified: '2020-11-20',
  is_removed: false,
  name: { fi: '', sv: '', en: '' },
  description: { fi: '', sv: '', en: '' },
  start_date: '',
  end_date: '2020-11-21',
  resource_state: ResourceState.OPEN,
  override: false,
  resource: 1,
  time_span_groups: [],
};

const testDatePeriodOptions: UiDatePeriodConfig = datePeriodOptions;

const testDatePeriodWithTimeSpans: ApiDatePeriod[] = [
  {
    id: 155,
    resource: 7108,
    name: {
      fi: 'oma syntymäpäivä',
      sv: null,
      en: null,
    },
    description: {
      fi: null,
      sv: null,
      en: null,
    },
    start_date: '2023-11-09',
    end_date: null,
    resource_state: undefined,
    override: false,
    created: '2023-11-09T12:03:47.039454+02:00',
    modified: '2023-11-09T12:03:47.039454+02:00',
    time_span_groups: [
      {
        id: 81,
        period: 155,
        time_spans: [
          {
            id: 124,
            group: 81,
            name: {
              fi: null,
              sv: null,
              en: null,
            },
            description: {
              fi: null,
              sv: null,
              en: null,
            },
            start_time: '11:11:00',
            end_time: '12:12:00',
            end_time_on_next_day: false,
            full_day: false,
            weekdays: [1, 2, 3, 4, 5],
            resource_state: ResourceState.OPEN,
            created: '2023-11-09T12:03:47.069756+02:00',
            modified: '2023-11-09T12:03:47.069756+02:00',
          },
          {
            id: 125,
            group: 81,
            name: {
              fi: null,
              sv: null,
              en: null,
            },
            description: {
              fi: null,
              sv: null,
              en: null,
            },
            start_time: null,
            end_time: null,
            end_time_on_next_day: false,
            full_day: false,
            weekdays: [6, 7],
            resource_state: ResourceState.CLOSED,
            created: '2023-11-09T12:03:47.087391+02:00',
            modified: '2023-11-09T12:03:47.087391+02:00',
          },
        ],
        rules: [],
      },
    ],
  },
  {
    id: 150,
    resource: 7108,
    name: {
      fi: 'Isänpäivä',
      sv: 'Fars dag',
      en: "Father's Day",
    },
    description: {
      fi: null,
      sv: null,
      en: null,
    },
    start_date: '2023-11-12',
    end_date: '2023-11-12',
    resource_state: ResourceState.CLOSED,
    override: true,
    created: '2023-11-09T10:58:21.111692+02:00',
    modified: '2023-11-09T10:58:21.111692+02:00',
    time_span_groups: [],
  },
  {
    id: 172,
    resource: 7108,
    name: {
      fi: '2. joulupäivä',
      sv: 'Annandag jul',
      en: 'Boxing Day',
    },
    description: {
      fi: null,
      sv: null,
      en: null,
    },
    start_date: '2023-12-26',
    end_date: '2023-12-26',
    resource_state: ResourceState.CLOSED,
    override: true,
    created: '2023-11-13T10:40:50.286343+02:00',
    modified: '2023-11-13T10:40:50.286343+02:00',
    time_span_groups: [],
  },
];

// Mock for using useGoToResourceBatchUpdatePage hook
const mockUseGoToResourceBatchUpdatePage = vi.fn();

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

describe(`<ResourcePage />`, () => {
  beforeEach(() => {
    vi.spyOn(api, 'getResource').mockImplementation(() =>
      Promise.resolve(testResource)
    );

    vi.spyOn(api, 'getDatePeriods').mockImplementation(() =>
      Promise.resolve([testDatePeriod])
    );

    vi.spyOn(
      datePeriodConfigService,
      'getDatePeriodFormConfig'
    ).mockImplementation(() => Promise.resolve(testDatePeriodOptions));

    vi.spyOn(api, 'getChildResourcesByParentId').mockImplementation(() =>
      Promise.resolve([testChildResource])
    );

    vi.spyOn(api, 'getParentResourcesByChildId').mockImplementation(() =>
      Promise.resolve([testParentResource])
    );

    vi.spyOn(holidays, 'getHolidays').mockImplementation(() => [
      {
        name: {
          fi: 'Juhannusaatto',
          sv: 'Midsommarafton',
          en: 'Midsummer Eve',
        },
        date: '2022-06-24',
        official: true,
      },
    ]);

    vi.spyOn(useGotToResourceBatchUpdataPage, 'default').mockImplementation(
      () => mockUseGoToResourceBatchUpdatePage
    );
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
          <ResourcePage mainResourceId="tprek:8100" />
        </SelectedDatePeriodsProvider>
      </Router>
    );

    await act(async () => {
      expect(await screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'ResourcePage.Notifications.IsLoading'
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
            <ResourcePage mainResourceId="tprek:8100" />
          </SelectedDatePeriodsProvider>
        </Router>
      );
    });

    await act(async () => {
      expect(await screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'ResourcePage.Notifications.Error'
      );

      expect(
        await screen.findByText(
          'ResourcePage.Notifications.ErrorLoadingResource'
        )
      ).toBeInTheDocument();
    });
  });

  it('should show resource details', async () => {
    await act(async () => {
      render(
        <Router>
          <SelectedDatePeriodsProvider>
            <ResourcePage mainResourceId="tprek:8100" />
          </SelectedDatePeriodsProvider>
        </Router>
      );
    });

    await act(async () => {
      expect(await screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        testResource.name.fi
      );
    });
  });

  it('should show parent resources', async () => {
    let container: Element;
    await act(async () => {
      container = render(
        <Router>
          <SelectedDatePeriodsProvider>
            <ResourcePage mainResourceId="tprek:8100" />
          </SelectedDatePeriodsProvider>
        </Router>
      ).container;
    });

    await act(async () => {
      expect(
        screen.getByText('ResourcePage.Main.Resources')
      ).toBeInTheDocument();

      expect(
        await container.querySelector(
          'p[data-test="parent-resource-description"]'
        )
      ).toBeInTheDocument();

      expect(
        await container.querySelector('a[data-test="parent-resource-name-0"]')
      ).toHaveTextContent(testParentResource.name.fi);
    });
  });

  it('should show resource opening hours', async () => {
    let container: Element;
    await act(async () => {
      container = render(
        <Router>
          <SelectedDatePeriodsProvider>
            <ResourcePage mainResourceId="tprek:8100" />
          </SelectedDatePeriodsProvider>
        </Router>
      ).container;
    });

    await act(async () => {
      expect(
        await container.querySelector('div[data-test="openingPeriod-1"]')
      ).toBeInTheDocument();
    });
  });

  it('Should successfully render a resource that has zero date periods', async () => {
    await act(async () => {
      render(
        <Router>
          <SelectedDatePeriodsProvider>
            <ResourcePage mainResourceId="tprek:8100" />
          </SelectedDatePeriodsProvider>
        </Router>
      );
    });

    vi.spyOn(api, 'getDatePeriods').mockImplementation(() =>
      Promise.resolve([])
    );

    await act(async () => {
      expect(await screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        testResource.name.fi
      );
    });
  });

  it('Should show copying info when targets exist', async () => {
    vi.spyOn(api, 'getDatePeriods').mockImplementation(() => {
      return Promise.resolve(testDatePeriodWithTimeSpans);
    });

    await act(async () => {
      render(
        <Router>
          <SelectedDatePeriodsProvider>
            <ResourcePage
              mainResourceId="tprek:8100"
              targetResourcesString="tprek:8101"
            />
          </SelectedDatePeriodsProvider>
        </Router>
      );
    });

    expect(screen.getAllByText('BatchTitle', { exact: false })).not.toBeNull();
  });

  it('Should show advance to batch copy page and an error if no datePeriods are selected', async () => {
    vi.spyOn(api, 'getDatePeriods').mockImplementation(() => {
      return Promise.resolve(testDatePeriodWithTimeSpans);
    });

    await act(async () => {
      render(
        <Router>
          <SelectedDatePeriodsProvider>
            <ResourcePage
              mainResourceId="tprek:8100"
              targetResourcesString="tprek:8101"
            />
          </SelectedDatePeriodsProvider>
        </Router>
      );
    });

    const button = screen.queryByText('ResourcePage.Main.BatchContinueButton');
    expect(button).toBeInTheDocument();
    button?.click();

    // now we have an error since no datePeriods are chosen
    expect(
      screen.getByTestId('gotoBatchUpdateErrorNotification')
    ).toBeInTheDocument();

    // expect function mockUseGoToResourceBatchUpdatePage to not have been called
    expect(mockUseGoToResourceBatchUpdatePage).toHaveBeenCalledTimes(0);
  });

  it('Should show resource copying opening periods with checkboxes and state change according to interaction and forward navigation', async () => {
    vi.spyOn(api, 'getDatePeriods').mockImplementation(() => {
      return Promise.resolve(testDatePeriodWithTimeSpans);
    });

    await act(async () => {
      render(
        <Router>
          <SelectedDatePeriodsProvider>
            <ResourcePage
              mainResourceId="tprek:8100"
              targetResourcesString="tprek:8101"
            />
          </SelectedDatePeriodsProvider>
        </Router>
      );
    });

    // get all datePeriods checkboxes
    const periodCheckboxes = screen
      .getAllByRole('checkbox')
      .filter((checkbox) => checkbox.id.includes('period-checkbox'));

    // click all datePeriods checkboxes
    periodCheckboxes.forEach((checkbox) => {
      checkbox.click();
    });

    // expect all datePeriods checkboxes to be checked, showing only "Poista valinnat" button
    expect(
      screen.queryByText('ResourcePage.OpeningPeriodsSection.SelectAll')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('ResourcePage.OpeningPeriodsSection.SelectNone')
    ).toBeInTheDocument();

    // also check if all non-disabled all-periods-checkboxes are checked
    const allPeriodsCheckboxes = screen
      .getAllByRole('checkbox')
      .filter(
        (checkbox) =>
          checkbox.id.includes('all-periods') &&
          checkbox.getAttribute('disabled') === null
      );

    allPeriodsCheckboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });

    // and now when button click should hide the error (mock disables navigating any further)
    const button = screen.queryByText('ResourcePage.Main.BatchContinueButton');
    button?.click();

    // expect function mockUseGoToResourceBatchUpdatePage to have been called now
    expect(mockUseGoToResourceBatchUpdatePage).toHaveBeenCalledTimes(1);
  });
});
