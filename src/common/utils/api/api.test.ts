/// <reference types="jest" />

import axios from 'axios';
import api from './api';
import * as auth from '../../../auth/auth-context';
import { AuthTokens } from '../../../auth/auth-context';
import { Resource, ResourceState } from '../../lib/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('apiRequest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('request', () => {
    it('adds auth-tokens into every request', async (done) => {
      const resourceId = 'tprek:8100';
      const queryTokens = {
        hsa_username: 'admin@hel.fi',
        hsa_created_at: '2020-11-05T09%3A38%3A36.198Z',
        hsa_valid_until: '2020-11-12T09%3A38%3A36.198Z',
        hsa_source: 'tprek',
        hsa_signature: '123456',
      };
      const mockTokens = queryTokens as AuthTokens;

      jest.spyOn(auth, 'getTokens').mockImplementationOnce(() => mockTokens);

      mockedAxios.request.mockResolvedValue({ data: 'ok' });

      await api.testResourcePostPermission(resourceId);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
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
          },
          method: 'post',
          url: 'http://localhost:8000/v1/resource/tprek:8100/permission_check/',
          data: {},
        })
      );

      done();
    });
  });

  describe('getResource', () => {
    it('fetches resource by id', async (done) => {
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
      };

      mockedAxios.request.mockResolvedValue({ data: mockResource });

      const response = await api.getResource('tprek:8100');

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request).toHaveBeenCalledWith({
        headers: { 'Content-Type': 'application/json' },
        method: 'get',
        params: { format: 'json' },
        url: 'http://localhost:8000/v1/resource/tprek:8100/',
      });

      expect(response).toBe(mockResource);

      done();
    });
  });

  describe('postDatePeriod', () => {
    it('creates a new opening period', async (done) => {
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

      mockedAxios.request.mockResolvedValue({ ...periodTobeCreated, id: 100 });

      await api.postDatePeriod(periodTobeCreated);
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request).toHaveBeenCalledWith({
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        url: 'http://localhost:8000/v1/date_period/',
        data: periodTobeCreated,
        validateStatus: expect.any(Function),
      });

      done();
    });
  });
});
