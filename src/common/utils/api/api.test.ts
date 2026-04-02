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
