import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import '@testing-library/jest-dom/vitest';
import testSetup from './testSetup';

// Load generated runtime configuration to be available in tests
// eslint-disable-next-line import/extensions, import/no-unresolved
require('../public/test-env-config.js');

configure({ adapter: new Adapter() });
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
