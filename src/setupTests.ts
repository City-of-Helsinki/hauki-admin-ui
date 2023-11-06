import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@testing-library/jest-dom';
import testSetup from './testSetup';

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
