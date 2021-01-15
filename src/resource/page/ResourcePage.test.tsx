import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
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
  children: [123],
  parents: [321],
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

describe(`<ResourcePage />`, () => {
  beforeEach(() => {
    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() => Promise.resolve(testResource));

    jest
      .spyOn(api, 'getDatePeriods')
      .mockImplementation(() => Promise.resolve([testDatePeriod]));

    jest
      .spyOn(api, 'getChildResourcesByParentId')
      .mockImplementation(() => Promise.resolve([testChildResource]));

    jest
      .spyOn(api, 'getParentResourcesByChildId')
      .mockImplementation(() => Promise.resolve([testParentResource]));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading indicator', async () => {
    jest
      .spyOn(api, 'getResource')
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .mockImplementation(() => new Promise(() => {}));

    render(
      <Router>
        <ResourcePage id="tprek:8100" />
      </Router>
    );

    await act(async () => {
      expect(await screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Toimipisteen tietojen haku'
      );
    });
  });

  it('should show error notification', async () => {
    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() =>
        Promise.reject(new Error('Failed to load a resource'))
      );

    await act(async () => {
      render(
        <Router>
          <ResourcePage id="tprek:8100" />
        </Router>
      );
    });

    await act(async () => {
      expect(await screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Virhe'
      );

      expect(
        await screen.findByText('Toimipistettä ei saatu ladattua.')
      ).toBeInTheDocument();
    });
  });

  it('should show resource details', async () => {
    await act(async () => {
      render(
        <Router>
          <ResourcePage id="tprek:8100" />
        </Router>
      );
    });

    await act(async () => {
      expect(await screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        testResource.name.fi
      );
      expect(
        await screen.findByText(testResource.address.fi)
      ).toBeInTheDocument();

      expect(
        await screen.findByText(testResource.description.fi)
      ).toBeInTheDocument();
    });
  });

  it('should show child resources', async () => {
    let container: Element;
    await act(async () => {
      container = render(
        <Router>
          <ResourcePage id="tprek:8100" />
        </Router>
      ).container;
    });

    await act(async () => {
      expect(
        await container.querySelector(
          'p[data-test="child-resource-description"]'
        )
      ).toBeInTheDocument();

      expect(
        await container.querySelector(
          'p[data-test="child-resource-description-0"]'
        )
      ).toHaveTextContent(testChildResource.description.fi);

      expect(
        await container.querySelector('a[data-test="child-resource-name-0"]')
      ).toHaveTextContent(testChildResource.name.fi);
    });
  });

  it('should show parent resources', async () => {
    let container: Element;
    await act(async () => {
      container = render(
        <Router>
          <ResourcePage id="tprek:8100" />
        </Router>
      ).container;
    });

    await act(async () => {
      expect(
        await container.querySelector(
          'p[data-test="parent-resource-description"]'
        )
      ).toBeInTheDocument();

      expect(
        await container.querySelector(
          'p[data-test="parent-resource-description-0"]'
        )
      ).toHaveTextContent(testParentResource.description.fi);

      expect(
        await container.querySelector('a[data-test="parent-resource-name-0"]')
      ).toHaveTextContent(testParentResource.name.fi);
    });
  });

  it('should show resource source link', async () => {
    let container: Element;
    await act(async () => {
      container = render(
        <Router>
          <ResourcePage id="tprek:8100" />
        </Router>
      ).container;
    });

    const linkSelector = `a[href="${testResource.extra_data.admin_url}"]`;

    await act(async () => {
      expect(await container.querySelector(linkSelector)).toBeInTheDocument();
      expect(await container.querySelector(linkSelector)).toHaveAttribute(
        'rel',
        'noopener noreferrer'
      );
    });
  });

  it('Should successfully render a resource that has zero date periods', async () => {
    await act(async () => {
      render(
        <Router>
          <ResourcePage id="tprek:8100" />
        </Router>
      );
    });

    jest
      .spyOn(api, 'getDatePeriods')
      .mockImplementation(() => Promise.resolve([]));

    await act(async () => {
      expect(await screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        testResource.name.fi
      );
      expect(
        await screen.findByText(testResource.address.fi)
      ).toBeInTheDocument();

      expect(
        await screen.findByText(testResource.description.fi)
      ).toBeInTheDocument();
    });
  });
});
