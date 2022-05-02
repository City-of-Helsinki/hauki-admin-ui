import { Button, Checkbox, Select, TimeInput } from 'hds-react';
import React, { useEffect, useState } from 'react';
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import {
  Resource,
  ResourceState,
  UiDatePeriodConfig,
} from '../../common/lib/types';
import api from '../../common/utils/api/api';
import { SecondaryButton } from '../../components/button/Button';
import './SimpleCreateOpeningHours.scss';
import './SimpleCreateOpeningHours2.scss';

type Days = {
  Ma: boolean;
  Ti: boolean;
  Ke: boolean;
  To: boolean;
  Pe: boolean;
  La: boolean;
  Su: boolean;
};

type OpeningHoursTimeSpan = {
  start: string;
  end: string;
  fullDay: boolean;
  state: ResourceState;
};

type OpeningHours = {
  normal: OpeningHoursTimeSpan;
  exceptions: OpeningHoursTimeSpan[];
};

type OpeningHoursRange = {
  days: Days;
  isOpen: boolean;
  normal: OpeningHours;
  variable: OpeningHours[];
};

type State = {
  openingHours: OpeningHoursRange[];
};

const DayCheckbox = ({
  children,
  namePrefix,
  onChange: onChangeOuter,
  checked,
}: {
  children: string;
  namePrefix: string;
  onChange: (checked: boolean) => void;
  checked: boolean;
}): JSX.Element => {
  const id = `${namePrefix}.days.${children}`;
  const { control } = useFormContext<State>();

  return (
    <Controller
      control={control}
      defaultValue={checked}
      name={`${namePrefix}.days.${children}`}
      render={({ onChange, value }) => (
        <label htmlFor={id} className="day-label">
          <input
            id={id}
            type="checkbox"
            onChange={() => {
              onChange(!value);
              onChangeOuter(!value);
            }}
            checked={value}
          />
          <span className="day-option">{children}</span>
        </label>
      )}
    />
  );
};

const SwitchButton = ({
  isActive,
  label,
  onChange,
}: {
  isActive: boolean;
  label: string;
  onChange: () => void;
}): JSX.Element => (
  <Button
    className={`switch-buttons-button ${
      isActive ? 'switch-buttons-button--active' : ''
    }`}
    variant="secondary"
    onClick={(): void => onChange()}>
    {label}
  </Button>
);

const SwitchButtons = ({
  labels,
  value,
  onChange,
}: {
  labels: { on: string; off: string };
  value: boolean;
  onChange: (x: boolean) => void;
}): JSX.Element => (
  <div className="switch-buttons">
    <SwitchButton
      isActive={value}
      label={labels.on}
      onChange={(): void => onChange(true)}
    />
    <span className="switch-buttons-divider">/</span>
    <SwitchButton
      isActive={!value}
      label={labels.off}
      onChange={(): void => onChange(false)}
    />
  </div>
);

const OpeningHoursRangeTimeSpan = ({
  defaultValues,
  disabled = false,
  resourceStates,
  namePrefix,
}: {
  defaultValues?: {
    startTime: string;
    endTime: string;
    state: ResourceState;
  };
  disabled?: boolean;
  namePrefix: string;
  resourceStates: OptionType[];
}): JSX.Element => {
  const { control, register, watch } = useFormContext();
  const fullDay = watch(`${namePrefix}.fullDay`);

  return (
    <div className="opening-hours-range__time-span">
      <div className="opening-hours-range__time-span-inputs">
        <TimeInput
          ref={register}
          disabled={disabled || fullDay}
          id="startDate"
          hoursLabel="tunnit"
          minutesLabel="minuutit"
          label="Avataan"
          name={`${namePrefix}.start`}
          value={defaultValues?.startTime}
        />
        <div>-</div>
        <TimeInput
          ref={register}
          disabled={disabled || fullDay}
          id="endDate"
          hoursLabel="tunnit"
          minutesLabel="minuutit"
          label="Suljetaan"
          name={`${namePrefix}.end`}
          value={defaultValues?.endTime}
        />
      </div>
      <div className="fullday-checkbox-container">
        <Controller
          defaultValue={false}
          render={(field): JSX.Element => (
            <Checkbox
              id={`${namePrefix}.fullDay`}
              name={`${namePrefix}.fullDay`}
              label="24 h"
              onChange={(e): void => {
                field.onChange(e.target.checked);
              }}
              checked={field.value}
            />
          )}
          control={control}
          name={`${namePrefix}.fullDay`}
        />
      </div>
      <Controller
        defaultValue={ResourceState.OPEN}
        name={`${namePrefix}.state`}
        control={control}
        render={({ onChange, value }): JSX.Element => (
          <Select<OptionType>
            disabled={disabled}
            label="Tila"
            options={resourceStates}
            className="opening-hours-range-select"
            onChange={onChange}
            placeholder="Placeholder"
            required
            value={resourceStates.find(
              (option: OptionType): boolean => option.value === value
            )}
          />
        )}
      />
    </div>
  );
};

const OpeningHoursRangeSelections = ({
  defaultValues,
  resourceStates,
  namePrefix,
}: {
  defaultValues?: DefaultValues;
  resourceStates: OptionType[];
  namePrefix: string;
}) => {
  const { control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exceptions',
  });

  return (
    <div>
      <div className="opening-hours-range__selections">
        <div className="opening-hours-range__time-spans">
          <div className="opening-hours__time-span-container">
            <OpeningHoursRangeTimeSpan
              defaultValues={defaultValues}
              resourceStates={resourceStates}
              namePrefix={`${namePrefix}.normal`}
            />
          </div>
          {fields.map((a, i) => (
            <div className="exception" key={a.id}>
              <OpeningHoursRangeTimeSpan
                defaultValues={defaultValues}
                resourceStates={resourceStates}
                namePrefix={`${namePrefix}.exceptions[${i}]`}
              />
              <Button variant="danger" onClick={() => remove(i)}>
                Poista
              </Button>
            </div>
          ))}
          <div>
            <button
              className="link-button"
              onClick={() => append({})}
              type="button">
              + Lisää tarkennettu aukioloaika
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

type OptionType = { value: string; label: string };

type DefaultValues = {
  startTime: string;
  endTime: string;
  state: ResourceState;
};

const daysOrder = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];

const OpeningHoursRange = ({
  // defaultIOpen = true,
  resourceStates,
  defaultValues,
  namePrefix,
  onDayChange,
  days,
}: {
  defaultIOpen?: boolean;
  days: Days;
  namePrefix: string;
  resourceStates: OptionType[];
  defaultValues?: DefaultValues;
  onDayChange: (day: keyof Days, checked: boolean) => void;
}): JSX.Element => {
  const options = [
    { value: '0', label: 'Joka toinen viikko' },
    { value: '1', label: 'Joka kolmas viikko' },
    { value: '2', label: 'Joka neljäs viikko' },
  ];
  const { control, watch } = useFormContext<State>();
  const open = watch(`${namePrefix}.isOpen`);
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'variable',
  });

  return (
    <div className="opening-hours-range-container">
      <div className="weekdays">
        <div>Päivä</div>
        <div className="weekdays-and-is-open-selector">
          {daysOrder.map((day) => (
            <DayCheckbox
              key={`${namePrefix}-${day}`}
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              checked={days[day]}
              namePrefix={namePrefix}
              onChange={(checked) => onDayChange(day as any, checked)}>
              {day}
            </DayCheckbox>
          ))}
          <Controller
            defaultValue
            name={`${namePrefix}.isOpen`}
            render={({ onChange, value }) => (
              <SwitchButtons
                labels={{ on: 'Auki', off: 'Kiinni' }}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </div>
      </div>
      {open && (
        <div className="opening-hours-range">
          <OpeningHoursRangeSelections
            defaultValues={defaultValues}
            resourceStates={resourceStates}
            namePrefix={`${namePrefix}.normal`}
          />
        </div>
      )}
      {fields.map((field, i) => (
        <div key={field.id}>
          <div className="container varying-opening-hour">
            <Select<OptionType>
              label="Toistuvuus"
              options={options}
              className="variable-opening-hours-select"
              placeholder="Valitse"
              required
              defaultValue={options[0]}
            />
            <Button variant="danger" onClick={() => remove(i)}>
              Poista
            </Button>
          </div>
          <div className="opening-hours-range">
            <OpeningHoursRangeSelections
              defaultValues={defaultValues}
              resourceStates={resourceStates}
              namePrefix={`${namePrefix}.variable[${i}]`}
            />
          </div>
        </div>
      ))}
      <div className="container">
        <button
          className="link-button"
          onClick={() => append({})}
          type="button">
          + Lisää vuorotteleva aukioloaika
        </button>
      </div>
    </div>
  );
};

const defaultState = {
  days: {
    Ma: true,
    Ti: true,
    Ke: true,
    To: true,
    Pe: true,
    La: true,
    Su: true,
  },
  isOpen: true,
  normal: {
    normal: {
      fullDay: false,
      state: ResourceState.OPEN,
    },
    exceptions: [],
  },
  variable: [],
};

export default ({ resourceId }: { resourceId: string }): JSX.Element => {
  const [resource, setResource] = useState<Resource>();
  const [datePeriodConfig, setDatePeriodConfig] = useState<
    UiDatePeriodConfig
  >();
  const history = useHistory();
  const returnToResourcePage = (): void =>
    history.push(`/resource/${resourceId}`);

  // const defaultWeekendValueValue = {
  //   startTime: '09:00',
  //   endTime: '15:00',
  //   state: ResourceState.OPEN,
  // };

  const resourceStates = datePeriodConfig
    ? datePeriodConfig.resourceState.options.map((translatedApiChoice) => ({
        value: translatedApiChoice.value,
        label: translatedApiChoice.label.fi as string,
      }))
    : [];

  useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      try {
        const [apiResource, uiDatePeriodOptions] = await Promise.all([
          api.getResource(resourceId),
          api.getDatePeriodFormConfig(),
        ]);
        setResource(apiResource);
        setDatePeriodConfig(uiDatePeriodOptions);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Add date-period - data initialization error:', e);
      }
    };

    fetchData();
  }, [resourceId]);

  const form = useForm<State>({
    defaultValues: {
      openingHours: [defaultState],
    },
  });
  const { control, getValues, setValue } = form;
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'openingHours',
  });

  const allDayAreUncheckedForRow = (idx: number): boolean =>
    daysOrder.every((day) => !getValues(`openingHours[${idx}].days.${day}`));

  const setDay = (i: number, day: keyof Days, checked: boolean): void =>
    setValue(`openingHours[${i}].days.${day}`, checked);

  return (
    (resource && datePeriodConfig && (
      <FormProvider {...form}>
        <div>
          <div className="opening-hours-form__title">
            <h1 data-test="resource-info" className="resource-info-title">
              {resource?.name?.fi}
            </h1>
            <span>Osoite: {resource?.address.fi}</span>
          </div>
          <div className="opening-hours-form">
            <section>
              {fields.map((field, i) => (
                <OpeningHoursRange
                  key={field.id}
                  resourceStates={resourceStates}
                  days={field.days}
                  namePrefix={`openingHours[${i}]`}
                  onDayChange={(day, checked): void => {
                    if (checked) {
                      const prevId = fields.findIndex(
                        (item, idx) =>
                          idx !== i &&
                          getValues(`openingHours[${idx}].days.${day}`)
                      );
                      if (prevId >= 0) {
                        setDay(prevId, day, false);

                        if (allDayAreUncheckedForRow(prevId)) {
                          remove(prevId);
                        }
                      }
                      return;
                    }

                    if (allDayAreUncheckedForRow(i)) {
                      if (i > 0) {
                        setDay(i - 1, day, true);
                      } else {
                        setDay(i + 1, day, true);
                      }
                      remove(i);
                      return;
                    }

                    if (fields.length - 1 === i) {
                      append({
                        ...defaultState,
                        days: {
                          Ma: false,
                          Ti: false,
                          Ke: false,
                          To: false,
                          Pe: false,
                          La: false,
                          Su: false,
                          [day]: true,
                        },
                      });
                      return;
                    }

                    setDay(i + 1, day, true);
                  }}
                  defaultValues={{
                    startTime: '09:00',
                    endTime: '20:00',
                    state: ResourceState.OPEN,
                  }}
                />
              ))}
            </section>
            <div className="opening-hours-form__buttons">
              <Button onClick={returnToResourcePage}>Tallenna</Button>
              <SecondaryButton onClick={returnToResourcePage}>
                Peruuta
              </SecondaryButton>
            </div>
          </div>
        </div>
      </FormProvider>
    )) || <h1>Ladataan...</h1>
  );
};
