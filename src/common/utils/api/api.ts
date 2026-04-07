import * as querystring from 'querystring';
import { ParsedUrlQueryInput } from 'querystring';
import {
  ApiChoice,
  ApiDatePeriod,
  UiDatePeriodConfig,
  DatePeriodOptions,
  LanguageStrings,
  Resource,
  ResourceState,
  ApiTimeSpanGroup,
  TranslatedApiChoice,
} from '../../lib/types';
import { AuthTokens, getTokens } from '../../../auth/auth-context';

 
const apiBaseUrl: string = window._env_?.API_URL || 'http://localhost:8000';

const resourceBasePath = '/resource';
const datePeriodBasePath = '/date_period';
const authRequiredTest = '/auth_required_test';
const invalidateAuthPath = '/invalidate_signature';

interface RequestParameters {
  [key: string]:
    | string
    | number
    | boolean
    | ReadonlyArray<string>
    | ReadonlyArray<number>
    | ReadonlyArray<boolean>
    | undefined
    | LanguageStrings
    | ApiTimeSpanGroup[]
    | ResourceState
    | null;
}

interface GetParameters {
  path: string;
  headers?: { [key: string]: string };
  parameters?: RequestParameters;
}

interface DataRequestParameters {
  path: string;
  headers?: { [key: string]: string };
  data?: RequestParameters;
}

interface OptionsParameters {
  path: string;
}

interface PostParameters extends DataRequestParameters {
  useRootPath?: boolean;
  parameters?: RequestParameters;
}

type PutRequestParameters = DataRequestParameters;

enum ApiResponseFormat {
  json = 'json',
}

interface ApiParameters extends RequestParameters {
  format: ApiResponseFormat;
}

interface FetchRequestConfig {
  url: string;
  method: string;
  headers?: { [key: string]: string };
  params?: RequestParameters;
  data?: RequestParameters;
}

const convertApiChoiceToTranslatedApiChoice = (
  apiChoice: ApiChoice
): TranslatedApiChoice => {
  if (typeof apiChoice.display_name === 'string') {
    return {
      value: apiChoice.value,
      label: {
        fi: apiChoice.display_name,
        sv: null,
        en: null,
      },
    };
  }
  return {
    value: apiChoice.value,
    label: {
      fi: apiChoice.display_name.fi,
      sv: apiChoice.display_name.sv,
      en: apiChoice.display_name.en,
    },
  };
};

const buildUrl = (base: string, params?: RequestParameters): string => {
  if (!params || Object.keys(params).length === 0) return base;
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `${base}?${query}` : base;
};

const addAuthHeader = (
  authTokens: AuthTokens,
  headers: { [key: string]: string }
): { [key: string]: string } => ({
  ...headers,
  Authorization: `haukisigned ${querystring.stringify(
    authTokens as unknown as ParsedUrlQueryInput
  )}`,
});

async function request<T>(config: FetchRequestConfig): Promise<T> {
  const authTokens: AuthTokens | undefined = getTokens();
  const headers: { [key: string]: string } = authTokens
    ? addAuthHeader(authTokens, config.headers ?? {})
    : (config.headers ?? {});

  const url = buildUrl(config.url, config.params);
  const hasBody = ['post', 'put', 'patch'].includes(
    config.method.toLowerCase()
  );

  const response = await fetch(url, {
    method: config.method.toUpperCase(),
    headers,
    ...(hasBody ? { body: JSON.stringify(config.data ?? {}) } : {}),
  });

  if (response.status >= 300) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

async function apiGet<T>({ path, parameters = {} }: GetParameters): Promise<T> {
  const apiParameters: ApiParameters = {
    ...parameters,
    format: ApiResponseFormat.json,
  };

  return request<T>({
    url: `${apiBaseUrl}/v1${path}/`,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'get',
    params: apiParameters,
  });
}

async function apiPost<T>({
  path,
  data = {},
  useRootPath = false,
  parameters,
}: PostParameters): Promise<T> {
  return request<T>({
    url: `${apiBaseUrl}${useRootPath ? '' : '/v1'}${path}/`,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    data,
    params: parameters,
  });
}

async function apiPut<T>({
  path,
  data = {},
}: PutRequestParameters): Promise<T> {
  return request<T>({
    url: `${apiBaseUrl}/v1${path}/`,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'put',
    data,
  });
}

async function apiPatch<T>({
  path,
  data = {},
}: PutRequestParameters): Promise<T> {
  return request<T>({
    url: `${apiBaseUrl}/v1${path}/`,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'patch',
    data,
  });
}

async function apiOptions<T>({ path }: OptionsParameters): Promise<T> {
  return request<T>({
    url: `${apiBaseUrl}/v1${path}/`,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'options',
  });
}

async function apiDelete<T>({ path }: GetParameters): Promise<T> {
  return request<T>({
    url: `${apiBaseUrl}/v1${path}/`,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'delete',
  });
}

interface AuthTestResponse {
  message: string;
  username: string;
}

export interface InvalidateAuthResponse {
  success: boolean;
}

export interface PermissionResponse {
  has_permission: boolean;
}

export default {
  invalidateAuth: async (): Promise<boolean> => {
    const successResponse = await apiPost<InvalidateAuthResponse>({
      path: invalidateAuthPath,
      useRootPath: true,
    });

    return successResponse.success;
  },

  getResource: (id: string): Promise<Resource> =>
    apiGet<Resource>({ path: `${resourceBasePath}/${id}` }),

  getResources: (ids: string[]): Promise<Resource[]> =>
    apiGet<{ results: Resource[] }>({
      path: `${resourceBasePath}`,
      parameters: {
        resource_ids: ids.join(','),
      },
    }).then((response) => response.results),

  getChildResourcesByParentId: (id: number): Promise<Resource[]> =>
    apiGet<{ results: Resource[] }>({
      path: `${resourceBasePath}`,
      parameters: {
        parent: id,
      },
    }).then((response) => response.results),

  getParentResourcesByChildId: (id: number): Promise<Resource[]> =>
    apiGet<{ results: Resource[] }>({
      path: `${resourceBasePath}`,
      parameters: {
        child: id,
      },
    }).then((response) => response.results),

  getDatePeriods: (resourceId: number): Promise<ApiDatePeriod[]> =>
    apiGet<ApiDatePeriod[]>({
      path: `${datePeriodBasePath}`,
      parameters: { resource: resourceId, end_date_gte: '-1d' },
    }),

  getPastDatePeriods: (
    resourceId: number,
    endDateGte?: string
  ): Promise<ApiDatePeriod[]> =>
    apiGet<ApiDatePeriod[]>({
      path: `${datePeriodBasePath}`,
      parameters: {
        resource: resourceId,
        end_date_lt: '0d',
        ...(endDateGte ? { end_date_gte: endDateGte } : {}),
      },
    }),

  getDatePeriod: (datePeriodId: number): Promise<ApiDatePeriod> =>
    apiGet<ApiDatePeriod>({
      path: `${datePeriodBasePath}/${datePeriodId}`,
    }),

  getDatePeriodFormConfig: async (): Promise<UiDatePeriodConfig> => {
    const response = await apiOptions<DatePeriodOptions>({
      path: `${datePeriodBasePath}`,
    });

    const configResponse = response.actions.POST;

    const resourceStateChoices = configResponse.resource_state.choices;

    const resourceStateOptions: TranslatedApiChoice[] =
      resourceStateChoices.map(convertApiChoiceToTranslatedApiChoice);

    const timeSpanGroupOptions =
      configResponse.time_span_groups.child.children.rules.child.children;

    const ruleContextOptions: TranslatedApiChoice[] =
      timeSpanGroupOptions.context.choices.map(
        convertApiChoiceToTranslatedApiChoice
      );

    const ruleSubjectOptions: TranslatedApiChoice[] =
      timeSpanGroupOptions.subject.choices.map(
        convertApiChoiceToTranslatedApiChoice
      );

    const ruleFrequencyModifierOptions: TranslatedApiChoice[] =
      timeSpanGroupOptions.frequency_modifier.choices.map(
        convertApiChoiceToTranslatedApiChoice
      );

    return {
      name: configResponse.name,
      resourceState: {
        options: resourceStateOptions,
      },
      timeSpanGroup: {
        rule: {
          context: {
            options: ruleContextOptions,
            required: timeSpanGroupOptions.context.required,
          },
          subject: {
            options: ruleSubjectOptions,
            required: timeSpanGroupOptions.subject.required,
          },
          frequencyModifier: {
            options: ruleFrequencyModifierOptions,
            required: timeSpanGroupOptions.frequency_modifier.required,
          },
          start: {
            required: timeSpanGroupOptions.start.required,
          },
        },
      },
    };
  },

  postDatePeriod: (datePeriod: ApiDatePeriod): Promise<ApiDatePeriod> =>
    apiPost<ApiDatePeriod>({
      path: `${datePeriodBasePath}`,
      data: datePeriod,
    }),

  putDatePeriod: (datePeriod: ApiDatePeriod): Promise<ApiDatePeriod> =>
    apiPut<ApiDatePeriod>({
      path: `${datePeriodBasePath}/${datePeriod.id}`,
      data: datePeriod,
    }),

  patchDatePeriod: (datePeriod: ApiDatePeriod): Promise<ApiDatePeriod> =>
    apiPatch<ApiDatePeriod>({
      path: `${datePeriodBasePath}/${datePeriod.id}`,
      data: datePeriod,
    }),

  patchDatePeriodOrder: (
    id: number,
    order: number | null
  ): Promise<ApiDatePeriod> =>
    apiPatch<ApiDatePeriod>({
      path: `${datePeriodBasePath}/${id}`,
      data: { order },
    }),

  deleteDatePeriod: (id: number): Promise<{ success: boolean }> =>
    apiDelete<{ success: boolean }>({
      path: `${datePeriodBasePath}/${id}`,
    }),

  testAuth: (): Promise<AuthTestResponse> =>
    apiGet<AuthTestResponse>({
      path: authRequiredTest,
    }),

  testResourcePostPermission: async (resourceId: string): Promise<boolean> => {
    const permission = await apiPost<PermissionResponse>({
      path: `${resourceBasePath}/${resourceId}/permission_check`,
    });
    return permission.has_permission;
  },

  copyDatePeriods: async (
    resourceId: number,
    targetResources: string[],
    replace: boolean,
    datePeriodIds?: string[]
  ): Promise<boolean> => {
    const permission = await apiPost<PermissionResponse>({
      path: `${resourceBasePath}/${resourceId}/copy_date_periods`,
      parameters: {
        replace,
        target_resources: targetResources.join(','),
        date_period_ids: datePeriodIds?.join(','),
      },
    });
    return permission.has_permission;
  },
};
