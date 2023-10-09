import React from 'react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen, waitFor, fireEvent, getByTestId } from '@testing-library/react';
import { AppContext } from '../App-context';
import ResourceBatchUpdatePage, {
  ResourceBatchUpdatePageProps,
} from './ResourceBatchUpdatePage';
import api from '../common/utils/api/api';

const testResourceBatchUpdatePagePros: ResourceBatchUpdatePageProps = {
  mainResourceId: 'tprek:10',
  targetResourcesString: 'tprek:11,tprek:12,tprek:13,tprek:14',
}

const testGetResourceResponse = {
  "id":1010,
  "name":{"fi":"test pk 10 fi", "sv":"test pk 10 sv", "en":"test pk 10 en"},
  "origins":[
    {"data_source":{"id":"tprek", "name":{"fi":"Toimipisterekisteri", "sv":null, "en":null}}, "origin_id":"10"},
    {"data_source":{"id":"asti", "name":{"fi":null, "sv":null, "en":null}}, "origin_id":"110"}
  ],
}

const testGetResourcesResponse = [
  {
    "id":1011,
    "name":{"fi":"test pk 11 fi", "sv":"test pk 11 sv", "en":"test pk 11 en"},
    "origins":[
      {"data_source":{"id":"tprek", "name":{"fi":"Toimipisterekisteri", "sv":null, "en":null}}, "origin_id":"11"},
      {"data_source":{"id":"asti", "name":{"fi":null, "sv":null, "en":null}}, "origin_id":"111"}
    ],
  },
  {
    "id":1012,
    "name":{"fi":"test pk 12 fi", "sv":"test pk 12 sv", "en":"test pk 12 en"},
    "origins":[
      {"data_source":{"id":"tprek", "name":{"fi":"Toimipisterekisteri", "sv":null, "en":null}}, "origin_id":"12"},
      {"data_source":{"id":"asti", "name":{"fi":null, "sv":null, "en":null}}, "origin_id":"112"}
    ],
  },
  {
    "id":1013,
    "name":{"fi":"test pk 13 fi", "sv":"test pk 13 sv", "en":"test pk 13 en"},
    "origins":[
      {"data_source":{"id":"tprek", "name":{"fi":"Toimipisterekisteri", "sv":null, "en":null}}, "origin_id":"13"},
      {"data_source":{"id":"asti", "name":{"fi":null, "sv":null, "en":null}}, "origin_id":"112"}
    ],
  }
]

const testTargetResourceData = {
  "mainResourceId": 1010,
  "mainResourceName": "test pk 10 fi",
  "targetResources": [
    {
      "id": "tprek:11",
      "name": "test pk 11 fi"
    },
    {
      "id": "tprek:12",
      "name": "test pk 12 fi"
    },
    {
      "id": "tprek:13",
      "name": "test pk 13 fi"
    }
  ]
}

const renderPage = () =>
  render(
    <Router>
      <ResourceBatchUpdatePage
        {...testResourceBatchUpdatePagePros}
      />
    </Router>
  );


describe(`<ResourceBatchUpdatePage />`, () => {
  beforeEach(() => {
    const sessionStorageMock = (() => {
      let store = {};

      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
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

    await act(async () => {renderPage()});

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
      .mockImplementation(() => Promise.resolve(true));

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
      .mockImplementation(() => Promise.resolve(true));

    const apiGetResourcesSpy = jest
      .spyOn(api, 'getResources')
      .mockImplementation(() => Promise.resolve(true));

    renderPage();

    await waitFor(async () => {
      expect(apiGetResourcesSpy).toHaveBeenCalledWith(
        testResourceBatchUpdatePagePros.targetResourcesString.split(',')
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

    await act(async () => {renderPage()});

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
    const removeButton = td.querySelector('button');
    fireEvent.click(removeButton);

    const testTargetResourceDataAfterRemove = {
      ...testTargetResourceData,
      targetResources: [
        testTargetResourceData.targetResources[0],
        testTargetResourceData.targetResources[2]
      ]
    };

    const storedData = sessionStorage.getItem('targetResources');

    expect(storedData).toEqual(JSON.stringify(testTargetResourceDataAfterRemove));
    expect(getByTestId(container, 'id-0')).toHaveTextContent(testTargetResourceDataAfterRemove.targetResources[0].id);
    expect(getByTestId(container, 'resource-0')).toHaveTextContent(testTargetResourceDataAfterRemove.targetResources[0].name);
    expect(getByTestId(container, 'id-1')).toHaveTextContent(testTargetResourceDataAfterRemove.targetResources[1].id);
    expect(getByTestId(container, 'resource-1')).toHaveTextContent(testTargetResourceDataAfterRemove.targetResources[1].name);
  });
});
