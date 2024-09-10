import { DateInput, SelectionGroup } from 'hds-react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useAppContext } from '../../App-context';
import { DatePeriod, Language, ResourceState } from '../../common/lib/types';
import { parseFormDate } from '../../common/utils/date-time/format';
import {
  endDateAfterStartDate,
  isValidDate,
} from '../../common/utils/form/validations';
import { defaultTimeSpanGroup } from '../../constants';
import ExceptionOpeningHoursStateToggle from '../exception-opening-hours-state-toggle/ExceptionOpeningHoursStateToggle';
import './ExceptionOpeningHoursValidity.scss';

const ExceptionOpeningHoursValidity = (): JSX.Element => {
  const { t } = useTranslation();
  const { language = Language.FI } = useAppContext();
  const { getValues, setValue, watch } = useFormContext<DatePeriod>();
  const [startDate, endDate, resourceState] = watch([
    'startDate',
    'endDate',
    'resourceState',
  ]);

  return (
    <div className="card">
      <div className="exception-opening-hours-validity">
        <SelectionGroup
          className="exception-opening-hours-validity__title"
          label={t('OpeningHours.ExceptionOpeningHoursValidity')}
          required>
          <div className="exception-opening-hours-validity__dates">
            <Controller
              defaultValue={startDate ?? ''}
              name="startDate"
              render={({
                field: { name, onBlur, onChange, ref, value },
                fieldState,
              }): JSX.Element => (
                <DateInput
                  id="exception-start-date"
                  className="exception-date"
                  data-testid="exception-start-date"
                  disableConfirmation
                  ref={ref}
                  errorText={fieldState.error?.message}
                  initialMonth={new Date()}
                  label={t('OpeningHours.ExceptionStartDate')}
                  language={language}
                  name={name}
                  onChange={(newStartDate) => {
                    onChange(newStartDate);
                    if (
                      endDate &&
                      parseFormDate(newStartDate).getTime() >
                        parseFormDate(endDate).getTime()
                    ) {
                      setValue('endDate', newStartDate);
                    }
                  }}
                  onBlur={onBlur}
                  openButtonAriaLabel={t('OpeningHours.ExceptionStartDateAria')}
                  required
                  value={value}
                  crossOrigin={undefined}
                />
              )}
              rules={{
                required: t('Common.Mandatory'),
                validate: isValidDate,
              }}
            />
            <Controller
              defaultValue={endDate ?? ''}
              name="endDate"
              render={({
                field: { name, onBlur, onChange, ref, value },
                fieldState,
              }): JSX.Element => (
                <DateInput
                  id="exception-end-date"
                  className="exception-date"
                  data-testid="exception-end-date"
                  disableConfirmation
                  ref={ref}
                  errorText={fieldState.error?.message}
                  initialMonth={new Date()}
                  label={t('OpeningHours.ExceptionEndDate')}
                  language={language}
                  name={name}
                  onChange={onChange}
                  onBlur={onBlur}
                  openButtonAriaLabel={t('OpeningHours.ExceptionEndDateAria')}
                  required
                  value={value}
                  crossOrigin={undefined}
                />
              )}
              rules={{
                required: t('Common.Mandatory'),
                validate: {
                  validDate: isValidDate,
                  endDateAfterStartDate: endDateAfterStartDate(getValues),
                },
              }}
            />
          </div>
        </SelectionGroup>
      </div>
      <ExceptionOpeningHoursStateToggle
        id="exception-opening-hours-form"
        onClose={(): void => {
          setValue('resourceState', ResourceState.CLOSED);
          setValue('openingHours', []);
        }}
        onOpen={(): void => {
          setValue('resourceState', ResourceState.UNDEFINED);
          setValue('openingHours', [
            {
              timeSpanGroups: [defaultTimeSpanGroup],
              weekdays: [],
            },
          ]);
        }}
        initiallyOpen={
          resourceState ? resourceState !== ResourceState.CLOSED : false
        }
      />
    </div>
  );
};

export default ExceptionOpeningHoursValidity;
