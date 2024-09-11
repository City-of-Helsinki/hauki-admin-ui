import { Checkbox, IconTrash, Select, TextInput, TimeInput } from 'hds-react';
import { Controller, useFormContext } from 'react-hook-form';
import React, { MutableRefObject, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  InputOption,
  Language,
  ResourceState,
  TranslatedApiChoice,
  TimeSpan as TTimespan,
  DatePeriod,
} from '../../common/lib/types';
import { SupplementaryButton } from '../button/Button';
import './TimeSpan.scss';
import { useAppContext } from '../../App-context';
import {
  choiceToOption,
  getUiId,
  toCharCount,
} from '../../common/utils/form/form';
import {
  areStartAndEndTimesAllowed,
  isDescriptionAllowed,
} from '../../common/helpers/opening-hours-helpers';

type Props = {
  disabled?: boolean;
  groupLabel: string;
  i: number;
  item?: TTimespan;
  onDelete?: () => void;
  openingHoursIdx: number;
  resourceStates: TranslatedApiChoice[];
  timeSpanGroupIdx: number;
  innerRef?: MutableRefObject<HTMLElement | null>;
};

const TimeSpan = ({
  disabled = false,
  groupLabel,
  i,
  innerRef,
  item,
  onDelete,
  openingHoursIdx,
  resourceStates,
  timeSpanGroupIdx,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const namePrefix =
    `openingHours.${openingHoursIdx}.timeSpanGroups.${timeSpanGroupIdx}.timeSpans.${i}` as const;
  const { language = Language.FI } = useAppContext();
  const { control, watch } = useFormContext<DatePeriod>();
  const fullDay = watch(`${namePrefix}.full_day`);
  const resourceState = watch(`${namePrefix}.resource_state`);
  const sanitizedResourceStateOptions = resourceStates
    .filter((elem) => {
      if (elem.value === ResourceState.UNDEFINED) {
        return false;
      }

      if (i > 0 && elem.value === ResourceState.NO_OPENING_HOURS) {
        return false;
      }
      return true;
    })
    .map(choiceToOption(language));

  const descriptionMaxLength = 100;

  const descriptionRules = {
    maxLength: {
      value: descriptionMaxLength,
      message: t('OpeningHours.Validate'),
    },
  };

  const validateTime = (value: string | null) =>
    value && /\d{2}:\d{2}/.test(value) ? undefined : t('OpeningHours.Validate');

  const timeInputRules = {
    required: t('Common.Mandatory'),
    validate: validateTime,
  };

  const displayStartAndEndTimes =
    resourceState && areStartAndEndTimesAllowed(i, resourceState);

  const resourceStateName = `${namePrefix}.resource_state` as const;
  const resourceStateId = getUiId([resourceStateName]);

  useEffect(() => {
    if (innerRef) {
      // The toggle-button postfix comes from HDS and if that ever changes this will break
      // eslint-disable-next-line no-param-reassign
      innerRef.current = document.getElementById(
        `${resourceStateId}-toggle-button`
      );
    }
  }, [innerRef, resourceStateId]);

  return (
    <div
      className="time-span time-span--with-extra-fields"
      role="group"
      aria-label={groupLabel}>
      <Controller
        defaultValue={item?.resource_state ?? ResourceState.OPEN}
        name={resourceStateName}
        control={control}
        rules={{
          required: t('Common.Mandatory'),
        }}
        render={({ field: { onChange, value } }): JSX.Element => (
          <Select<InputOption>
            disabled={disabled}
            id={resourceStateId}
            label={t('OpeningHours.TimeSpanState')}
            options={sanitizedResourceStateOptions}
            className="time-span__resource-state-select"
            onChange={(option: InputOption): void => onChange(option.value)}
            placeholder={t('OpeningHours.TimeSpanStatePlaceholder')}
            required
            value={sanitizedResourceStateOptions.find(
              (option) => option.value === value
            )}
          />
        )}
      />
      {displayStartAndEndTimes && (
        <>
          <Controller
            defaultValue={item?.full_day ?? false}
            render={({ field }): JSX.Element => (
              <div className="time-span__full-day-checkbox-container">
                <Checkbox
                  className="time-span__full-day-checkbox"
                  disabled={disabled}
                  id={getUiId([namePrefix, 'full-day'])}
                  name={`${namePrefix}.full_day`}
                  label={t('OpeningHours.TimeSpan24h')}
                  onChange={(e): void => {
                    field.onChange(e.target.checked);
                  }}
                  checked={field.value}
                />
              </div>
            )}
            control={control}
            name={`${namePrefix}.full_day`}
          />
          {!fullDay && (
            <>
              <div className="time-span__range">
                <Controller
                  control={control}
                  name={`${namePrefix}.start_time`}
                  defaultValue={item?.start_time ?? ''}
                  render={({ field, fieldState }): JSX.Element => (
                    <TimeInput
                      disabled={disabled}
                      errorText={fieldState.error?.message}
                      hoursLabel={t('OpeningHours.TimeSpanHoursLabel')}
                      id={getUiId([namePrefix, 'start-time'])}
                      invalid={!!fieldState.error?.message}
                      label={t('OpeningHours.TimeSpanBegins')}
                      minutesLabel={t('OpeningHours.TimeSpanMinutesLabel')}
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      required
                      ref={field.ref}
                      value={field.value ?? ''}
                      crossOrigin={undefined}
                    />
                  )}
                  rules={timeInputRules}
                />
                <Controller
                  control={control}
                  name={`${namePrefix}.end_time`}
                  defaultValue={item?.end_time ?? ''}
                  render={({ field, fieldState }): JSX.Element => (
                    <TimeInput
                      disabled={disabled}
                      errorText={fieldState.error?.message}
                      hoursLabel={t('OpeningHours.TimeSpanHoursLabel')}
                      id={getUiId([namePrefix, 'end-time'])}
                      invalid={!!fieldState.error?.message}
                      label={t('OpeningHours.TimeSpanEnds')}
                      minutesLabel={t('OpeningHours.TimeSpanMinutesLabel')}
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      ref={field.ref}
                      required
                      value={field.value ?? ''}
                      crossOrigin={undefined}
                    />
                  )}
                  rules={timeInputRules}
                />
              </div>
            </>
          )}
        </>
      )}
      {resourceState && isDescriptionAllowed(resourceState) && (
        <>
          <div className="time-span__descriptions">
            <Controller
              defaultValue={item?.description.fi ?? ''}
              name={`${namePrefix}.description.fi`}
              rules={descriptionRules}
              render={({
                field: { name, onChange, onBlur, value },
                fieldState: { error },
              }): JSX.Element => (
                <TextInput
                  errorText={error?.message}
                  helperText={toCharCount(descriptionMaxLength, value)}
                  id={getUiId([name])}
                  invalid={!!error}
                  label={t('OpeningHours.DescriptionInFinnish')}
                  name={name}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder={t(
                    'OpeningHours.DescriptionPlaceholderInFinnish'
                  )}
                  value={value || ''}
                />
              )}
            />
            <Controller
              defaultValue={item?.description.sv ?? ''}
              name={`${namePrefix}.description.sv`}
              rules={descriptionRules}
              render={({
                field: { name, onChange, onBlur, value },
                fieldState: { error },
              }): JSX.Element => (
                <TextInput
                  errorText={error?.message}
                  helperText={toCharCount(descriptionMaxLength, value)}
                  id={getUiId([name])}
                  invalid={!!error}
                  label={t('OpeningHours.DescriptionInSwedish')}
                  name={name}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder={t(
                    'OpeningHours.DescriptionPlaceholderInSwedish'
                  )}
                  value={value || ''}
                />
              )}
            />
            <Controller
              defaultValue={item?.description.en ?? ''}
              name={`${namePrefix}.description.en`}
              rules={descriptionRules}
              render={({
                field: { name, onChange, onBlur, value },
                fieldState: { error },
              }): JSX.Element => (
                <TextInput
                  errorText={error?.message}
                  helperText={toCharCount(descriptionMaxLength, value)}
                  id={getUiId([name])}
                  invalid={!!error}
                  label={t('OpeningHours.DescriptionInEnglish')}
                  name={name}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder={t(
                    'OpeningHours.DescriptionPlaceholderInEnglish'
                  )}
                  value={value || ''}
                />
              )}
            />
          </div>
        </>
      )}
      <div className="remove-time-span-button">
        {onDelete && (
          <SupplementaryButton iconLeft={<IconTrash />} onClick={onDelete}>
            {t('OpeningHours.RemoveTimeSpanButton')}
            <span className="visually-hidden">{groupLabel}</span>
          </SupplementaryButton>
        )}
      </div>
    </div>
  );
};

export default TimeSpan;
