import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import { DatePeriod, Resource, ResourceState } from '../../common/lib/types';
import api from '../../common/utils/api/api';
import ResourcePage from './ResourcePage';

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
};

const testDatePeriod: DatePeriod = {
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

// We need wrap page with router because it renders a Link in the list and "You should not use <Link> outside a <Router>"
const renderResourcePageWithRouter = (): ReactWrapper =>
  mount(
    <Router>
      <ResourcePage id="tprek:8100" />
    </Router>
  );

describe(`<ResourcePage />`, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading indicator', async () => {
    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() => Promise.resolve(testResource));

    jest
      .spyOn(api, 'getDatePeriods')
      .mockImplementation(() => Promise.resolve([testDatePeriod]));

    const resourcePage = renderResourcePageWithRouter();

    await act(async () => {
      resourcePage.update(); // First tick to trigger useEffect to load
    });

    expect(resourcePage.find('h1').text()).toEqual(
      'Toimipisteen tietojen haku'
    );
  });

  it('should show error notification', async () => {
    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() =>
        Promise.reject(new Error('Failed to load a resource'))
      );

    const resourcePage = renderResourcePageWithRouter();

    await act(async () => {
      resourcePage.update(); // First tick for useEffect
    });

    resourcePage.update(); // Second tick for useState

    expect(resourcePage.find('h1').text()).toEqual('Virhe');
    expect(resourcePage.text()).toContain('Toimipistettä ei saatu ladattua.');
  });

  it('should show resource details', async () => {
    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() => Promise.resolve(testResource));

    jest
      .spyOn(api, 'getDatePeriods')
      .mockImplementation(() => Promise.resolve([testDatePeriod]));

    const resourcePage = renderResourcePageWithRouter();

    await act(async () => {
      resourcePage.update(); // First tick for useEffect
    });

    resourcePage.update(); // Second tick for useState

    expect(resourcePage.find('h1').text()).toEqual(testResource.name.fi);
    expect(resourcePage.find('address').text()).toEqual(
      testResource.address.fi
    );
    expect(resourcePage.find('#resource-description p').text()).toEqual(
      testResource.description.fi
    );
  });

  it('should show resource source link', async () => {
    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() => Promise.resolve(testResource));

    jest
      .spyOn(api, 'getDatePeriods')
      .mockImplementation(() => Promise.resolve([testDatePeriod]));

    const linkSelector = `a[href="${testResource.extra_data.admin_url}"]`;

    const resourcePage = renderResourcePageWithRouter();

    await act(async () => {
      resourcePage.update(); // First tick for useEffect
    });

    resourcePage.update(); // Second tick for useState

    expect(resourcePage.find(linkSelector).exists()).toBe(true);
    expect(resourcePage.find(linkSelector).prop('rel')).toBe(
      'noopener noreferrer'
    );
  });

  it.skip('Should successfully render a resource that has zero date periods', async () => {
    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() => Promise.resolve(testResource));

    jest
      .spyOn(api, 'getDatePeriods')
      .mockImplementation(() => Promise.resolve([]));

    const resourcePage = renderResourcePageWithRouter();

    await act(async () => {
      resourcePage.update(); // First tick for useEffect
    });

    resourcePage.update(); // Second tick for useState

    expect(resourcePage.find('h1').text()).toEqual(testResource.name.fi);
    expect(resourcePage.find('address').text()).toEqual(
      testResource.address.fi
    );
    expect(resourcePage.find('#resource-description p').text()).toEqual(
      testResource.description.fi
    );
  });
});
