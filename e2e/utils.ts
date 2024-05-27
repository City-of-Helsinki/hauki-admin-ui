import { promisify } from 'util';
import { exec } from 'child_process';
import { DatePeriod, Resource } from '../src/common/lib/types';
import { apiUrl, testData } from './constants';

const getAuthParams = async () => {
  const execAsync = promisify(exec);

  const { stdout, stderr } = await execAsync(
    'node ./scripts/generate-auth-params.mjs',
    {
      env: {
        ...process.env,
        ...testData,
        API_URL: apiUrl,
      },
    }
  );

  if (stderr) {
    console.error(`error: ${stderr}`);
  }

  return stdout;
};

export const getResourceUrl = async () => {
  const authParams = await getAuthParams();

  return `/resource/${testData.HAUKI_RESOURCE}?${authParams}`;
};

export const getResource = async (): Promise<Resource> => {
  const authParams = await getAuthParams();

  const url = `${apiUrl}/v1/resource/${testData.HAUKI_RESOURCE}?${authParams}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch resource: ${response.statusText}`);
  }

  const json = await response.json();
  return json;
};

export const getDatePeriodIds = async (resourceId: number) => {
  const authParams = await getAuthParams();
  const auth = `haukisigned ${authParams}`;

  const url = `${apiUrl}/v1/date_period/?resource=${resourceId}&end_date_gte=-1d&format=json`;

  const response = await fetch(url, {
    headers: { Authorization: auth },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch resource: ${response.statusText}`);
  }

  const json: DatePeriod[] = await response.json();

  const ids = json
    .map((dp) => dp.id || null)
    .filter((item): item is number => !!item);

  return ids;
};

export const deleteDatePeriods = async (ids: number[]) => {
  const authParams = await getAuthParams();
  const auth = `haukisigned ${authParams}`;

  await Promise.all(
    ids.map(async (id) => {
      const url = `${apiUrl}/v1/date_period/${id}`;

      const response = await fetch(url, {
        method: 'delete',
        headers: { Authorization: auth },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete resource: ${response.statusText}`);
      }
    })
  );
};
