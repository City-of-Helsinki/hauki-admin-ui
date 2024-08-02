import { DateInput, RadioButton, SelectionGroup } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { useAppContext } from '../../App-context';
import { Language, DatePeriod } from '../../common/lib/types';
import {
  endDateAfterStartDate,
  isValidDate,
} from '../../common/utils/form/validations';
import './NormalOpeningHoursValidity.scss';

const NormalOpeningHoursValidity = (): JSX.Element => {
  const { t } = useTranslation();
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
              label={t('OpeningHours.ValidityTitle')}
              required>
              <RadioButton
                id="opening-hours-validity-recurring"
                checked={!value}
                name={name}
                label={t('OpeningHours.ValidityRecurring')}
                value="recurring"
                onChange={(): void => onChange(false)}
              />
              <RadioButton
                data-test="opening-hours-validity-fixed-option"
                id="opening-hours-validity-fixed"
                checked={value}
                name={name}
                label={t('OpeningHours.ValidityFixed')}
                value="fixed"
                onChange={(): void => onChange(true)}
              />
            </SelectionGroup>
            <div className="opening-hours-validity__dates">
              <Controller
                defaultValue={startDate ?? ''}
                name="startDate"
                rules={{
                  required: t('Common.Mandatory'),
                  validate: isValidDate,
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
                    label={t('OpeningHours.PeriodBeginDate')}
                    language={language}
                    name={startDateField.name}
                    onBlur={startDateField.onBlur}
                    onChange={startDateField.onChange}
                    openButtonAriaLabel={t('OpeningHours.PeriodBeginDateAria')}
                    required
                    value={startDateField.value}
                    crossOrigin={undefined}
                  />
                )}
              />
              {fixed && (
                <Controller
                  defaultValue={endDate ?? ''}
                  name="endDate"
                  rules={{
                    required: t('Common.Mandatory'),
                    validate: {
                      validDate: isValidDate,
                      endDateAfterStartDate: endDateAfterStartDate(getValues),
                    },
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
                      label={t('OpeningHours.PeriodEndDateAria')}
                      language={language}
                      name={endDateField.name}
                      onBlur={endDateField.onBlur}
                      onChange={endDateField.onChange}
                      openButtonAriaLabel={t('OpeningHours.PeriodEndDateAria')}
                      required
                      value={endDateField.value}
                      crossOrigin={undefined}
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
