import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox, RadioButton, SelectionGroup } from 'hds-react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import getDay from 'date-fns/getDay';
import {
  DatePeriod,
  Holiday,
  Language,
  OpeningHoursFormValues,
  Resource,
  ResourceState,
  UiDatePeriodConfig,
} from '../common/lib/types';
import {
  apiDatePeriodToFormValues,
  formValuesToApiDatePeriod,
  isHoliday,
} from '../common/helpers/opening-hours-helpers';
import api from '../common/utils/api/api';
import { getDatePeriodFormConfig } from '../services/datePeriodFormConfig';
import { getHolidays } from '../services/holidays';
import { formatDate } from '../common/utils/date-time/format';
import { PrimaryButton } from '../components/button/Button';
import { UpcomingHolidayNotification } from '../components/holidays-table/HolidaysTable';
import ResourceTitle from '../components/resource-title/ResourceTitle';
import toast from '../components/notification/Toast';
import TimeSpans from '../components/time-span/TimeSpans';

import { useAppContext } from '../App-context';
import './EditHolidaysPage.scss';

const getDefaultFormValues = ({
  name,
  holidayDate,
}: {
  name: string;
  holidayDate: string;
}): OpeningHoursFormValues => ({
  startDate: formatDate(holidayDate),
  endDate: formatDate(holidayDate),
  fixed: true,
  name: { fi: name, sv: '', en: '' },
  override: true,
  resourceState: ResourceState.CLOSED,
  openingHours: [],
});

const HolidayForm = ({
  holiday,
  value,
  datePeriodConfig,
  resourceId,
  onSubmit,
}: {
  holiday: Holiday;
  value?: OpeningHoursFormValues;
  resourceId: number;
  datePeriodConfig: UiDatePeriodConfig;
  onSubmit: () => void;
}): JSX.Element => {
  const { name, date: holidayDate } = holiday;
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const openingHoursPrefix = 'openingHours';
  const fieldNamePrefix = `${openingHoursPrefix}`;
  const formValue = value || getDefaultFormValues({ name, holidayDate });
  const [isOpen, setIsOpen] = useState<boolean>(
    formValue && formValue.resourceState
      ? formValue.resourceState !== ResourceState.CLOSED
      : false
  );

  const form = useForm<OpeningHoursFormValues>({
    defaultValues: formValue,
    shouldUnregister: false,
  });
  const { control, setValue } = form;
  const { remove, append } = useFieldArray({
    name: fieldNamePrefix,
    control,
  });

  const onClosedSelect = (): void => {
    setIsOpen(false);
    setValue('resourceState', ResourceState.CLOSED);
    remove();
  };

  const onOpenSelect = (): void => {
    setIsOpen(true);
    setValue('resourceState', undefined);
    remove();
    append({
      timeSpanGroups: [
        {
          timeSpans: [
            {
              resource_state: ResourceState.OPEN,
            },
          ],
        },
      ],
      weekdays: [getDay(new Date(holidayDate))],
    });
  };

  const {
    resourceState: { options: resourceStates = [] },
  } = datePeriodConfig;

  const save = (values: OpeningHoursFormValues): void => {
    if (!resourceId) {
      throw new Error('Resource not found');
    }
    setIsSaving(true);
    const apiMethod = values.id ? api.putDatePeriod : api.postDatePeriod;

    apiMethod({
      ...formValuesToApiDatePeriod(resourceId, values, values.id),
      override: true,
    })
      .then(() => {
        toast.success({
          dataTestId: 'holiday-form-success',
          label: 'Tallennus onnistui',
          text: `${name} aukiolon tallennus onnistui`,
        });

        onSubmit();
      })
      .catch(() => {
        toast.error({
          dataTestId: 'holiday-form-success-error',
          label: 'Tallennus epäonnistui',
          text: `${name} aukiolon tallennus epäonnistui`,
        });
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="holiday-form">
      <SelectionGroup label="">
        <RadioButton
          id={`${holidayDate}-closed-state-checkbox`}
          name={`${holidayDate}-closed-state-checkbox`}
          checked={!isOpen}
          label="Suljettu koko päivän"
          onChange={(): void => onClosedSelect()}
        />
        <RadioButton
          id={`${holidayDate}-open-state-checkbox`}
          name={`${holidayDate}-open-state-checkbox`}
          checked={isOpen}
          label="Voimassa tietyn ajan"
          onChange={(): void => onOpenSelect()}
        />
      </SelectionGroup>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(save)}>
          {isOpen && (
            <div className="holiday-form-fields">
              <TimeSpans
                resourceStates={resourceStates}
                namePrefix={`${fieldNamePrefix}[0].timeSpanGroups[0].timeSpans`}
              />
            </div>
          )}
          <div className="holiday-form-actions">
            <PrimaryButton
              dataTest="submit-opening-hours-button"
              isLoading={isSaving}
              loadingText="Tallentaa poikkeusaukioloa"
              type="submit">
              Tallenna
            </PrimaryButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

const HolidayListItem = ({
  holiday,
  value,
  resourceId,
  datePeriodConfig,
  onSubmit,
}: {
  holiday: Holiday;
  value?: OpeningHoursFormValues;
  resourceId: number;
  datePeriodConfig: UiDatePeriodConfig;
  onSubmit: () => void;
}): JSX.Element => {
  const [checked, setChecked] = useState<boolean>(!!value);
  const { name, date } = holiday;

  return (
    <li className="holidays-list-item" key={date}>
      <Checkbox
        id={date}
        label={`${name}   ${formatDate(date)}`}
        className="holiday-list-checkbox"
        checked={checked}
        onChange={(): void => setChecked(!checked)}
      />
      {checked && (
        <HolidayForm
          holiday={holiday}
          value={value}
          resourceId={resourceId}
          datePeriodConfig={datePeriodConfig}
          onSubmit={onSubmit}
        />
      )}
    </li>
  );
};

export default function EditHolidaysPage({
  resourceId,
}: {
  resourceId: string;
}): JSX.Element {
  const [resource, setResource] = useState<Resource>();
  const [holidayValues, setHolidayValues] = useState<
    OpeningHoursFormValues[] | undefined
  >();
  const [datePeriodConfig, setDatePeriodConfig] = useState<
    UiDatePeriodConfig
  >();
  const { language = Language.FI } = useAppContext();
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      try {
        const [apiResource, uiDatePeriodOptions] = await Promise.all([
          api.getResource(resourceId),
          getDatePeriodFormConfig(),
        ]);
        setHolidays(getHolidays());
        setResource(apiResource);
        setDatePeriodConfig(uiDatePeriodOptions);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Fetching data failed in holidays page:', e);
      }
    };

    fetchData();
  }, [resourceId]);

  const fetchValues = useCallback(
    async (resourceIdentifier: number): Promise<void> => {
      const apiDatePeriods: DatePeriod[] = await api.getDatePeriods(
        resourceIdentifier
      );
      const holidayPeriods: DatePeriod[] = apiDatePeriods.filter(
        (apiDatePeriod) => isHoliday(apiDatePeriod, holidays)
      );
      const holidayValuesList: OpeningHoursFormValues[] = holidayPeriods.map(
        apiDatePeriodToFormValues
      );
      setHolidayValues(holidayValuesList);
    },
    [holidays]
  );

  useEffect((): void => {
    const fetchHolidayValues = async (): Promise<void> => {
      try {
        if (resource) {
          await fetchValues(resource.id);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(
          'Fetching data failed in holidays page - apiDatePeriods:',
          e
        );
      }
    };

    fetchHolidayValues();
  }, [fetchValues, holidays, resource]);

  if (!resource || !datePeriodConfig || !holidayValues) {
    return <h1>Ladataan...</h1>;
  }

  return (
    <>
      <ResourceTitle language={language} resource={resource} />
      <div className="holidays-page card">
        <div className="holidays-page-title">
          <h3>Juhlapyhien aukioloajat</h3>
          <span className="holidays-page-title-addon">
            {holidays.length && (
              <UpcomingHolidayNotification holiday={holidays[0]} />
            )}
          </span>
        </div>
        <p>
          Jos lisäät listassa olevalle juhlapyhälle poikkeavan aukioloajan, se
          on voimassa toistaiseksi. Muista tarkistaa vuosittain, että tieto
          pitää yhä paikkansa.
        </p>
        <ul className="holidays-list">
          {holidays.map((holiday) => (
            <HolidayListItem
              key={holiday.date}
              holiday={holiday}
              datePeriodConfig={datePeriodConfig}
              resourceId={resource.id}
              value={
                holidayValues
                  ? holidayValues.find(
                      (value) => value.name.fi === holiday.name
                    )
                  : undefined
              }
              onSubmit={(): Promise<void> => fetchValues(resource.id)}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
