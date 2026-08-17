import api from './api';
import * as auth from '../../../auth/auth-context';
import { AuthTokens } from '../../../auth/auth-context';
import { Resource, ResourceState, ResourceType } from '../../lib/types';

const mockFetch = vi.fn();

describe('apiRequest', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('request', () => {
    it('adds auth-tokens into every request', async () => {
      const resourceId = 'tprek:8100';
      const queryTokens = {
        hsa_username: 'admin@hel.fi',
        hsa_created_at: '2020-11-05T09%3A38%3A36.198Z',
        hsa_valid_until: '2020-11-12T09%3A38%3A36.198Z',
        hsa_source: 'tprek',
        hsa_signature: '123456',
      };
      const mockTokens = queryTokens as AuthTokens;

      vi.spyOn(auth, 'getTokens').mockImplementationOnce(() => mockTokens);

      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({ has_permission: false }),
      });

      await api.testResourcePostPermission(resourceId);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [calledUrl, calledOptions] = mockFetch.mock.calls[0];
      expect(calledUrl).toBe(
        'http://localhost:8000/v1/resource/tprek:8100/permission_check/'
      );
      expect(calledOptions.method).toBe('POST');
      expect(calledOptions.headers).toMatchObject({
        'Content-Type': 'application/json',
        Authorization: `haukisigned hsa_username=${encodeURIComponent(
          queryTokens.hsa_username
        )}&hsa_created_at=${encodeURIComponent(
          queryTokens.hsa_created_at
        )}&hsa_valid_until=${encodeURIComponent(
          queryTokens.hsa_valid_until
        )}&hsa_source=${encodeURIComponent(
          queryTokens.hsa_source
        )}&hsa_signature=123456`,
      });
    });

    it('returns undefined for a 204 response', async () => {
      mockFetch.mockResolvedValueOnce({ status: 204 });

      await expect(api.deleteDatePeriod(42)).resolves.toBeUndefined();
    });

    it('throws when the response status is an error', async () => {
      mockFetch.mockResolvedValueOnce({ status: 500 });

      await expect(api.getDatePeriod(42)).rejects.toThrow(
        'Request failed with status 500'
      );
    });
  });

  describe('getResource', () => {
    it('fetches resource by id', async () => {
      const mockResource: Resource = {
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

      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve(mockResource),
      });

      const response = await api.getResource('tprek:8100');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [calledUrl, calledOptions] = mockFetch.mock.calls[0];
      expect(calledUrl).toBe(
        'http://localhost:8000/v1/resource/tprek:8100/?format=json'
      );
      expect(calledOptions).toMatchObject({
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(response).toBe(mockResource);
    });

    it('fetches resource by numeric id', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({}),
      });

      await api.getResource('1186');

      const [calledUrl] = mockFetch.mock.calls[0];
      expect(calledUrl).toBe(
        'http://localhost:8000/v1/resource/1186/?format=json'
      );
    });

    it('rejects ids that would tamper with the request url', async () => {
      const invalidIds = [
        '../../secret',
        '..%2F..%2Fsecret',
        'tprek:8100/../..',
        '1?ordering=name',
        '1#fragment',
        '//evil.com',
        'tprek:',
        '',
      ];

      await Promise.all(
        invalidIds.map((id) =>
          expect(api.getResource(id)).rejects.toThrow('Invalid resource id')
        )
      );

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('testResourcePostPermission', () => {
    it('rejects ids that would tamper with the request url', async () => {
      await expect(
        api.testResourcePostPermission('../../secret')
      ).rejects.toThrow('Invalid resource id');

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('resource endpoints', () => {
    const mockJson = (body: unknown): void => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve(body),
      });
    };

    const calledUrl = (): URL => new URL(mockFetch.mock.calls[0][0]);

    const calledParams = (): Record<string, string> =>
      Object.fromEntries(calledUrl().searchParams);

    it('fetches several resources by ids', async () => {
      mockJson({ results: [{ id: 1 }, { id: 2 }] });

      const response = await api.getResources(['tprek:8100', 'tprek:8101']);

      expect(calledUrl().pathname).toBe('/v1/resource/');
      expect(calledParams()).toEqual({
        resource_ids: 'tprek:8100,tprek:8101',
        format: 'json',
      });
      expect(response).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('fetches child resources by parent id', async () => {
      mockJson({ results: [{ id: 2 }] });

      const response = await api.getChildResourcesByParentId(1186);

      expect(calledUrl().pathname).toBe('/v1/resource/');
      expect(calledParams()).toEqual({ parent: '1186', format: 'json' });
      expect(response).toEqual([{ id: 2 }]);
    });

    it('fetches parent resources by child id', async () => {
      mockJson({ results: [{ id: 1 }] });

      const response = await api.getParentResourcesByChildId(1186);

      expect(calledUrl().pathname).toBe('/v1/resource/');
      expect(calledParams()).toEqual({ child: '1186', format: 'json' });
      expect(response).toEqual([{ id: 1 }]);
    });

    it('checks resource permission with a namespaced id', async () => {
      mockJson({ has_permission: true });

      const response = await api.testResourcePostPermission('tprek:8100');

      expect(response).toBe(true);
    });

    it('copies date periods to target resources', async () => {
      mockJson({ has_permission: true });

      await api.copyDatePeriods(1186, ['tprek:8101', 'tprek:8102'], true, [
        '1',
        '2',
      ]);

      expect(calledUrl().pathname).toBe('/v1/resource/1186/copy_date_periods/');
      expect(calledParams()).toEqual({
        replace: 'true',
        target_resources: 'tprek:8101,tprek:8102',
        date_period_ids: '1,2',
      });
    });

    it('omits date period ids when copying every period', async () => {
      mockJson({ has_permission: false });

      await api.copyDatePeriods(1186, ['tprek:8101'], false);

      expect(calledParams()).toEqual({
        replace: 'false',
        target_resources: 'tprek:8101',
      });
    });
  });

  describe('date period endpoints', () => {
    const datePeriod = {
      id: 42,
      resource: 1186,
      name: { fi: 'nimi', sv: null, en: null },
      description: { fi: 'kuvaus', sv: null, en: null },
      start_date: '2020-10-27',
      end_date: '2020-10-28',
      resource_state: ResourceState.OPEN,
      override: false,
      time_span_groups: [],
    };

    const mockJson = (body: unknown): void => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve(body),
      });
    };

    const called = (): [URL, Record<string, unknown>] => [
      new URL(mockFetch.mock.calls[0][0]),
      mockFetch.mock.calls[0][1],
    ];

    it('fetches active date periods for a resource', async () => {
      mockJson([datePeriod]);

      await api.getDatePeriods(1186);

      const [url] = called();
      expect(url.pathname).toBe('/v1/date_period/');
      expect(Object.fromEntries(url.searchParams)).toEqual({
        resource: '1186',
        end_date_gte: '-1d',
        format: 'json',
      });
    });

    it('fetches past date periods for a resource', async () => {
      mockJson([datePeriod]);

      await api.getPastDatePeriods(1186);

      const [url] = called();
      expect(Object.fromEntries(url.searchParams)).toEqual({
        resource: '1186',
        end_date_lt: '0d',
        format: 'json',
      });
    });

    it('limits past date periods with an end date', async () => {
      mockJson([datePeriod]);

      await api.getPastDatePeriods(1186, '2020-01-01');

      const [url] = called();
      expect(Object.fromEntries(url.searchParams)).toEqual({
        resource: '1186',
        end_date_lt: '0d',
        end_date_gte: '2020-01-01',
        format: 'json',
      });
    });

    it('fetches a single date period', async () => {
      mockJson(datePeriod);

      const response = await api.getDatePeriod(42);

      const [url, options] = called();
      expect(url.pathname).toBe('/v1/date_period/42/');
      expect(options).toMatchObject({ method: 'GET' });
      expect(response).toEqual(datePeriod);
    });

    it('replaces a date period with PUT', async () => {
      mockJson(datePeriod);

      await api.putDatePeriod(datePeriod);

      const [url, options] = called();
      expect(url.pathname).toBe('/v1/date_period/42/');
      expect(options).toMatchObject({
        method: 'PUT',
        body: JSON.stringify(datePeriod),
      });
    });

    it('updates a date period with PATCH', async () => {
      mockJson(datePeriod);

      await api.patchDatePeriod(datePeriod);

      const [url, options] = called();
      expect(url.pathname).toBe('/v1/date_period/42/');
      expect(options).toMatchObject({
        method: 'PATCH',
        body: JSON.stringify(datePeriod),
      });
    });

    it('deletes a date period', async () => {
      mockJson({ success: true });

      const response = await api.deleteDatePeriod(42);

      const [url, options] = called();
      expect(url.pathname).toBe('/v1/date_period/42/');
      expect(options).toMatchObject({ method: 'DELETE' });
      expect(response).toEqual({ success: true });
    });
  });

  describe('auth endpoints', () => {
    it('invalidates the signature without the version prefix', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      const response = await api.invalidateAuth();

      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe('http://localhost:8000/invalidate_signature/');
      expect(options).toMatchObject({ method: 'POST' });
      expect(response).toBe(true);
    });

    it('calls the auth test endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () =>
          Promise.resolve({ message: 'ok', username: 'admin@hel.fi' }),
      });

      const response = await api.testAuth();

      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe(
        'http://localhost:8000/v1/auth_required_test/?format=json'
      );
      expect(response).toEqual({ message: 'ok', username: 'admin@hel.fi' });
    });
  });

  describe('postDatePeriod', () => {
    it('creates a new opening period', async () => {
      const periodTobeCreated = {
        resource: 1186,
        name: {
          fi: 'testiotsikko suomeksi',
          sv: 'testiotsikko ruotsiksi',
          en: 'testiotsikko englanniksi',
        },
        description: {
          fi: 'testikuvaus suomeksi',
          sv: 'testikuvaus ruotsiksi',
          en: 'testikuvaus englanniksi',
        },
        start_date: '2020-10-27',
        end_date: '2020-10-28',
        resource_state: ResourceState.OPEN,
        override: false,
        time_span_groups: [],
      };

      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({ ...periodTobeCreated, id: 100 }),
      });

      await api.postDatePeriod(periodTobeCreated);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [calledUrl, calledOptions] = mockFetch.mock.calls[0];
      expect(calledUrl).toBe('http://localhost:8000/v1/date_period/');
      expect(calledOptions).toMatchObject({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(periodTobeCreated),
      });
    });
  });

  describe('patchDatePeriodOrder', () => {
    it('sends a PATCH request with only the order field', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({ id: 42, order: 3 }),
      });

      await api.patchDatePeriodOrder(42, 3);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [calledUrl, calledOptions] = mockFetch.mock.calls[0];
      expect(calledUrl).toBe('http://localhost:8000/v1/date_period/42/');
      expect(calledOptions).toMatchObject({
        method: 'PATCH',
        body: JSON.stringify({ order: 3 }),
      });
    });

    it('sends null order when clearing order', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({ id: 7, order: null }),
      });

      await api.patchDatePeriodOrder(7, null);

      const [calledUrl, calledOptions] = mockFetch.mock.calls[0];
      expect(calledUrl).toBe('http://localhost:8000/v1/date_period/7/');
      expect(calledOptions).toMatchObject({
        method: 'PATCH',
        body: JSON.stringify({ order: null }),
      });
    });
  });

  describe('getDatePeriodFormOptions', () => {
    it('should convert options to ui config', async () => {
      const datePeriodOptions = {
        actions: {
          POST: {
            name: { max_length: 255 },
            resource_state: {
              choices: [
                {
                  display_name: { fi: 'Auki', sv: 'Auki', en: 'Open' },
                  value: 'open',
                },
                {
                  display_name: 'Kiinni',
                  value: 'closed',
                },
              ],
            },
            time_span_groups: {
              child: {
                children: {
                  rules: {
                    child: {
                      children: {
                        context: {
                          required: true,
                          choices: [
                            {
                              display_name: {
                                fi: 'Jakso',
                                sv: 'Jakso',
                                en: 'Period',
                              },
                              value: 'period',
                            },
                          ],
                        },
                        frequency_modifier: {
                          required: false,
                          choices: [
                            {
                              display_name: {
                                fi: 'Parillinen',
                                sv: 'Parillinen',
                                en: 'Even',
                              },
                              value: 'even',
                            },
                            {
                              display_name: {
                                fi: 'Pariton',
                                sv: 'Pariton',
                                en: 'Odd',
                              },
                              value: 'odd',
                            },
                          ],
                        },
                        subject: {
                          required: true,
                          choices: [],
                        },
                        start: {
                          required: false,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve(datePeriodOptions),
      });

      const response = await api.getDatePeriodFormConfig();
      expect(response).toEqual({
        name: { max_length: 255 },
        resourceState: {
          options: [
            {
              label: {
                fi: 'Auki',
                sv: 'Auki',
                en: 'Open',
              },
              value: 'open',
            },
            {
              label: {
                fi: 'Kiinni',
                sv: null,
                en: null,
              },
              value: 'closed',
            },
          ],
        },
        timeSpanGroup: {
          rule: {
            context: {
              required: true,
              options: [
                {
                  label: {
                    fi: 'Jakso',
                    sv: 'Jakso',
                    en: 'Period',
                  },
                  value: 'period',
                },
              ],
            },
            subject: {
              required: true,
              options: [],
            },
            frequencyModifier: {
              required: false,
              options: [
                {
                  label: {
                    fi: 'Parillinen',
                    sv: 'Parillinen',
                    en: 'Even',
                  },
                  value: 'even',
                },
                {
                  label: {
                    fi: 'Pariton',
                    sv: 'Pariton',
                    en: 'Odd',
                  },
                  value: 'odd',
                },
              ],
            },
            start: {
              required: false,
            },
          },
        },
      });
    });
  });
});
