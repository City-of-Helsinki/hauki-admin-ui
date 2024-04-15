import { promisify } from 'util';
import { exec } from 'child_process';
import { DatePeriod, Resource } from '../src/common/lib/types';

const apiUrl = process.env.API_URL || 'http://localhost:8000';
const haukiResource = process.env.HAUKI_RESOURCE || 'test:1';

const getAuthParams = async () => {
  const execAsync = promisify(exec);

  const { stdout, stderr } = await execAsync(
    'node ./scripts/generate-auth-params.js'
  );

  if (stderr) {
    console.error(`error: ${stderr}`);
  }

  return stdout;
};

export const getResourceUrl = async () => {
  const authParams = await getAuthParams();

  return `/resource/${haukiResource}?${authParams}`;
};

export const getResource = async (): Promise<Resource> => {
  const authParams = await getAuthParams();

  const url = `${apiUrl}/v1/resource/${haukiResource}?${authParams}`;
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
