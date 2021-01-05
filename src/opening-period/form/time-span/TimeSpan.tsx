import React from 'react';
import { ArrayField, Controller, Control } from 'react-hook-form';
import { Button as HDSButton, IconTrash, Select, TextInput } from 'hds-react';
import Weekdays from './Weekdays';
import './TimeSpan.scss';
import TimeInput from './TimeInput';
import {
  UiFieldConfig,
  TimeSpanFormFormat,
  InputOption,
} from '../../../common/lib/types';

export default function TimeSpan({
  item,
  index,
  remove,
  register,
  control,
  resourceStateConfig,
}: {
  item: Partial<ArrayField<Record<string, TimeSpanFormFormat>>>;
  index: number;
  remove: Function;
  register: Function;
  control: Control;
  resourceStateConfig: UiFieldConfig;
}): JSX.Element {
  const { options: resourceStateOptions } = resourceStateConfig;

  return (
    <div data-test={`time-span-${index}`} className="time-span-container">
      <input
        type="hidden"
        name={`timeSpans[${index}].id`}
        defaultValue={item.id}
        ref={register()}
      />
      <div className="time-span-first-header-row form-control">
        <Weekdays index={index} item={item} register={register} />
        <HDSButton
          data-test={`remove-time-span-button-${index}`}
          className="opening-period-remove-list-item-button"
          variant="supplementary"
          onClick={(): void => remove(index)}
          iconLeft={<IconTrash />}>
          Poista aukioloaika
        </HDSButton>
      </div>
      <div className="form-control">
        <div className="start-and-end-time-container">
          <div className="start-time-container">
            <label
              htmlFor={`timeSpans[${index}].startTime`}
              className="start-time-container-label">
              Kellonaika *
            </label>
            <TimeInput
              ariaLabel="Aukiolon alkukellonaika"
              dataTest={`time-span-start-time-${index}`}
              register={register}
              defaultValue={`${item.startTime}`}
              required
              id={`timeSpans[${index}].startTime`}
              name={`timeSpans[${index}].startTime`}
              placeholder="--.--"
            />
          </div>
          <div className="dash-between-start-and-end-time-container">
            <p>—</p>
          </div>
          <TimeInput
            ariaLabel="Aukiolon loppukellonaika"
            dataTest={`time-span-end-time-${index}`}
            register={register}
            defaultValue={`${item.endTime}`}
            required
            id={`timeSpans[${index}].endTime`}
            name={`timeSpans[${index}].endTime`}
            placeholder="--.--"
          />
        </div>
      </div>
      <div className="form-control">
        <div className="time-span-state-container">
          <Controller
            control={control}
            name={`timeSpans[${index}].resourceState`}
            defaultValue={`${item.resourceState}`}
            render={({ onChange, value }): JSX.Element => (
              <Select
                id={`time-span-state-id-${index}`}
                onChange={(selected: InputOption): void => {
                  onChange(selected.value);
                }}
                className="time-span-state"
                defaultValue={resourceStateOptions.find(
                  (option: InputOption): boolean => option.value === value
                )}
                options={resourceStateOptions}
                label="Tyyppi"
                placeholder="Valitse tyyppi"
              />
            )}
          />
        </div>
      </div>
      <div className="form-control">
        <div className="time-span-description-container">
          <TextInput
            ref={register()}
            id={`time-span-${index}-description`}
            name={`timeSpans[${index}].description`}
            className="time-span-description"
            defaultValue={`${item.description || ''}`}
            label="Kuvaus"
            placeholder="Valinnainen lyhyt kuvaus esim. naisten vuoro"
          />
        </div>
      </div>
    </div>
  );
}
