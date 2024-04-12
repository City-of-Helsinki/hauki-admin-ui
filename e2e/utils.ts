import { promisify } from 'util';
import { exec } from 'child_process';
import { Resource } from '../src/common/lib/types';

const apiUrl = process.env.API_URL || '?';

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
  const haukiResource = process.env.HAUKI_RESOURCE || '?';

  return `resource/${haukiResource}?${authParams}`;
};

export const getResource = async (): Promise<Resource> => {
  const authParams = await getAuthParams();
  const haukiResource = process.env.HAUKI_RESOURCE || '?';

  const url = `${apiUrl}/v1/resource/${haukiResource}?${authParams}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch resource: ${response.statusText}`);
  }

  const json = await response.json();
  return json;
};
