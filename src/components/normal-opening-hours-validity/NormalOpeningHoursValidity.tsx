import { DateInput, RadioButton, SelectionGroup } from 'hds-react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useAppContext } from '../../App-context';
import { Language, DatePeriod } from '../../common/lib/types';
import { endDateAfterStartDate } from '../../common/utils/form/validations';
import './NormalOpeningHoursValidity.scss';

const NormalOpeningHoursValidity = (): JSX.Element => {
  const { language = Language.FI } = useAppContext();
  const { control, getValues, watch } = useFormContext<DatePeriod>();
  const [startDate, endDate, fixed] = watch(['startDate', 'endDate', 'fixed']);

  return (
    <div className="card opening-hours-validity__selections">
      <Controller
        control={control}
        name="fixed"
        render={({ field: { name, onChange, value } }): JSX.Element => (
          <>
            <SelectionGroup
              className="opening-hours-validity__title"
              label="Aukiolon voimassaoloaika"
              required>
              <RadioButton
                id="opening-hours-validity-recurring"
                checked={!value}
                name={name}
                label="Toistaiseksi voimassa"
                value="recurring"
                onChange={(): void => onChange(false)}
              />
              <RadioButton
                data-test="opening-hours-validity-fixed-option"
                id="opening-hours-validity-fixed"
                checked={value}
                name={name}
                label="Voimassa tietyn ajan"
                value="fixed"
                onChange={(): void => onChange(true)}
              />
            </SelectionGroup>
            <div className="opening-hours-validity__dates">
              <Controller
                defaultValue={startDate ?? ''}
                name="startDate"
                rules={{
                  required: 'Pakollinen',
                }}
                render={({
                  field: startDateField,
                  fieldState,
                }): JSX.Element => (
                  <DateInput
                    ref={startDateField.ref}
                    className="opening-hours-validity__date"
                    data-test="opening-period-begin-date"
                    disableConfirmation
                    id="opening-hours-start-date"
                    initialMonth={new Date()}
                    errorText={fieldState.error?.message}
                    invalid={!!fieldState.error}
                    label="Astuu voimaan"
                    language={language}
                    name={startDateField.name}
                    onBlur={startDateField.onBlur}
                    onChange={startDateField.onChange}
                    openButtonAriaLabel="Valitse alkupäivämäärä"
                    required
                    value={startDateField.value}
                  />
                )}
              />
              {fixed && (
                <Controller
                  defaultValue={endDate ?? ''}
                  name="endDate"
                  rules={{
                    required: 'Pakollinen',
                    validate: endDateAfterStartDate(getValues),
                  }}
                  render={({
                    field: endDateField,
                    fieldState,
                  }): JSX.Element => (
                    <DateInput
                      ref={endDateField.ref}
                      className="opening-hours-validity__date"
                      data-test="opening-period-end-date"
                      disableConfirmation
                      id="opening-hours-end-date"
                      initialMonth={new Date()}
                      errorText={fieldState.error?.message}
                      invalid={!!fieldState.error}
                      label="Päättyy"
                      language={language}
                      name={endDateField.name}
                      onBlur={endDateField.onBlur}
                      onChange={endDateField.onChange}
                      openButtonAriaLabel="Valitse loppupäivämäärä"
                      required
                      value={endDateField.value}
                    />
                  )}
                />
              )}
            </div>
          </>
        )}
      />
    </div>
  );
};

export default NormalOpeningHoursValidity;
