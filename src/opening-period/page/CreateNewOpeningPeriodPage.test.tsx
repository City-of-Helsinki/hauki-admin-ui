import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { datePeriodOptions } from '../../../test/fixtures/api-options';
import { getElementOrThrow } from '../../../test/test-utils';
import {
  DatePeriod,
  Resource,
  ResourceState,
  ResourceType,
  UiDatePeriodConfig,
} from '../../common/lib/types';
import api from '../../common/utils/api/api';
import CreateNewOpeningPeriodPage from './CreateNewOpeningPeriodPage';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: (): { push: jest.Mock } => ({
    push: mockHistoryPush,
  }),
}));

async function fillCompulsoryPeriodDescriptionFields(
  container: Element
): Promise<void> {
  // Enter title:
  const titleInput = await screen.findByRole('textbox', {
    name: 'Otsikko suomeksi',
  });
  await userEvent.type(titleInput, 'Test title');

  // Enter begin date
  const beginDate = getElementOrThrow(
    container,
    '[data-test="openingPeriodBeginDate"]'
  );

  userEvent.click(beginDate);
  userEvent.click(
    screen.getByRole('button', { name: 'Valitse alkupäivämäärä' })
  );

  const beginDatePicker = screen.getByRole('dialog');

  const todayButton = getElementOrThrow(
    beginDatePicker,
    `[data-date="${new Date().toISOString().slice(0, 10)}"]`
  );
  userEvent.click(todayButton);

  // Enter end date
  const endDate = getElementOrThrow(
    container,
    '[data-test="openingPeriodEndDate"]'
  );
  userEvent.click(endDate);

  userEvent.click(
    screen.getByRole('button', { name: 'Valitse loppupäivämäärä' })
  );

  const endDatePicker = screen.getByRole('dialog');

  const nextMonthButton = getElementOrThrow(
    endDatePicker,
    '[aria-label="Seuraava kuukausi"]'
  );

  userEvent.click(nextMonthButton);

  // Last one requires a separate act wrapping
  const firstDayButton = getElementOrThrow(endDatePicker, `[data-date$="01"]`);
  await act(async () => {
    userEvent.click(firstDayButton);
  });
}

function selectAllWeekdaysInTimeSpan({
  container,
  groupIndex,
  timeSpanIndex,
}: {
  container: Element;
  groupIndex: number;
  timeSpanIndex: number;
}): void {
  const mondayButton = getElementOrThrow(
    container,
    `[data-test=weekdays-monday-${groupIndex}-${timeSpanIndex}]`
  );
  userEvent.click(mondayButton);

  const tuesdayButton = getElementOrThrow(
    container,
    `[data-test=weekdays-tuesday-${groupIndex}-${timeSpanIndex}]`
  );
  userEvent.click(tuesdayButton);

  const wednesdayButton = getElementOrThrow(
    container,
    `[data-test=weekdays-wednesday-${groupIndex}-${timeSpanIndex}]`
  );
  userEvent.click(wednesdayButton);

  const thursdayButton = getElementOrThrow(
    container,
    `[data-test=weekdays-thursday-${groupIndex}-${timeSpanIndex}]`
  );
  userEvent.click(thursdayButton);

  const fridayButton = getElementOrThrow(
    container,
    `[data-test=weekdays-friday-${groupIndex}-${timeSpanIndex}]`
  );
  userEvent.click(fridayButton);

  const saturdayButton = getElementOrThrow(
    container,
    `[data-test=weekdays-saturday-${groupIndex}-${timeSpanIndex}]`
  );
  userEvent.click(saturdayButton);

  const sundayButton = getElementOrThrow(
    container,
    `[data-test=weekdays-sunday-${groupIndex}-${timeSpanIndex}]`
  );
  userEvent.click(sundayButton);
}

async function selectTimeAndTypeInTimeSpan({
  container,
  groupIndex,
  timeSpanIndex,
}: {
  container: Element;
  groupIndex: number;
  timeSpanIndex: number;
}): Promise<void> {
  const beginTimeHours = getElementOrThrow(
    container,
    `#time-span-${groupIndex}-${timeSpanIndex}-start-time-hours`
  );

  await userEvent.type(beginTimeHours, '08');

  const beginTimeMinutes = getElementOrThrow(
    container,
    `#time-span-${groupIndex}-${timeSpanIndex}-start-time-minutes`
  );

  await userEvent.type(beginTimeMinutes, '00');

  const endTimeHours = getElementOrThrow(
    container,
    `#time-span-${groupIndex}-${timeSpanIndex}-end-time-hours`
  );

  await userEvent.type(endTimeHours, '16');

  const endTimeMinutes = getElementOrThrow(
    container,
    `#time-span-${groupIndex}-${timeSpanIndex}-end-time-minutes`
  );

  await userEvent.type(endTimeMinutes, '00');

  const timeSpanStateDropDown = getElementOrThrow(
    container,
    `button#time-span-state-id-${groupIndex}-${timeSpanIndex}-toggle-button`
  );
  userEvent.click(timeSpanStateDropDown);

  const firstOptionInStateDropDown = getElementOrThrow(
    container,
    `li#time-span-state-id-${groupIndex}-${timeSpanIndex}-item-0`
  );

  // Last one requires a separate act wrapping
  await act(async () => {
    userEvent.click(firstOptionInStateDropDown);
  });
}

describe(`<CreateNewOpeningPeriodPage />`, () => {
  jest.setTimeout(30000); // We suspect rendering + react-hooks + act wrapping + async await causes tests to run slow
  let testDatePeriodConfig: UiDatePeriodConfig;
  let testResource: Resource;
  let testResourcePageUrl: string;
  let testDatePeriod: DatePeriod;

  beforeEach(() => {
    testDatePeriodConfig = datePeriodOptions;

    testResource = {
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

    testResourcePageUrl = `/resource/${testResource.id}`;

    testDatePeriod = {
      id: 1,
      created: '2020-11-20',
      modified: '2020-11-20',
      is_removed: false,
      name: { fi: '', sv: '', en: '' },
      description: { fi: '', sv: '', en: '' },
      start_date: null,
      end_date: '2020-11-21',
      resource_state: ResourceState.OPEN,
      override: false,
      resource: 1,
      time_span_groups: [],
    };

    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() => Promise.resolve(testResource));

    jest
      .spyOn(api, 'getDatePeriodFormConfig')
      .mockImplementation(() => Promise.resolve(testDatePeriodConfig));

    jest
      .spyOn(api, 'postDatePeriod')
      .mockImplementation(() => Promise.resolve(testDatePeriod));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading indicator while loading resource info', async () => {
    jest.spyOn(api, 'getResource').mockImplementation(() => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return new Promise(() => {});
    });

    render(
      <CreateNewOpeningPeriodPage exception={false} resourceId="tprek:8100" />
    );

    await act(async () => {
      expect(await screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Aukiolojakson lisäys'
      );
      expect(await screen.getByText('Sivua ladataan...')).toBeInTheDocument();
    });
  });

  it('should show loading indicator while loading date period form options', async () => {
    jest.spyOn(api, 'getDatePeriodFormConfig').mockImplementation(() => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return new Promise(() => {});
    });

    render(
      <CreateNewOpeningPeriodPage exception={false} resourceId="tprek:8100" />
    );

    await act(async () => {
      expect(await screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Aukiolojakson lisäys'
      );
      expect(await screen.getByText('Sivua ladataan...')).toBeInTheDocument();
    });
  });

  it('should show error notification if loading resource info on page load fails', async () => {
    const error: Error = new Error('Failed to load a resource');
    const errorConsoleSpy = jest
      .spyOn(global.console, 'error')
      .mockImplementationOnce((e) => e);

    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() => Promise.reject(error));

    render(
      <CreateNewOpeningPeriodPage exception={false} resourceId="tprek:8100" />
    );

    await act(async () => {
      const errorHeading = await screen.getByRole('heading', { level: 1 });
      const notificationText = await screen.findByTestId(
        'error-retrieving-resource-info'
      );
      expect(errorConsoleSpy).toHaveBeenCalledWith(
        'Add date-period - data initialization error:',
        error
      );
      expect(errorHeading).toHaveTextContent('Virhe');
      expect(notificationText).toBeInTheDocument();
    });
  });

  it('should show error notification if loading date period form options fails', async () => {
    const error: Error = new Error('Failed to load date period form options');
    const errorConsoleSpy = jest
      .spyOn(global.console, 'error')
      .mockImplementationOnce((e) => e);

    jest
      .spyOn(api, 'getDatePeriodFormConfig')
      .mockImplementation(() => Promise.reject(error));

    render(
      <CreateNewOpeningPeriodPage exception={false} resourceId="tprek:8100" />
    );

    await act(async () => {
      const errorHeading = await screen.getByRole('heading', { level: 1 });
      const notificationText = await screen.findByTestId(
        'error-retrieving-resource-info'
      );
      expect(errorConsoleSpy).toHaveBeenCalledWith(
        'Add date-period - data initialization error:',
        error
      );
      expect(errorHeading).toHaveTextContent('Virhe');
      expect(notificationText).toBeInTheDocument();
    });
  });

  it('should show error notification when form submit fails api side', async () => {
    const error: Error = new Error('ApiError for test purpose');
    const errorConsoleSpy = jest
      .spyOn(global.console, 'error')
      .mockImplementationOnce((e) => e);

    jest
      .spyOn(api, 'postDatePeriod')
      .mockImplementation(() =>
        Promise.reject(new Error('ApiError for test purpose'))
      );

    const { container } = render(
      <CreateNewOpeningPeriodPage exception={false} resourceId="tprek:8100" />
    );

    if (!container) {
      throw new Error(
        'Something went wrong in rendering of CreateNewOpeningPeriodPage'
      );
    }

    // Have to do this in act, otherwise dom not updated from initial loadings
    await act(async () => {
      await fillCompulsoryPeriodDescriptionFields(container);

      const mondayButton = getElementOrThrow(
        container,
        '[data-test=weekdays-monday-0-0]'
      );
      userEvent.click(mondayButton);

      const beginTimeHours = getElementOrThrow(
        container,
        '#time-span-0-0-start-time-hours'
      );

      await userEvent.type(beginTimeHours, '08');

      const beginTimeMinutes = getElementOrThrow(
        container,
        '#time-span-0-0-start-time-minutes'
      );

      await userEvent.type(beginTimeMinutes, '00');

      const endTimeHours = getElementOrThrow(
        container,
        '#time-span-0-0-end-time-hours'
      );

      await userEvent.type(endTimeHours, '16');

      const endTimeMinutes = getElementOrThrow(
        container,
        '#time-span-0-0-end-time-minutes'
      );

      await userEvent.type(endTimeMinutes, '00');

      // Try submit form
      const submitFormButton = getElementOrThrow(
        container,
        '[data-test="publish-opening-period-button"]'
      );
      userEvent.click(submitFormButton);
    });

    await act(async () => {
      expect(errorConsoleSpy).toHaveBeenCalledWith(error);
      expect(
        await screen.findByTestId('opening-period-form-error')
      ).toBeInTheDocument();
    });
  });

  it('should show success notification on successful form submit', async () => {
    const { container } = render(
      <CreateNewOpeningPeriodPage exception={false} resourceId="tprek:8100" />
    );

    if (!container) {
      throw new Error(
        'Something went wrong in rendering of CreateNewOpeningPeriodPage'
      );
    }

    // Have to do this in act, otherwise dom not updated from initial loadings
    await act(async () => {
      await fillCompulsoryPeriodDescriptionFields(container);

      selectAllWeekdaysInTimeSpan({
        container,
        groupIndex: 0,
        timeSpanIndex: 0,
      });
      await selectTimeAndTypeInTimeSpan({
        container,
        groupIndex: 0,
        timeSpanIndex: 0,
      });

      // Try submit form
      const submitFormButton = getElementOrThrow(
        container,
        '[data-test="publish-opening-period-button"]'
      );
      userEvent.click(submitFormButton);
    });

    await act(async () => {
      expect(mockHistoryPush).toHaveBeenCalledWith(testResourcePageUrl);

      expect(
        await screen.findByTestId('opening-period-form-success')
      ).toBeInTheDocument();
    });
  });

  it('should show success notification when form is submitted with multiple time spans', async () => {
    const { container } = render(
      <CreateNewOpeningPeriodPage exception={false} resourceId="tprek:8100" />
    );

    if (!container) {
      throw new Error(
        'Something went wrong in rendering of CreateNewOpeningPeriodPage'
      );
    }

    // Have to do this in act, otherwise dom not updated from initial loadings
    await act(async () => {
      await fillCompulsoryPeriodDescriptionFields(container);

      selectAllWeekdaysInTimeSpan({
        container,
        groupIndex: 0,
        timeSpanIndex: 0,
      });
      await selectTimeAndTypeInTimeSpan({
        container,
        groupIndex: 0,
        timeSpanIndex: 0,
      });
      // Add timespan
      const addNewTimeSpanButton = getElementOrThrow(
        container,
        '[data-test="add-new-time-span-button-0"]'
      );
      userEvent.click(addNewTimeSpanButton);
      selectAllWeekdaysInTimeSpan({
        container,
        groupIndex: 0,
        timeSpanIndex: 1,
      });
      await selectTimeAndTypeInTimeSpan({
        container,
        groupIndex: 0,
        timeSpanIndex: 1,
      });
      // Try submit form
      const submitFormButton = getElementOrThrow(
        container,
        '[data-test="publish-opening-period-button"]'
      );
      userEvent.click(submitFormButton);
    });

    await act(async () => {
      expect(mockHistoryPush).toHaveBeenCalledWith(testResourcePageUrl);

      expect(
        await screen.findByTestId('opening-period-form-success')
      ).toBeInTheDocument();
    });
  });

  it('should be able to add and delete time spans', async () => {
    let container: Element;
    // Have to wrap inside act this time, otherwise time-span elements not found
    await act(async () => {
      container = render(
        <CreateNewOpeningPeriodPage exception={false} resourceId="tprek:8100" />
      ).container;

      if (!container) {
        throw new Error(
          'Something went wrong in rendering of CreateNewOpeningPeriodPage'
        );
      }
    });

    // Have to do this in act, otherwise dom not updated from initial loadings
    await act(async () => {
      const defaultTimeSpanElement = getElementOrThrow(
        container,
        '[data-test="time-span-0-0"]'
      );

      await act(async () => {
        expect(defaultTimeSpanElement).toBeInTheDocument();
      });

      // Add timespan
      const addNewTimeSpanButton = getElementOrThrow(
        container,
        '[data-test="add-new-time-span-button-0"]'
      );
      userEvent.click(addNewTimeSpanButton);

      const secondTimeSpanElement = getElementOrThrow(
        container,
        '[data-test="time-span-0-1"]'
      );

      await act(async () => {
        expect(secondTimeSpanElement).toBeInTheDocument();
      });

      // Delete timespan
      const deleteSecondTimeSpanButton = getElementOrThrow(
        container,
        '[data-test="remove-time-span-button-0-1"]'
      );

      userEvent.click(deleteSecondTimeSpanButton);
    });

    await act(async () => {
      expect(
        getElementOrThrow(container, '[data-test="time-span-0-0"]')
      ).toBeInTheDocument();

      expect(() =>
        getElementOrThrow(container, '[data-test="time-span-0-1"]')
      ).toThrow();
    });
  });

  it('should show different subtitle for subresource', async () => {
    let container: Element;

    jest.spyOn(api, 'getResource').mockImplementation(() =>
      Promise.resolve({
        ...testResource,
        resource_type: ResourceType.CONTACT,
      })
    );

    await act(async () => {
      container = render(
        <CreateNewOpeningPeriodPage exception={false} resourceId="tprek:8100" />
      ).container;

      if (!container) {
        throw new Error(
          'Something went wrong in rendering of CreateNewOpeningPeriodPage'
        );
      }
    });

    await act(async () => {
      expect(await screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Alakohteen aukiolojakson lisäys'
      );
    });
  });
});
