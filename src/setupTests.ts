import '@testing-library/jest-dom/vitest';
import testSetup from './testSetup';

// Load generated runtime configuration to be available in tests
import '../public/test-env-config.js';

// jsdom does not implement indexedDB; hds-react accesses it when saving consent
if (!global.indexedDB) {
  // @ts-expect-error minimal stub
  global.indexedDB = {
    open: () => {
      const request: Partial<IDBOpenDBRequest> = {};
      setTimeout(() => {
        // @ts-expect-error minimal stub - 'this' context doesn't match full IDBRequest
        if (request.onerror) request.onerror(new Event('error'));
      }, 0);
      return request as IDBOpenDBRequest;
    },
  };
}

testSetup();

const originalError = console.error.bind(console.error);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (msg: any, ...optionalParams: any[]) => {
  const msgStr = msg.toString();

  return (
    !msgStr.includes('Could not parse CSS stylesheet') &&
    originalError(msg, ...optionalParams)
  );
};
