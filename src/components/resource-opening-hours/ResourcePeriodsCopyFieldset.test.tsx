import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mock } from 'vitest';
import { AppContext } from '../../App-context';
import api from '../../common/utils/api/api';
import toast from '../notification/Toast';
import ResourcePeriodsCopyFieldset, {
  TargetResourcesProps,
} from './ResourcePeriodsCopyFieldset';

const testCopyResourceData: TargetResourcesProps = {
  mainResourceId: 1111,
  mainResourceName: 'testMainResource',
  targetResources: [{ id: 'tprek: 1122', name: 'testTargetResource' }],
};

describe(`<ResourcePeriodsCopyFieldset/>`, () => {
  let onChange: Mock;

  beforeEach(() => {
    onChange = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should copy targets when user clicks the copy button', async () => {
    const utcTimeString = '2022-01-24T18:00:00.000Z';
    vi.spyOn(Date.prototype, 'toJSON').mockReturnValue(utcTimeString);

    const apiCopySpy = vi
      .spyOn(api, 'copyDatePeriods')
      .mockImplementation(() => Promise.resolve(true));

    const toastSuccessSpy = vi.spyOn(toast, 'success');

    render(
      <AppContext.Provider
        value={{ hasOpenerWindow: false, closeAppWindow: vi.fn() }}>
        <ResourcePeriodsCopyFieldset
          {...testCopyResourceData}
          onChange={onChange}
        />
      </AppContext.Provider>
    );

    userEvent.click(
      screen.getByRole('button', {
        name: 'Päivitä aukiolotiedot 1 muuhun toimipisteeseen',
      })
    );

    await waitFor(async () => {
      expect(apiCopySpy).toHaveBeenCalledWith(
        testCopyResourceData.mainResourceId,
        testCopyResourceData.targetResources?.map((resource) => resource.id),
        true
      );
      expect(toastSuccessSpy).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith({
        ...testCopyResourceData,
        modified: utcTimeString,
      });
    });
  });

  it('should show window closing info when the app is opened from another window', async () => {
    const closeAppWindow = vi.fn();

    render(
      <AppContext.Provider value={{ hasOpenerWindow: true, closeAppWindow }}>
        <ResourcePeriodsCopyFieldset
          {...testCopyResourceData}
          onChange={onChange}
        />
      </AppContext.Provider>
    );

    userEvent.click(
      screen.getByRole('button', {
        name: 'Päivitä aukiolotiedot 1 muuhun toimipisteeseen. Ikkuna sulkeutuu.',
      })
    );

    await waitFor(async () => {
      expect(closeAppWindow).toHaveBeenCalled();
    });
  });

  it('should show error notification when api copy fails', async () => {
    const error: Error = new Error('Failed to load a resource');
    const apiCopySpy = vi
      .spyOn(api, 'copyDatePeriods')
      .mockImplementation(() => Promise.reject(error));
    const toastErrorSpy = vi.spyOn(toast, 'error');
    vi.spyOn(global.console, 'error').mockImplementationOnce((e) => e);

    render(
      <AppContext.Provider
        value={{ hasOpenerWindow: false, closeAppWindow: vi.fn() }}>
        <ResourcePeriodsCopyFieldset
          {...testCopyResourceData}
          onChange={onChange}
        />
      </AppContext.Provider>
    );

    userEvent.click(
      screen.getByRole('button', {
        name: 'Päivitä aukiolotiedot 1 muuhun toimipisteeseen',
      })
    );

    await waitFor(async () => {
      expect(apiCopySpy).toHaveBeenCalled();
      expect(toastErrorSpy).toHaveBeenCalled();
    });
  });
});
