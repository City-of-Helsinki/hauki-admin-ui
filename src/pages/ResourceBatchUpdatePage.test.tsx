import React from 'react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  getByTestId,
} from '@testing-library/react';
import ResourceBatchUpdatePage, {
  ResourceBatchUpdatePageProps,
  ResourceWithOrigins,
} from './ResourceBatchUpdatePage';
import {
  ResourceType,
  DatePeriod,
  ResourceState,
  DatePeriodType,
} from '../common/lib/types';
import api from '../common/utils/api/api';
import { TargetResourcesProps } from '../components/resource-opening-hours/ResourcePeriodsCopyFieldset';
import {
  DatePeriodSelectState,
  SelectedDatePeriodsProvider,
} from '../common/selectedDatePeriodsContext/SelectedDatePeriodsContext';

const testResourceBatchUpdatePageProps: ResourceBatchUpdatePageProps = {
  mainResourceId: 'tprek:10',
  targetResourcesString: 'tprek:11,tprek:12,tprek:13,tprek:14',
};

const testGetResourceResponse: ResourceWithOrigins = {
  id: 1010,
  modified: '',
  name: { fi: 'test pk 10 fi', sv: 'test pk 10 sv', en: 'test pk 10 en' },
  description: { fi: '', sv: '', en: '' },
  address: { fi: '', sv: '', en: '' },
  extra_data: { citizen_url: '', admin_url: '' },
  parents: [],
  children: [],
  resource_type: ResourceType.UNIT,
  origins: [
    {
      data_source: {
        id: 'tprek',
        name: { fi: 'Toimipisterekisteri', sv: '', en: '' },
      },
      origin_id: '10',
    },
    {
      data_source: { id: 'asti', name: { fi: '', sv: '', en: '' } },
      origin_id: '110',
    },
  ],
};

const testGetResourcesResponse: ResourceWithOrigins[] = [
  {
    id: 1011,
    modified: '',
    name: { fi: 'test pk 11 fi', sv: 'test pk 11 sv', en: 'test pk 11 en' },
    description: { fi: '', sv: '', en: '' },
    address: { fi: '', sv: '', en: '' },
    extra_data: { citizen_url: '', admin_url: '' },
    parents: [],
    children: [],
    resource_type: ResourceType.UNIT,
    origins: [
      {
        data_source: {
          id: 'tprek',
          name: { fi: 'Toimipisterekisteri', sv: '', en: '' },
        },
        origin_id: '11',
      },
      {
        data_source: { id: 'asti', name: { fi: '', sv: '', en: '' } },
        origin_id: '111',
      },
    ],
  },
  {
    id: 1012,
    modified: '',
    name: { fi: 'test pk 12 fi', sv: 'test pk 12 sv', en: 'test pk 12 en' },
    description: { fi: '', sv: '', en: '' },
    address: { fi: '', sv: '', en: '' },
    extra_data: { citizen_url: '', admin_url: '' },
    parents: [],
    children: [],
    resource_type: ResourceType.UNIT,
    origins: [
      {
        data_source: {
          id: 'tprek',
          name: { fi: 'Toimipisterekisteri', sv: '', en: '' },
        },
        origin_id: '12',
      },
      {
        data_source: { id: 'asti', name: { fi: '', sv: '', en: '' } },
        origin_id: '112',
      },
    ],
  },
  {
    id: 1013,
    modified: '',
    name: { fi: 'test pk 13 fi', sv: 'test pk 13 sv', en: 'test pk 13 en' },
    description: { fi: '', sv: '', en: '' },
    address: { fi: '', sv: '', en: '' },
    extra_data: { citizen_url: '', admin_url: '' },
    parents: [],
    children: [],
    resource_type: ResourceType.UNIT,
    origins: [
      {
        data_source: {
          id: 'tprek',
          name: { fi: 'Toimipisterekisteri', sv: '', en: '' },
        },
        origin_id: '13',
      },
      {
        data_source: { id: 'asti', name: { fi: '', sv: '', en: '' } },
        origin_id: '112',
      },
    ],
  },
];

const testTargetResourceData: TargetResourcesProps = {
  mainResourceId: 1010,
  mainResourceName: 'test pk 10 fi',
  targetResources: [
    {
      id: 'tprek:11',
      name: 'test pk 11 fi',
    },
    {
      id: 'tprek:12',
      name: 'test pk 12 fi',
    },
    {
      id: 'tprek:13',
      name: 'test pk 13 fi',
    },
  ],
};

// same as testTargetResourceData, but second target resource removed
const testTargetAfterRemove: TargetResourcesProps = {
  mainResourceId: 1010,
  mainResourceName: 'test pk 10 fi',
  targetResources: [
    {
      id: 'tprek:11',
      name: 'test pk 11 fi',
    },
    {
      id: 'tprek:13',
      name: 'test pk 13 fi',
    },
  ],
};

// mock selectedDatePeriods
const mockSelectedDatePeriods: DatePeriod[] = [
  {
    name: { fi: 'Kekkosen synttärit!', sv: null, en: null },
    endDate: null,
    fixed: false,
    startDate: '14.11.2023',
    openingHours: [
      {
        weekdays: [1, 2, 3, 4, 5],
        timeSpanGroups: [
          {
            rule: { group: 92, type: 'week_every' },
            timeSpans: [
              {
                id: 146,
                description: { fi: null, sv: null, en: null },
                end_time: '22:11',
                full_day: false,
                resource_state: ResourceState.OPEN,
                start_time: '11:22',
              },
            ],
          },
        ],
      },
      {
        weekdays: [6, 7],
        timeSpanGroups: [
          {
            rule: { group: 92, type: 'week_every' },
            timeSpans: [
              {
                id: 147,
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
    id: 179,
    resourceState: undefined,
    override: false,
    isActive: false,
    type: DatePeriodType.NORMAL,
  },
  {
    name: { fi: 'testipoikkeus', sv: '', en: '' },
    endDate: '15.11.2023',
    fixed: true,
    startDate: '15.11.2023',
    openingHours: [],
    id: 186,
    resourceState: ResourceState.CLOSED,
    override: true,
    isActive: true,
    type: DatePeriodType.EXCEPTION,
  },
  {
    name: { fi: '2. joulupäivä', sv: 'Annandag jul', en: 'Boxing Day' },
    endDate: '26.12.2023',
    fixed: true,
    startDate: '26.12.2023',
    openingHours: [],
    id: 172,
    resourceState: ResourceState.CLOSED,
    override: true,
    isActive: false,
    type: DatePeriodType.HOLIDAY,
  },
];

jest.mock('react-i18next', () => ({
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

jest.mock('../services/useDatePeriodConfig', () => ({
  __esModule: true,
  default: jest.fn(() => [false, jest.fn()]),
}));

const renderPage = () => {
  return render(
    <Router>
      <SelectedDatePeriodsProvider>
        <ResourceBatchUpdatePage {...testResourceBatchUpdatePageProps} />
      </SelectedDatePeriodsProvider>
    </Router>
  );
};

describe(`<ResourceBatchUpdatePage />`, () => {
  beforeEach(() => {
    const sessionStorageMock = (() => {
      const store: { [key: string]: string } = {};

      return {
        getItem: (key: string | number) => store[key] || null,
        setItem: (key: string | number, value: { toString: () => string }) => {
          store[key] = value.toString();
        },
      };
    })();

    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading indicator', async () => {
    jest
      .spyOn(api, 'getResource')
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .mockImplementation(() => new Promise(() => {}));

    renderPage();

    await act(async () => {
      expect(await screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'ResourcePage.Notifications.IsLoadingResources'
      );
    });
  });

  it('should show error notification when api fails', async () => {
    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() =>
        Promise.reject(new Error('Failed to load a resource'))
      );

    await act(async () => {
      renderPage();
    });

    await act(async () => {
      expect(await screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'ResourcePage.Notifications.Error'
      );

      expect(
        (
          await screen.findAllByText(
            'ResourcePage.Notifications.ErrorLoadingResource'
          )
        )[0]
      ).toBeInTheDocument();
    });
  });

  it('should call get resource api correctly', async () => {
    const apiGetResourceSpy = jest
      .spyOn(api, 'getResource')
      .mockResolvedValue(testGetResourceResponse);

    renderPage();

    await waitFor(async () => {
      expect(apiGetResourceSpy).toHaveBeenCalledWith(
        testResourceBatchUpdatePageProps.mainResourceId
      );
    });
  });

  it('should call get resources api correctly', async () => {
    jest.spyOn(api, 'getResource').mockResolvedValue(testGetResourceResponse);

    const apiGetResourcesSpy = jest
      .spyOn(api, 'getResources')
      .mockResolvedValue(testGetResourcesResponse);

    renderPage();

    await waitFor(async () => {
      expect(apiGetResourcesSpy).toHaveBeenCalledWith(
        testResourceBatchUpdatePageProps.targetResourcesString?.split(',')
      );
    });
  });

  it('should write correct target resource data to session storage', async () => {
    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() => Promise.resolve(testGetResourceResponse));

    jest
      .spyOn(api, 'getResources')
      .mockImplementation(() => Promise.resolve(testGetResourcesResponse));

    await act(async () => {
      renderPage();
    });

    const storedData = sessionStorage.getItem('targetResources');

    expect(storedData).toEqual(JSON.stringify(testTargetResourceData));
  });

  it('should have correct items on resource list and session storage after remove', async () => {
    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() => Promise.resolve(testGetResourceResponse));

    jest
      .spyOn(api, 'getResources')
      .mockImplementation(() => Promise.resolve(testGetResourcesResponse));

    const { container } = renderPage();

    await waitFor(() => {
      expect(getByTestId(container, 'remove-1')).toBeInTheDocument();
    });

    const td = getByTestId(container, 'remove-1');
    const removeButton = td.querySelector('button') as Element;
    fireEvent.click(removeButton);

    type TargetResource = { id: string; name: string };
    const res0 = (
      testTargetAfterRemove.targetResources as TargetResource[]
    )[0] as TargetResource;
    const res1 = (
      testTargetAfterRemove.targetResources as TargetResource[]
    )[1] as TargetResource;

    expect(sessionStorage.getItem('targetResources')).toEqual(
      JSON.stringify(testTargetAfterRemove)
    );
    expect(getByTestId(container, 'id-0')).toHaveTextContent(res0.id);
    expect(getByTestId(container, 'resource-0')).toHaveTextContent(res0.name);
    expect(getByTestId(container, 'id-1')).toHaveTextContent(res1.id);
    expect(getByTestId(container, 'resource-1')).toHaveTextContent(res1.name);
  });

  it('Should display all selectedDatePeriods from SelectedDatePeriodContext', async () => {
    const mockUseSelectedDatePeriodsContext = jest.fn(() => {
      return {
        datePeriodSelectState: DatePeriodSelectState.INACTIVE,
        selectedDatePeriods: mockSelectedDatePeriods,
      };
    });

    jest
      .spyOn(
        // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
        require('../common/selectedDatePeriodsContext/SelectedDatePeriodsContext'),
        'useSelectedDatePeriodsContext'
      )
      .mockImplementation(() => mockUseSelectedDatePeriodsContext());

    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() => Promise.resolve(testGetResourceResponse));

    jest
      .spyOn(api, 'getResources')
      .mockImplementation(() => Promise.resolve(testGetResourcesResponse));

    const datePeriodsInMockData = mockSelectedDatePeriods.map(
      (sdp) => sdp.name.fi || 'empty'
    );

    const { container } = renderPage();

    const sectionElements = container.getElementsByClassName(
      'opening-periods-section'
    );

    expect(
      await screen.findByText('ResourcePage.OpeningPeriodsSection.BatchTitle')
    ).toBeDefined();

    expect(sectionElements.length === datePeriodsInMockData.length).toBe(true);

    datePeriodsInMockData.forEach((datePeriodName) => {
      expect(screen.getByText(datePeriodName)).toBeDefined();
    });
  });
});
