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
import { ResourceType } from '../common/lib/types';
import api from '../common/utils/api/api';
import { TargetResourcesProps } from '../components/resource-opening-hours/ResourcePeriodsCopyFieldset';

const testResourceBatchUpdatePagePros: ResourceBatchUpdatePageProps = {
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

const renderPage = () =>
  render(
    <Router>
      <ResourceBatchUpdatePage {...testResourceBatchUpdatePagePros} />
    </Router>
  );

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
        'Toimipisteiden tietojen haku'
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
        'Virhe'
      );

      expect(
        await screen.findByText('Toimipisteitä ei saatu ladattua.')
      ).toBeInTheDocument();
    });
  });

  it('should call get resource api correctly', async () => {
    const apiGetResourceSpy = jest
      .spyOn(api, 'getResource')
      .mockImplementation(() => Promise.resolve(testGetResourceResponse));

    renderPage();

    await waitFor(async () => {
      expect(apiGetResourceSpy).toHaveBeenCalledWith(
        testResourceBatchUpdatePagePros.mainResourceId
      );
    });
  });

  it('should call get resources api correctly', async () => {
    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() => Promise.resolve(testGetResourceResponse));

    const apiGetResourcesSpy = jest
      .spyOn(api, 'getResources')
      .mockImplementation(() => Promise.resolve(testGetResourcesResponse));

    renderPage();

    await waitFor(async () => {
      expect(apiGetResourcesSpy).toHaveBeenCalledWith(
        testResourceBatchUpdatePagePros.targetResourcesString?.split(',')
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

    const afterRemove = {
      ...testTargetResourceData,
      targetResources: [
        testTargetResourceData.targetResources?.at(0),
        testTargetResourceData.targetResources?.at(2),
      ],
    };

    const storedData = sessionStorage.getItem('targetResources');

    expect(afterRemove.targetResources?.at(0)).toBeDefined();
    expect(afterRemove.targetResources?.at(1)).toBeDefined();
    expect(storedData).toEqual(JSON.stringify(afterRemove));
    expect(getByTestId(container, 'id-0')).toHaveTextContent(
      afterRemove.targetResources?.at(0)?.id || ''
    );
    expect(getByTestId(container, 'resource-0')).toHaveTextContent(
      afterRemove.targetResources?.at(0)?.name || ''
    );
    expect(getByTestId(container, 'id-1')).toHaveTextContent(
      afterRemove.targetResources?.at(1)?.id || ''
    );
    expect(getByTestId(container, 'resource-1')).toHaveTextContent(
      afterRemove.targetResources?.at(1)?.name || ''
    );
  });
});
